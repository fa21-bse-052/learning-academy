# ======= updated router (video endpoints) =======
import os
import uuid
import json
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Query
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.logger import get_logger
from app.schemas import VideoToQuizResponse, QuizQuestion, QuizCheckResponse
from app.services.audio.extractor import extract_audio
from app.services.transcribe.transcriber import transcribe
from app.services.quiz.generator import generate_quiz
from app.services.certificate.generator import generate_certificate
from app.db.client import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["video"])
logger = get_logger("routers.video")

# Ensure tmp dir exists
os.makedirs(settings.tmp_dir, exist_ok=True)
os.makedirs(settings.certificates_dir, exist_ok=True)


@router.post("/video-to-quiz", response_model=VideoToQuizResponse)
async def video_to_quiz(
    course_title: str = Form(...),
    passing_criteria: int = Form(...),
    num_questions: int = Form(...),
    video_file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)  # require auth
):
    # Generate unique video_id
    video_id = uuid.uuid4().hex

    # Prepare paths
    ext = os.path.splitext(video_file.filename or "")[1] or ".mp4"
    video_path = os.path.join(settings.tmp_dir, f"{video_id}{ext}")
    audio_path = os.path.join(settings.tmp_dir, f"{video_id}.mp3")

    # Save uploaded video
    try:
        contents = await video_file.read()
        with open(video_path, "wb") as f:
            f.write(contents)
        logger.info("Saved uploaded video to %s", video_path)
    except Exception as e:
        logger.exception("Failed saving uploaded video")
        raise HTTPException(status_code=400, detail=str(e))

    # Extract audio
    try:
        await asyncio.to_thread(extract_audio, video_path, audio_path)
        logger.info("Audio extracted to %s", audio_path)
    except Exception as e:
        logger.exception("Audio extraction failed")
        raise HTTPException(status_code=400, detail=f"Audio extraction failed: {e}")

    # Transcribe
    try:
        transcript = await asyncio.to_thread(transcribe, audio_path)
        logger.info("Transcription length: %d", len(transcript))
    except Exception as e:
        logger.exception("Transcription failed")
        raise HTTPException(status_code=500, detail=f"Transcription error: {e}")

    # Generate quiz
    try:
        raw_quiz = await asyncio.to_thread(generate_quiz, transcript, num_questions)
    except Exception as e:
        logger.exception("Quiz generation failed")
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {e}")

    # Save to DB (store quiz as JSON string)
    try:
        db = get_db()
        courses = db["courses"]
        course_doc = {
            "video_id": video_id,  # unique ID
            "course_title": course_title,
            "course_video_name": video_file.filename,
            "transcript": transcript,
            "passing_criteria": passing_criteria,
            "quiz": raw_quiz,
            "created_by": current_user.get("email"),
            "created_at": __import__("datetime").datetime.utcnow()
        }
        await courses.insert_one(course_doc)
        logger.info("Course with video_id %s inserted into DB", video_id)
    except Exception as e:
        logger.exception("DB insert failed")
        raise HTTPException(status_code=500, detail=f"DB insert error: {e}")

    # parse quiz for response model and remove 'answer' and 'type' keys if present
    try:
        parsed_quiz = json.loads(raw_quiz) if isinstance(raw_quiz, str) else raw_quiz
    except Exception:
        parsed_quiz = []

    sanitized_quiz = []
    if isinstance(parsed_quiz, list):
        for item in parsed_quiz:
            if isinstance(item, dict):
                sanitized_quiz.append({
                    "question": item.get("question"),
                    "options": item.get("options", [])
                })

    return VideoToQuizResponse(
        course_title=course_title,
        course_video_name=video_file.filename,
        transcript=transcript,
        passing_criteria=passing_criteria,
        quiz=sanitized_quiz,
        video_id=video_id  # return video_id for future reference
    )


@router.get("/check-quiz", response_model=QuizCheckResponse)
async def check_quiz_endpoint(
    video_id: str = Query(..., description="UUID of the video"),
    answers: str = Query(..., description="JSON encoded list of answers"),
    current_user: dict = Depends(get_current_user)
):
    from app.services.quiz.checker import check_quiz_answers_llm

    try:
        # parse answers JSON string
        try:
            answers_list = json.loads(answers)
        except Exception:
            raise HTTPException(status_code=400, detail="answers must be valid JSON list")

        if not isinstance(answers_list, list):
            raise HTTPException(status_code=400, detail="answers must be a list")

        # DB handle
        db = get_db()
        courses = db["courses"]

        # fetch course by video_id
        course_doc = await courses.find_one({"video_id": video_id})
        if not course_doc:
            raise HTTPException(status_code=404, detail="Course not found for given video_id")

        transcript = course_doc.get("transcript", "")

        # quiz stored as string → parse into list/dict
        raw_quiz = course_doc.get("quiz", "[]")
        try:
            quiz_obj = json.loads(raw_quiz) if isinstance(raw_quiz, str) else raw_quiz
        except Exception:
            quiz_obj = []

        # run checker
        result = await asyncio.to_thread(check_quiz_answers_llm, quiz_obj, answers_list, transcript)

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
        logger.exception("Quiz check failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/certificate")
async def create_certificate(name: str = Form(...), current_user: dict = Depends(get_current_user)):
    try:
        path = await asyncio.to_thread(generate_certificate, name)
        return FileResponse(path, media_type="application/pdf", filename=os.path.basename(path))
    except Exception as e:
        logger.exception("Certificate generation failed")
        raise HTTPException(status_code=500, detail=str(e))
