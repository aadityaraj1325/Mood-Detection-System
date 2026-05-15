from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import Optional

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.user import UserPublic

router = APIRouter(prefix="/games", tags=["Games"])

class GameFeedbackCreate(BaseModel):
    game_id: str
    stress_reduction: int
    enjoyment: int
    notes: Optional[str] = ""

@router.post("/feedback")
@limiter.limit(settings.rate_limit_api)
async def submit_game_feedback(
    request: Request,
    feedback: GameFeedbackCreate,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    points_awarded = 15  # Fixed points for completing a game session

    entry = {
        "user_id": ObjectId(user.id),
        "game_id": feedback.game_id,
        "stress_reduction": feedback.stress_reduction,
        "enjoyment": feedback.enjoyment,
        "notes": feedback.notes,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.game_feedbacks.insert_one(entry)

    # If it's a breathing game, also log it as a general activity
    if feedback.game_id == "breathing":
        activity_entry = {
            "user_id": ObjectId(user.id),
            "name": "Mindfulness Breathing (Game)",
            "category": "Breathing",
            "created_at": datetime.now(timezone.utc)
        }
        await db.activities.insert_one(activity_entry)
    
    # Update user points (gamification)
    await db.users.update_one(
        {"_id": ObjectId(user.id)},
        {"$inc": {"points": points_awarded}}
    )

    return {"status": "success", "points_awarded": points_awarded}

@router.get("/history")
@limiter.limit(settings.rate_limit_api)
async def get_game_history(
    request: Request,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    records = await db.game_feedbacks.find({"user_id": ObjectId(user.id)}).sort("created_at", -1).to_list(length=50)
    return [
        {
            "id": str(record["_id"]),
            "game_id": record["game_id"],
            "created_at": record["created_at"].isoformat()
        }
        for record in records
    ]
