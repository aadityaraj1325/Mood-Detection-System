from datetime import datetime

from pydantic import BaseModel, Field


class AnalyzeMoodRequest(BaseModel):
    frame_base64: str = Field(min_length=10, description="Base64 encoded image frame")


class AnalyzeMoodResponse(BaseModel):
    emotion: str
    confidence: float


class AnalyzeMoodDebugResponse(BaseModel):
    emotion: str
    confidence: float
    detection_method: str
    grouped_scores: dict[str, float] | None = None
    fer_available: bool


class SaveMoodRequest(BaseModel):
    emotion: str = Field(pattern="^(Happy|Sad|Neutral)$")
    confidence: float = Field(ge=0.0, le=1.0)
    source: str = "webcam"


class MoodEntry(BaseModel):
    id: str
    user_id: str
    emotion: str
    confidence: float
    mood_score: int
    source: str
    created_at: datetime


class MoodHistoryResponse(BaseModel):
    items: list[MoodEntry]
