import os
from moviepy import VideoFileClip
from app.core.logger import get_logger

logger = get_logger("services.audio.extractor")

def extract_audio(video_path: str, audio_path: str) -> None:
    """
    Extract audio from `video_path` and save to `audio_path`.
    This is synchronous (use asyncio.to_thread to call from async).
    """
    logger.info("extract_audio: %s -> %s", video_path, audio_path)

    if not os.path.isfile(video_path):
        logger.error("Video file missing: %s", video_path)
        raise FileNotFoundError(f"Video not found: {video_path}")

    with VideoFileClip(video_path) as clip:
        if clip.audio is None:
            logger.error("No audio track present in video: %s", video_path)
            raise RuntimeError("No audio track present in video")
        clip.audio.write_audiofile(audio_path)
    logger.info("Audio written: %s", audio_path)
