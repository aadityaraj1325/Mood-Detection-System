EMOTION_TO_SCORE = {
    "Happy": 2,
    "Neutral": 1,
    "Sad": 0,
}


def normalize_emotion(raw_emotion: str) -> str:
    mapped = {
        "happy": "Happy",
        "surprise": "Happy",
        "sad": "Sad",
        "angry": "Sad",
        "fear": "Sad",
        "disgust": "Sad",
        "neutral": "Neutral",
    }
    return mapped.get(raw_emotion.strip().lower(), "Neutral")


def calculate_stress_score(emotions: list[str]) -> float:
    if not emotions:
        return 0.0
    sad_count = sum(1 for emotion in emotions if emotion == "Sad")
    neutral_count = sum(1 for emotion in emotions if emotion == "Neutral")
    stress = (sad_count * 1.0 + neutral_count * 0.5) / len(emotions)
    return round(min(max(stress * 100.0, 0.0), 100.0), 2)
