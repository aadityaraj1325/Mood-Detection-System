from __future__ import annotations

import base64
import sys
from pathlib import Path

import cv2
import numpy as np

from app.services.emotion_utils import normalize_emotion

def _register_project_root() -> None:
    """Register the directory that actually contains ai_module."""
    service_file = Path(__file__).resolve()
    candidates = [
        service_file.parents[3],  # local source layout: <repo>/backend/app/services
        service_file.parents[2],  # container layout: /app/app/services
        service_file.parents[1],
    ]
    for candidate in candidates:
        if (candidate / "ai_module").exists() and str(candidate) not in sys.path:
            sys.path.append(str(candidate))
            return


_register_project_root()

try:
    from ai_module.detector import detect_emotion_debug_from_frame, detect_emotion_from_frame
except Exception:  # pragma: no cover
    detect_emotion_debug_from_frame = None
    detect_emotion_from_frame = None


def decode_base64_image(frame_base64: str) -> np.ndarray:
    image_data = base64.b64decode(frame_base64)
    np_arr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Invalid image frame")
    return frame


def analyze_frame(frame_base64: str) -> tuple[str, float]:
    frame = decode_base64_image(frame_base64)

    if detect_emotion_from_frame is not None:
        emotion, confidence = detect_emotion_from_frame(frame)
        return normalize_emotion(emotion), float(confidence)

    # Fallback heuristic based on average brightness if DeepFace/FER is unavailable.
    grayscale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = float(np.mean(grayscale))
    if brightness > 150:
        return "Happy", 0.62
    if brightness < 80:
        return "Sad", 0.58
    return "Neutral", 0.6


def analyze_frame_debug(frame_base64: str) -> dict[str, object]:
    frame = decode_base64_image(frame_base64)

    if detect_emotion_debug_from_frame is not None:
        details = detect_emotion_debug_from_frame(frame)
        emotion = normalize_emotion(str(details.get("emotion", "Neutral")))
        confidence = round(float(details.get("confidence", 0.0)), 3)
        grouped_scores = details.get("grouped_scores")
        return {
            "emotion": emotion,
            "confidence": confidence,
            "detection_method": str(details.get("method", "fer")),
            "grouped_scores": grouped_scores,
            "fer_available": True,
        }

    grayscale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = float(np.mean(grayscale))
    if brightness > 150:
        emotion, confidence = "Happy", 0.62
    elif brightness < 80:
        emotion, confidence = "Sad", 0.58
    else:
        emotion, confidence = "Neutral", 0.6

    return {
        "emotion": emotion,
        "confidence": round(confidence, 3),
        "detection_method": "brightness_fallback",
        "grouped_scores": None,
        "fer_available": False,
    }
