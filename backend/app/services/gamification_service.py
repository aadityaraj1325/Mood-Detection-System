from collections import Counter


def award_points(current_points: int, confidence: float) -> int:
    base_points = 5
    confidence_bonus = int(confidence * 5)
    return current_points + base_points + confidence_bonus


def update_badges(existing_badges: list[str], emotions: list[str], total_logs: int) -> list[str]:
    badges = set(existing_badges)
    counts = Counter(emotions)

    if total_logs >= 7:
        badges.add("Consistency Starter")
    if total_logs >= 30:
        badges.add("Mindful Momentum")
    if counts.get("Happy", 0) >= 10:
        badges.add("Positive Spark")

    return sorted(badges)
