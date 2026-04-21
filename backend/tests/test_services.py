from app.services.emotion_utils import calculate_stress_score
from app.services.recommendation_service import engine


def test_stress_score_range():
    score = calculate_stress_score(["Sad", "Neutral", "Happy", "Sad"])
    assert 0 <= score <= 100


def test_recommendation_payload_shape():
    predicted = engine.predict_next_mood(["Sad", "Neutral", "Happy"], 0.7)
    payload = engine.build_recommendations(["Sad", "Neutral", "Happy"], predicted)

    assert "activities" in payload
    assert "journaling_prompt" in payload
    assert "breathing_exercise" in payload
    assert "challenge" in payload
    assert "predicted_next_mood" in payload
    assert "stress_score" in payload
