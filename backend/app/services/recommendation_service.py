from collections import Counter

import numpy as np

from app.services.emotion_utils import EMOTION_TO_SCORE, calculate_stress_score

try:
    from sklearn.linear_model import LogisticRegression
except Exception:  # pragma: no cover
    LogisticRegression = None


class RecommendationEngine:
    def __init__(self) -> None:
        self.model = None
        if LogisticRegression is not None:
            self.model = LogisticRegression(max_iter=200)
            self._bootstrap_model()

    def _bootstrap_model(self) -> None:
        # Synthetic seed data to make a lightweight, explainable baseline model.
        X = np.array(
            [
                [2, 2, 2, 0.9],
                [2, 1, 2, 0.8],
                [1, 1, 2, 0.7],
                [0, 1, 0, 0.5],
                [0, 0, 1, 0.4],
                [1, 0, 0, 0.6],
            ]
        )
        y = np.array([2, 2, 1, 0, 0, 1])
        self.model.fit(X, y)

    def predict_next_mood(self, recent_emotions: list[str], avg_confidence: float) -> str:
        if not recent_emotions:
            return "Neutral"

        scores = [EMOTION_TO_SCORE.get(emotion, 1) for emotion in recent_emotions[-3:]]
        while len(scores) < 3:
            scores.insert(0, 1)

        if self.model is None:
            rounded = int(round(sum(scores) / len(scores)))
        else:
            prediction = self.model.predict([[scores[0], scores[1], scores[2], avg_confidence]])[0]
            rounded = int(prediction)

        reverse = {0: "Sad", 1: "Neutral", 2: "Happy"}
        return reverse.get(rounded, "Neutral")

    def build_recommendations(self, emotions: list[str], predicted_next_mood: str) -> dict:
        counts = Counter(emotions)
        dominant = counts.most_common(1)[0][0] if counts else "Neutral"
        stress_score = calculate_stress_score(emotions)

        recommendations = {
            "Happy": {
                "activities": [
                    "Join a peer study group for 45 minutes",
                    "Take a gratitude walk around campus",
                    "Mentor a junior student this week",
                ],
                "journaling_prompt": "What helped you feel positive today, and how can you repeat it?",
                "breathing_exercise": "Box breathing: 4-4-4-4 for 5 rounds",
                "challenge": "Complete a 10-minute focus sprint and reflect on output",
            },
            "Neutral": {
                "activities": [
                    "Do a short stretching routine between classes",
                    "Plan tomorrow's top 3 tasks",
                    "Attend one low-pressure social activity",
                ],
                "journaling_prompt": "Which part of your day felt most balanced?",
                "breathing_exercise": "4-7-8 breathing for 3 minutes",
                "challenge": "Write one paragraph about a small win today",
            },
            "Sad": {
                "activities": [
                    "Take a 15-minute sunlight break",
                    "Call or message a trusted friend",
                    "Use campus counseling resources when needed",
                ],
                "journaling_prompt": "What emotion feels strongest right now, and what triggered it?",
                "breathing_exercise": "Diaphragmatic breathing for 5 minutes",
                "challenge": "Complete one gentle self-care task and log how you feel after",
            },
        }

        payload = recommendations.get(dominant, recommendations["Neutral"])
        payload["predicted_next_mood"] = predicted_next_mood
        payload["stress_score"] = stress_score
        return payload


engine = RecommendationEngine()
