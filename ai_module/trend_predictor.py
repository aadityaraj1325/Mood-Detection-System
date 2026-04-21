from __future__ import annotations

from datetime import datetime

import numpy as np

EMOTION_TO_SCORE = {"Sad": 0, "Neutral": 1, "Happy": 2}
SCORE_TO_EMOTION = {0: "Sad", 1: "Neutral", 2: "Happy"}


def predict_future_mood(entries: list[dict]) -> str:
    if not entries:
        return "Neutral"

    # Simple linear trend on mood score over time for interpretable forecasting.
    x = np.arange(len(entries))
    y = np.array([EMOTION_TO_SCORE.get(entry.get("emotion", "Neutral"), 1) for entry in entries])

    if len(entries) == 1:
        prediction_score = int(y[-1])
    else:
        slope, intercept = np.polyfit(x, y, 1)
        prediction_raw = slope * (len(entries)) + intercept
        prediction_score = int(np.clip(round(prediction_raw), 0, 2))

    return SCORE_TO_EMOTION.get(prediction_score, "Neutral")


def to_series_point(timestamp: datetime, emotion: str) -> dict:
    return {
        "timestamp": timestamp.isoformat(),
        "emotion": emotion,
        "score": EMOTION_TO_SCORE.get(emotion, 1),
    }
