# app/routers/video.py
import os
import re
import uuid
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.logger import get_logger
from app.schemas import VideoToQuizResponse, QuizCheckResponse, QuizQuestion
from app.services.audio.extractor import extract_audio
from app.services.transcribe.transcriber import transcribe
from app.services.quiz.generator import generate_quiz
from app.services.certificate.generator import generate_certificate
from app.db.client import get_db

router = APIRouter(prefix="/api", tags=["video"])
logger = get_logger("routers.video")

# Ensure tmp dirs exist
os.makedirs(settings.tmp_dir, exist_ok=True)
os.makedirs(settings.certificates_dir, exist_ok=True)


def _parse_raw_quiz(raw_quiz: Any) -> List[Dict[str, Any]]:
    """
    Accept either:
      - a JSON string representing a list or dict
      - an already parsed list/dict from Groq's JSON mode
    Normalize to a list of question dicts. If top-level dict contains "quiz",
    extract it. If shape unexpected, return empty list.
    """
    if isinstance(raw_quiz, str):
        try:
            parsed = json.loads(raw_quiz)
        except Exception:
            logger.exception("Failed to json.loads raw_quiz")
            return []
    else:
        parsed = raw_quiz

    if isinstance(parsed, dict) and "quiz" in parsed:
        quiz_list = parsed["quiz"]
    elif isinstance(parsed, list):
        quiz_list = parsed
    else:
        logger.warning("Unexpected quiz shape: %s", type(parsed))
        quiz_list = []

    if not isinstance(quiz_list, list):
        logger.warning("Quiz is not a list after extraction, got: %s", type(quiz_list))
        return []

    # Ensure each item is a dict
    normalized = []
    for item in quiz_list:
        if isinstance(item, dict):
            normalized.append(item)
        else:
            logger.warning("Skipping non-dict quiz item: %s", item)
    return normalized


