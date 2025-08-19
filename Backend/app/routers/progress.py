from fastapi import APIRouter, HTTPException
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
