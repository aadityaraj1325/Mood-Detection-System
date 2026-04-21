from bson import ObjectId
from fastapi import APIRouter, Depends, Request

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.recommendation import RecommendationResponse
from app.schemas.user import UserPublic
from app.services.recommendation_service import engine

router = APIRouter(tags=["Recommendations"])


@router.get("/recommend", response_model=RecommendationResponse)
@limiter.limit(settings.rate_limit_api)
async def recommend(request: Request, user: UserPublic = Depends(get_current_user)):
    db = get_db()
    records = (
        await db.moods.find({"user_id": ObjectId(user.id)}).sort("created_at", -1).limit(20).to_list(length=20)
    )
    emotions = [record.get("emotion", "Neutral") for record in records]
    avg_confidence = sum(record.get("confidence", 0.0) for record in records) / max(len(records), 1)

    predicted = engine.predict_next_mood(emotions, avg_confidence)
    recommendation = engine.build_recommendations(emotions, predicted)

    return RecommendationResponse(**recommendation)
