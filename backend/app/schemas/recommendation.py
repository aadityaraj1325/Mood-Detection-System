from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    activities: list[str]
    journaling_prompt: str
    breathing_exercise: str
    challenge: str
    predicted_next_mood: str
    stress_score: float