@router.post("/video-to-quiz", response_model=VideoToQuizResponse)
async def video_to_quiz(
    course_title: str = Form(...),
    passing_criteria: int = Form(...),
    num_questions: int = Form(...),
    video_file: UploadFile = File(...)
):
    """
    Create a new course from an uploaded video, generate transcript + quiz,
    and store it in DB. Rejects duplicate course_title (case-insensitive).
    Response includes quiz with answers.
    """
    db = get_db()
    courses = db["courses"]

    # Case-insensitive duplicate-title check
    title_regex = {"$regex": f"^{re.escape(course_title)}$", "$options": "i"}
    existing = await courses.find_one({"course_title": title_regex})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"A course with title '{course_title}' already exists."
        )

    video_id = uuid.uuid4().hex
    ext = os.path.splitext(video_file.filename or "")[1] or ".mp4"
    video_path = os.path.join(settings.tmp_dir, f"{video_id}{ext}")
    audio_path = os.path.join(settings.tmp_dir, f"{video_id}.mp3")

    # Save uploaded video
    try:
        contents = await video_file.read()
        with open(video_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        logger.exception("Failed to save uploaded video: %s", e)
        raise HTTPException(status_code=400, detail=str(e))

    # Extract audio
    try:
        await asyncio.to_thread(extract_audio, video_path, audio_path)
    except Exception as e:
        logger.exception("Audio extraction failed: %s", e)
        raise HTTPException(status_code=400, detail=f"Audio extraction failed: {e}")

    # Transcribe
    try:
        transcript = await asyncio.to_thread(transcribe, audio_path)
    except Exception as e:
        logger.exception("Transcription error: %s", e)
        raise HTTPException(status_code=500, detail=f"Transcription error: {e}")

    # Generate quiz (Groq JSON mode expected to return a list/dict containing quiz)
    try:
        raw_quiz = await asyncio.to_thread(generate_quiz, transcript, num_questions)
        # raw_quiz expected to be a JSON string (list) per generator implementation
    except Exception as e:
        logger.exception("Quiz generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {e}")

    # Parse quiz for response and DB storage
    parsed_quiz_list = _parse_raw_quiz(raw_quiz)

    # Build quiz_answers (list of answer texts) and sanitized_quiz (includes answer)
    quiz_answers: List[str] = []
    sanitized_quiz: List[Dict[str, Any]] = []

    for item in parsed_quiz_list:
        question_text = item.get("question", "")
        options = item.get("options", []) if isinstance(item.get("options", []), list) else []
        answer = item.get("answer")

        # If answer missing but answer_index provided, try mapping
        if (answer is None or (isinstance(answer, (int, float)) and not isinstance(answer, str))) and "answer_index" in item:
            try:
                idx = int(item.get("answer_index"))
                if 0 <= idx < len(options):
                    answer = options[idx]
            except Exception:
                answer = None

        # If answer is an index-like string "0", try to cast
        if answer is not None and not isinstance(answer, str):
            try:
                answer = str(answer)
            except Exception:
                answer = None

        # Final safety: if answer text still not found, set to empty string
        answer_text = answer if isinstance(answer, str) else ""

        quiz_answers.append(answer_text)
        sanitized_quiz.append({
            "question": question_text,
            "options": options,
            "answer": answer_text
        })

    # Save course to DB
    try:
        course_doc = {
            "video_id": video_id,
            "course_title": course_title,
            "course_video_name": video_file.filename,
            "transcript": transcript,
            "passing_criteria": passing_criteria,
            # store the raw value returned by generator (string or parsed) for fidelity
            "quiz": raw_quiz,
            "quiz_answers": quiz_answers,
            "created_at": datetime.utcnow(),
        }
        await courses.insert_one(course_doc)
    except Exception as e:
        logger.exception("DB insert error: %s", e)
        raise HTTPException(status_code=500, detail=f"DB insert error: {e}")

    return VideoToQuizResponse(
        course_title=course_title,
        course_video_name=video_file.filename,
        transcript=transcript,
        passing_criteria=passing_criteria,
        quiz=sanitized_quiz,
        video_id=video_id
    )

@router.get("/check-quiz", response_model=QuizCheckResponse)
async def check_quiz_endpoint(
    video_id: str = Query(..., description="UUID of the video"),
    answers: str = Query(..., description="JSON encoded list of answers")
):
    """
    Check submitted answers against stored quiz for a given video_id.
    - `answers` should be a JSON list of answer strings or indices (frontend choice).
    - Correct answers are read from the DB (course_doc['quiz_answers'] if present,
      otherwise extracted from the stored quiz).
    - Transcript is NOT used.
    """
    from app.services.quiz.checker import check_quiz_answers_llm

    try:
        # parse submitted answers
        answers_list = json.loads(answers)
        if not isinstance(answers_list, list):
            raise HTTPException(status_code=400, detail="answers must be a list")

        db = get_db()
        courses = db["courses"]

        course_doc = await courses.find_one({"video_id": video_id})
        if not course_doc:
            raise HTTPException(status_code=404, detail="Course not found")

        # Get stored quiz (raw) and normalize to a list of question dicts
        raw_quiz = course_doc.get("quiz", "[]")
        quiz_obj = _parse_raw_quiz(raw_quiz)

        # Obtain correct answers from DB if available
        correct_answers = course_doc.get("quiz_answers")
        if not isinstance(correct_answers, list) or not correct_answers:
            # Fallback: extract "answer" (or map answer_index) from each question item
            correct_answers = []
            for item in quiz_obj:
                ans = None
                if isinstance(item, dict):
                    # direct answer text
                    if "answer" in item and isinstance(item["answer"], str):
                        ans = item["answer"]
                    # fallback to answer_index -> map to options if possible
                    elif "answer_index" in item and isinstance(item.get("options"), list):
                        try:
                            idx = int(item.get("answer_index"))
                            opts = item.get("options", [])
                            if 0 <= idx < len(opts):
                                ans = opts[idx]
                        except Exception:
                            ans = None
                correct_answers.append(ans if isinstance(ans, str) else "")

        # Call the checker LLM in a thread. Pass (quiz_obj, user_answers, correct_answers).
        # (Checker should accept these args and return a dict with at least 'marks' and 'percentage'.)
        result = await asyncio.to_thread(check_quiz_answers_llm, quiz_obj, answers_list, correct_answers)

        return {
            "video_id": video_id,
            "course_title": course_doc.get("course_title"),
            "marks": result.get("marks"),
            "percentage": result.get("percentage"),
            "result": result
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in check_quiz_endpoint: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/certificate")
async def create_certificate(
    video_id: str = Form(...),
    name: str = Form(...),
    user_percentage: float = Form(...)
):
    """
    Generate a completion certificate PDF and return it.
    
    The endpoint accepts:
     - video_id: to lookup course details,
     - name: user's name,
     - user_percentage: user's quiz percentage.
     
    A certificate is issued if the user's percentage meets the course's passing criteria.
    """
    try:
        # Directly await the async certificate generator function
        cert_path = await generate_certificate(video_id, name, user_percentage)
        return FileResponse(cert_path, media_type="application/pdf", filename=os.path.basename(cert_path))
    except Exception as e:
        logger.exception("Certificate generation failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/courses")
async def list_courses():
    """
    Return all courses in the DB (basic fields).
    """
    try:
        db = get_db()
        courses = db["courses"]

        cursor = courses.find(
            {},
            {
                "_id": 1,
                "video_id": 1,
                "course_title": 1,
                "course_video_name": 1,
                "passing_criteria": 1,
                "created_at": 1,
            },
        )

        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)

        return {"count": len(results), "courses": results}

    except Exception as e:
        logger.exception("Error listing courses: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/courses/{video_id}")
async def delete_course(video_id: str):
    """
    Delete a course by its video_id.
    """
    try:
        db = get_db()
        courses = db["courses"]

        result = await courses.delete_one({"video_id": video_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")

        return {"message": f"Course with video_id {video_id} deleted successfully."}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error deleting course: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/quiz/{video_id}")
async def get_quiz(video_id: str):
    """
    Fetch quiz for a specific course by video_id (includes course_title and answers).
    """
    try:
        db = get_db()
        courses = db["courses"]

        course_doc = await courses.find_one({"video_id": video_id})
        if not course_doc:
            raise HTTPException(status_code=404, detail="Course not found")

        raw_quiz = course_doc.get("quiz", "[]")
        parsed_quiz = _parse_raw_quiz(raw_quiz)

        # Ensure returned items include question, options, answer
        sanitized = []
        for item in parsed_quiz:
            q = item.get("question")
            opts = item.get("options", []) if isinstance(item.get("options", []), list) else []
            ans = item.get("answer")
            # fallback to answer_index mapping
            if (ans is None or not isinstance(ans, str)) and "answer_index" in item:
                try:
                    idx = int(item.get("answer_index"))
                    if 0 <= idx < len(opts):
                        ans = opts[idx]
                except Exception:
                    ans = ans or ""
            ans = ans if isinstance(ans, str) else ""
            sanitized.append({"question": q, "options": opts, "answer": ans})

        return {
            "video_id": video_id,
            "course_title": course_doc.get("course_title"),
            "quiz": sanitized
        }

    except Exception as e:
        logger.exception("Error fetching quiz: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/quizzes")
async def list_quizzes():
    """
    List all quizzes with their course names (includes answers).
    """
    try:
        db = get_db()
        courses = db["courses"]

        cursor = courses.find({}, {"video_id": 1, "course_title": 1, "quiz": 1})
        results = []
        async for doc in cursor:
            raw_quiz = doc.get("quiz", "[]")
            parsed_quiz = _parse_raw_quiz(raw_quiz)
            sanitized = []
            for item in parsed_quiz:
                q = item.get("question")
                opts = item.get("options", []) if isinstance(item.get("options", []), list) else []
                ans = item.get("answer")
                if (ans is None or not isinstance(ans, str)) and "answer_index" in item:
                    try:
                        idx = int(item.get("answer_index"))
                        if 0 <= idx < len(opts):
                            ans = opts[idx]
                    except Exception:
                        ans = ans or ""
                ans = ans if isinstance(ans, str) else ""
                sanitized.append({"question": q, "options": opts, "answer": ans})

            results.append({
                "video_id": doc.get("video_id"),
                "course_title": doc.get("course_title"),
                "quiz": sanitized
            })

        return {"count": len(results), "quizzes": results}

    except Exception as e:
        logger.exception("Error listing quizzes: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
