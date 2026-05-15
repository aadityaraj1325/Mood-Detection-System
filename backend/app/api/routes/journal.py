from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import List

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.user import UserPublic
from app.schemas.journal import JournalCreate, JournalResponse

router = APIRouter(prefix="/journal", tags=["Journal"])

@router.post("/save")
@limiter.limit(settings.rate_limit_api)
async def save_journal(
    request: Request,
    journal: JournalCreate,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    entry = {
        "user_id": ObjectId(user.id),
        "content": journal.content,
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.journals.insert_one(entry)
    return {"journal_id": str(result.inserted_id), "status": "success"}

@router.get("/history")
@limiter.limit(settings.rate_limit_api)
async def get_journal_history(
    request: Request,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    records = await db.journals.find({"user_id": ObjectId(user.id)}).sort("created_at", -1).to_list(length=50)
    return [
        {
            "id": str(record["_id"]),
            "user_id": str(record["user_id"]),
            "content": record["content"],
            "created_at": record["created_at"].isoformat()
        }
        for record in records
    ]
