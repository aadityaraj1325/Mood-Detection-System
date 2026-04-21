from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserInDB(BaseModel):
    email: EmailStr
    full_name: str
    hashed_password: str
    role: str = "student"
    created_at: datetime
    points: int = 0
    badges: list[str] = []


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    points: int = 0
    badges: list[str] = []


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: int
