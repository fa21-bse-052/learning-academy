import os
import asyncio
from fastapi import FastAPI
from app.core.logger import get_logger
from app.core.config import settings
from app.routers import auth, video, progress
from fastapi.middleware.cors import CORSMiddleware

logger = get_logger("app.main")

app = FastAPI(title="Video→Quiz API (modular)")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth.router)
app.include_router(video.router)
app.include_router(progress.router)

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", settings.port)), reload=True)

@app.get("/")
async def root():
    return {"message": "Welcome to the Video→Quiz API"}