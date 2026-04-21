from pydantic import BaseModel


class TrendPoint(BaseModel):
    label: str
    happy: int
    sad: int
    neutral: int
    avg_confidence: float


class AnalyticsResponse(BaseModel):
    weekly: list[TrendPoint]
    monthly: list[TrendPoint]
    stress_score: float
    predicted_next_mood: str
