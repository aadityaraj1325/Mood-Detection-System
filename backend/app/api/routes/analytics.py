from bson import ObjectId
from fastapi import APIRouter, Depends, Request

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user, require_role
from app.schemas.analytics import AnalyticsResponse
from app.schemas.user import UserPublic
from app.services.analytics_service import build_analytics
from app.services.recommendation_service import engine

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsResponse)
@limiter.limit(settings.rate_limit_api)
async def analytics_summary(request: Request, user: UserPublic = Depends(get_current_user)):
    db = get_db()
    records = await db.moods.find({"user_id": ObjectId(user.id)}).sort("created_at", -1).to_list(length=1000)

    emotions = [record.get("emotion", "Neutral") for record in records]
    avg_confidence = sum(record.get("confidence", 0.0) for record in records) / max(len(records), 1)
    predicted = engine.predict_next_mood(emotions, avg_confidence)

    return AnalyticsResponse(**build_analytics(records, predicted_next_mood=predicted))


@router.get("/admin/user-metrics")
@limiter.limit(settings.rate_limit_api)
async def admin_user_metrics(
    request: Request,
    admin_user: UserPublic = Depends(require_role({"admin"})),
):
    db = get_db()
    user_count = await db.users.count_documents({})
    mood_count = await db.moods.count_documents({})
    return {
        "requested_by": admin_user.email,
        "total_users": user_count,
        "total_mood_logs": mood_count,
    }
