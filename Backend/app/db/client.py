from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger("db.client")

_client: AsyncIOMotorClient | None = None

def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        logger.info("Creating AsyncIOMotorClient")
        _client = AsyncIOMotorClient(settings.mongodb_url)
    return _client

def get_db():
    client = get_client()
    return client[settings.mongodb_db]
