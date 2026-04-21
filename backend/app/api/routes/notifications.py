from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.user import UserPublic

router = APIRouter(prefix="/notifications", tags=["Notifications"])


class NotificationPreference(BaseModel):
    enabled: bool = True
    reminder_hour: int = 20


@router.post("/preferences")
@limiter.limit(settings.rate_limit_api)
async def set_preferences(
    request: Request,
    payload: NotificationPreference,
    user: UserPublic = Depends(get_current_user),
):
    db = get_db()
    await db.users.update_one(
        {"_id": ObjectId(user.id)},
        {
            "$set": {
                "notification_enabled": payload.enabled,
                "reminder_hour": payload.reminder_hour,
            }
        },
    )
    return {"message": "Preferences saved"}


@router.get("/daily-check")
@limiter.limit(settings.rate_limit_api)
async def daily_check(request: Request, user: UserPublic = Depends(get_current_user)):
    db = get_db()
    user_doc = await db.users.find_one({"_id": ObjectId(user.id)})
    enabled = user_doc.get("notification_enabled", True)
    reminder_hour = user_doc.get("reminder_hour", 20)
    if not enabled:
        return {"enabled": False, "message": "Reminders are disabled"}

    return {
        "enabled": True,
        "message": "Time for your daily mood check-in.",
        "reminder_hour": reminder_hour,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
