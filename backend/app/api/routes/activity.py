from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, Request
from typing import List

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.user import UserPublic
from app.schemas.activity import ActivityCreate

router = APIRouter(prefix="/activity", tags=["Activity"])

@router.post("/save")
@limiter.limit(settings.rate_limit_api)
async def save_activity(
    request: Request,
    activity: ActivityCreate,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    entry = {
        "user_id": ObjectId(user.id),
        "name": activity.name,
        "category": activity.category,
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.activities.insert_one(entry)
    return {"activity_id": str(result.inserted_id), "status": "success"}

@router.get("/history")
@limiter.limit(settings.rate_limit_api)
async def get_activity_history(
    request: Request,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    records = await db.activities.find({"user_id": ObjectId(user.id)}).sort("created_at", -1).to_list(length=50)
    return [
        {
            "id": str(record["_id"]),
            "name": record["name"],
            "category": record["category"],
            "created_at": record["created_at"].isoformat()
        }
        for record in records
    ]
