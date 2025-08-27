import os
from functools import lru_cache
from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger("services.transcribe.transcriber")

# Try to import Groq client (preferred if available)
_groq_client = None
if settings.groq_api_key:
    try:
        from groq import Groq  # type: ignore
        _groq_client = Groq(api_key=settings.groq_api_key)
        logger.info("Groq client initialized")
    except Exception as e:
        logger.warning("Groq client import failed: %s", e)
        _groq_client = None


# Lazily load Whisper model, only once
@lru_cache(maxsize=1)
def get_whisper_model():
    try:
        import whisper  # type: ignore
        logger.info("Loading local Whisper model (small)...")
        model = whisper.load_model("small")
        logger.info("Whisper model loaded successfully")
        return model
    except Exception as e:
        logger.error("Failed to load Whisper model: %s", e)
        return None


def transcribe(audio_path: str) -> str:
    """
    Transcribe audio_path. Prefer Groq if available, else whisper model if installed.
    If neither available, raise RuntimeError.
    """
    logger.info("Transcribing audio: %s", audio_path)
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio not found: {audio_path}")

    # --- Try Groq first ---
    if _groq_client:
        logger.info("Using Groq transcription backend")
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
        transcription = _groq_client.audio.transcriptions.create(
            file=(os.path.basename(audio_path), audio_bytes),
            model="whisper-large-v3",
            response_format="verbose_json"
        )
        text = getattr(transcription, "text", None) or transcription.get("text", "")
        return text

    # --- Fallback: local Whisper ---
    whisper_model = get_whisper_model()
    if whisper_model:
        logger.info("Using local Whisper transcription backend")
        result = whisper_model.transcribe(audio_path)
        return result.get("text", "")

    # --- If nothing available ---
    logger.error("No transcription backend available. Set GROQ_API_KEY or install whisper.")
    raise RuntimeError("No transcription backend available. Set GROQ_API_KEY or install whisper.")
