from collections import defaultdict
from datetime import datetime, timedelta, timezone

from app.services.emotion_utils import calculate_stress_score


def _group_records(records: list[dict], days: int) -> list[dict]:
    now = datetime.now(timezone.utc)
    grouped: dict[str, dict] = defaultdict(
        lambda: {
            "label": "",
            "happy": 0,
            "sad": 0,
            "neutral": 0,
            "confidence_total": 0.0,
            "count": 0,
        }
    )

    for record in records:
        created_at = record.get("created_at", now)
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        if created_at < now - timedelta(days=days):
            continue

        key = created_at.strftime("%Y-%m-%d") if days <= 7 else created_at.strftime("%Y-%m")
        bucket = grouped[key]
        bucket["label"] = key
        emotion = record.get("emotion", "Neutral")
        bucket[emotion.lower()] += 1
        bucket["confidence_total"] += float(record.get("confidence", 0))
        bucket["count"] += 1

    result = []
    for _, bucket in sorted(grouped.items()):
        count = max(bucket["count"], 1)
        result.append(
            {
                "label": bucket["label"],
                "happy": bucket["happy"],
                "sad": bucket["sad"],
                "neutral": bucket["neutral"],
                "avg_confidence": round(bucket["confidence_total"] / count, 3),
            }
        )
    return result


def build_analytics(records: list[dict], predicted_next_mood: str) -> dict:
    emotions = [record.get("emotion", "Neutral") for record in records]
    return {
        "weekly": _group_records(records, days=7),
        "monthly": _group_records(records, days=30),
        "stress_score": calculate_stress_score(emotions),
        "predicted_next_mood": predicted_next_mood,
    }
