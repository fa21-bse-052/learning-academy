from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.schemas import SaveProgressRequest, GetProgressResponse
from app.db.client import get_db
from app.core.logger import get_logger
from datetime import datetime

router = APIRouter(prefix="/progress", tags=["progress"])
logger = get_logger("routers.progress")


@router.post("/save")
async def save_progress(payload: SaveProgressRequest):
    db = get_db()
    coll = db["video_progress"]
    await coll.update_one(
        {"user_email": payload.user_email, "video_id": payload.video_id},
        {"$set": {"progress_time": payload.progress_time, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"message": "Progress saved"}


@router.get("/get", response_model=GetProgressResponse)
async def get_progress(user_email: str, video_id: str):
    db = get_db()
    coll = db["video_progress"]
    record = await coll.find_one({"user_email": user_email, "video_id": video_id})
    if not record:
        raise HTTPException(status_code=404, detail="No progress found")
    return {"progress_time": record["progress_time"]}


# ---------------------------
# New: enrollment endpoints
# ---------------------------

class EnrollRequest(BaseModel):
    user_email: str
    course_name: str
    video_id: str


class EnrolledCourseResponse(BaseModel):
    course_name: str
    video_id: str
    enrolled_at: datetime


@router.post("/enrolled")
async def enroll(payload: EnrollRequest):
    """
    Create or update an enrollment record for a user & video.
    Upserts on (user_email, video_id) to avoid duplicates.
    """
    db = get_db()
    coll = db["enrollments"]
    result = await coll.update_one(
        {"user_email": payload.user_email, "video_id": payload.video_id},
        {"$set": {"course_name": payload.course_name, "enrolled_at": datetime.utcnow()}},
        upsert=True
    )

    logger.info("Enrollment saved for %s video=%s", payload.user_email, payload.video_id)
    return {"message": "Enrollment saved"}


@router.get("/enrolled", response_model=List[EnrolledCourseResponse])
async def get_enrolled(user_email: str):
    """
    Return all enrollments for a given user_email.
    """
    db = get_db()
    coll = db["enrollments"]

    cursor = coll.find(
        {"user_email": user_email},
        {"_id": 0, "course_name": 1, "video_id": 1, "enrolled_at": 1}
    )
    enrollments = await cursor.to_list(length=None)

    if not enrollments:
        raise HTTPException(status_code=404, detail="No enrollments found for this email")

    return enrollments
