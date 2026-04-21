from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.config import settings
from app.core.crypto import decrypt_text, encrypt_text
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import create_access_token, get_current_user, get_password_hash, verify_password
from app.schemas.user import Token, UserLogin, UserPublic, UserRegister

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserPublic)
@limiter.limit(settings.rate_limit_auth)
async def register(request: Request, payload: UserRegister):
    db = get_db()
    existing_user = await db.users.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "email": payload.email,
        "full_name": encrypt_text(payload.full_name),
        "hashed_password": get_password_hash(payload.password),
        "role": "student",
        "created_at": datetime.now(timezone.utc),
        "points": 0,
        "badges": [],
    }
    result = await db.users.insert_one(user_doc)

    return UserPublic(
        id=str(result.inserted_id),
        email=payload.email,
        full_name=payload.full_name,
        role="student",
        points=0,
        badges=[],
    )


@router.post("/login", response_model=Token)
@limiter.limit(settings.rate_limit_auth)
async def login(request: Request, payload: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=user["email"], role=user["role"])
    public_user = UserPublic(
        id=str(user["_id"]),
        email=user["email"],
        full_name=decrypt_text(user["full_name"]),
        role=user["role"],
        points=user.get("points", 0),
        badges=user.get("badges", []),
    )
    return Token(access_token=token, user=public_user)


@router.get("/me", response_model=UserPublic)
async def me(request: Request, user: UserPublic = Depends(get_current_user)):
    return user
