from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.mood import (
    AnalyzeMoodDebugResponse,
    AnalyzeMoodRequest,
    AnalyzeMoodResponse,
    MoodEntry,
    MoodHistoryResponse,
    SaveMoodRequest,
)
from app.schemas.user import UserPublic
from app.services.ai_service import analyze_frame, analyze_frame_debug
from app.services.emotion_utils import EMOTION_TO_SCORE, normalize_emotion
from app.services.gamification_service import award_points, update_badges
from app.services.websocket_manager import manager

router = APIRouter(tags=["Mood"])


@router.post("/analyze-mood", response_model=AnalyzeMoodResponse)
@limiter.limit(settings.rate_limit_api)
async def analyze_mood(request: Request, payload: AnalyzeMoodRequest, user: UserPublic = Depends(get_current_user)):
    try:
        emotion, confidence = analyze_frame(payload.frame_base64)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Mood analysis failed: {exc}") from exc

    await manager.send_personal_message(
        user.id,
        {
            "type": "mood_update",
            "emotion": emotion,
            "confidence": confidence,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

    return AnalyzeMoodResponse(emotion=emotion, confidence=round(confidence, 3))


@router.post("/analyze-mood-debug", response_model=AnalyzeMoodDebugResponse)
@limiter.limit(settings.rate_limit_api)
async def analyze_mood_debug(
    request: Request,
    payload: AnalyzeMoodRequest,
    user: UserPublic = Depends(get_current_user),
):
    try:
        details = analyze_frame_debug(payload.frame_base64)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Mood analysis failed: {exc}") from exc

    return AnalyzeMoodDebugResponse(
        emotion=str(details["emotion"]),
        confidence=float(details["confidence"]),
        detection_method=str(details["detection_method"]),
        grouped_scores=details.get("grouped_scores"),
        fer_available=bool(details["fer_available"]),
    )


@router.post("/save-mood", response_model=MoodEntry)
@limiter.limit(settings.rate_limit_api)
async def save_mood(request: Request, payload: SaveMoodRequest, user: UserPublic = Depends(get_current_user)):
    db = get_db()
    normalized = normalize_emotion(payload.emotion)
    mood_score = EMOTION_TO_SCORE[normalized]

    mood_doc = {
        "user_id": ObjectId(user.id),
        "emotion": normalized,
        "confidence": payload.confidence,
        "mood_score": mood_score,
        "source": payload.source,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.moods.insert_one(mood_doc)

    history_cursor = db.moods.find({"user_id": ObjectId(user.id)}).sort("created_at", 1)
    history_docs = await history_cursor.to_list(length=1000)
    all_emotions = [record.get("emotion", "Neutral") for record in history_docs]

    updated_points = award_points(user.points, payload.confidence)
    updated_badges = update_badges(user.badges, all_emotions, len(history_docs))
    await db.users.update_one(
        {"_id": ObjectId(user.id)},
        {"$set": {"points": updated_points, "badges": updated_badges}},
    )

    await manager.send_personal_message(
        user.id,
        {
            "type": "mood_saved",
            "emotion": normalized,
            "points": updated_points,
            "badges": updated_badges,
        },
    )

    return MoodEntry(
        id=str(result.inserted_id),
        user_id=user.id,
        emotion=normalized,
        confidence=payload.confidence,
        mood_score=mood_score,
        source=payload.source,
        created_at=mood_doc["created_at"],
    )


@router.get("/get-history", response_model=MoodHistoryResponse)
@limiter.limit(settings.rate_limit_api)
async def get_history(request: Request, limit: int = 50, user: UserPublic = Depends(get_current_user)):
    db = get_db()
    cursor = db.moods.find({"user_id": ObjectId(user.id)}).sort("created_at", -1).limit(limit)
    docs = await cursor.to_list(length=limit)

    items = [
        MoodEntry(
            id=str(doc["_id"]),
            user_id=str(doc["user_id"]),
            emotion=doc["emotion"],
            confidence=doc["confidence"],
            mood_score=doc["mood_score"],
            source=doc.get("source", "webcam"),
            created_at=doc["created_at"],
        )
        for doc in docs
    ]

    return MoodHistoryResponse(items=items)
