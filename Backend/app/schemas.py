# ======= updated schemas.py =======
from pydantic import BaseModel, EmailStr, validator
from typing import List, Union, Dict
from datetime import datetime
import re

# Auth
class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator("password")
    def password_strength(cls, v: str) -> str:
        # Password rules: min 8 chars, at least one lowercase, one uppercase, one digit, one special char
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
        if not re.match(pattern, v):
            raise ValueError(
                "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit and one special character"
            )
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# User response (for /auth/me)
class UserResponse(BaseModel):
    username: str
    email: EmailStr
    created_at: datetime

# Quiz
class QuizQuestion(BaseModel):
    question: str
    options: List[str]

from typing import Any

class QuizCheckResponse(BaseModel):
    video_id: str
    course_title: str
    marks: int | None = None
    percentage: float | None = None
    result: Dict[str, Any]


class QuizCheckResponse(BaseModel):
    video_id: str
    course_title: str 
    result: Dict

# Video->Quiz
class VideoToQuizRequest(BaseModel):
    course_title: str
    num_questions: int
    quiz_type: str
    passing_criteria: int

class VideoToQuizResponse(BaseModel):
    course_title: str
    course_video_name: str
    transcript: str
    passing_criteria: int
    quiz: List[QuizQuestion]
    video_id: str

# Progress
class SaveProgressRequest(BaseModel):
    user_username: str
    video_id: str
    progress_time: float

class GetProgressResponse(BaseModel):
    progress_time: float
