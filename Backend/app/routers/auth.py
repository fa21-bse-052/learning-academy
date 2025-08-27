# ======= updated app/routers/auth.py =======
from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional, List
from app.core.config import settings
from app.db.client import get_db
from app.schemas import SignupRequest, TokenResponse, UserResponse
from app.core.logger import get_logger

logger = get_logger("routers.auth")
router = APIRouter(prefix="/auth", tags=["auth"])

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _create_access_token(data: dict, expires_minutes: Optional[int] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=(expires_minutes or settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token


async def get_user_by_email(email: str):
    """Return user document by email."""
    db = get_db()
    users = db["users"]
    return await users.find_one({"email": email})


async def get_user_by_username(username: str):
    """(Optional) Return user document by username — kept for other uses."""
    db = get_db()
    users = db["users"]
    return await users.find_one({"username": username})


@router.post("/signup", status_code=201)
async def signup(payload: SignupRequest):
    db = get_db()
    users = db["users"]
    # check existing username/email
    existing_username = await users.find_one({"username": payload.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    existing_email = await users.find_one({"email": payload.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # password was validated by Pydantic validator in SignupRequest
    hashed = pwd_ctx.hash(payload.password)
    user_doc = {
        "username": payload.username,
        "email": payload.email,
        "password": hashed,
        "created_at": datetime.utcnow()
    }
    await users.insert_one(user_doc)
    logger.info("New signup: %s", payload.username)
    return {"message": "Signup successful"}


@router.post("/token", response_model=TokenResponse)
async def token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Issue token using email + password.

    Note: OAuth2PasswordRequestForm uses the field name `username` (form_data.username).
    Clients should put the user's email in that field (i.e. the "username" form field == email).
    """
    # Treat form_data.username as email
    email = form_data.username
    user = await get_user_by_email(email)
    if not user or not pwd_ctx.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    # Use email as subject (sub) in token
    access_token = _create_access_token({"sub": user["email"]})
    logger.info("Token issued for %s", user["email"])
    return {"access_token": access_token, "token_type": "bearer"}


# Dependency to get current user from token
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security_scheme = HTTPBearer()


async def get_current_user(token: str):
    """
    Decode JWT and fetch user by email (sub).
    Expects `sub` claim to be email.
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        user = await get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# New endpoint to return current user info based on user-provided token
@router.get("/me", response_model=UserResponse)
async def read_current_user(token: str = Query(..., description="JWT access token")):
    current_user = await get_current_user(token)
    return {
        "username": current_user.get("username"),
        "email": current_user.get("email"),
        "created_at": current_user.get("created_at")
    }


# 🚀 New endpoint: Get all users
@router.get("/users", response_model=List[UserResponse])
async def get_all_users():
    db = get_db()
    users = db["users"]

    cursor = users.find({}, {"_id": 0, "username": 1, "email": 1, "created_at": 1})
    all_users = await cursor.to_list(length=None)

    return all_users
