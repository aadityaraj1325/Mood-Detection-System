from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np

try:
    from fer import FER
except Exception:  # pragma: no cover
    FER = None

LOG_PATH = Path(__file__).resolve().parent / "emotion_logs.csv"
FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
SMILE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_smile.xml")


class MoodDetector:
    def __init__(self) -> None:
        self.fer_detector = None
        if FER is not None:
            try:
                # Use OpenCV backend for face detection to avoid optional MTCNN runtime issues.
                self.fer_detector = FER(mtcnn=False)
            except Exception:
                self.fer_detector = None

    def preprocess_frame(self, frame: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray] | None:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
        if len(faces) == 0:
            return None

        x, y, w, h = max(faces, key=lambda face: face[2] * face[3])
        face_region = frame[y : y + h, x : x + w]
        face_gray = gray[y : y + h, x : x + w]
        return frame, face_region, face_gray

    def _aggregate_emotion(self, emotion_scores: dict[str, float]) -> tuple[str, float]:
        positive = float(emotion_scores.get("happy", 0.0) + emotion_scores.get("surprise", 0.0))
        negative = float(
            emotion_scores.get("sad", 0.0)
            + emotion_scores.get("angry", 0.0)
            + emotion_scores.get("fear", 0.0)
            + emotion_scores.get("disgust", 0.0)
        )
        neutral = float(emotion_scores.get("neutral", 0.0))

        grouped = {
            "Happy": positive,
            "Sad": negative,
            "Neutral": neutral,
        }
        label = max(grouped, key=grouped.get)
        return label, grouped[label]

    def _detect_with_fer(self, image_bgr: np.ndarray) -> tuple[str, float, dict[str, float]] | None:
        if self.fer_detector is None:
            return None

        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        detections = self.fer_detector.detect_emotions(image_rgb)
        if not detections:
            return None

        best_label = None
        best_score = 0.0
        best_confidence = 0.0
        best_grouped_scores = {"Happy": 0.0, "Neutral": 0.0, "Sad": 0.0}
        for detection in detections:
            emotion_scores = detection.get("emotions", {})
            if not emotion_scores:
                continue

            # Prefer the dominant face if multiple faces are detected in frame.
            box = detection.get("box", [0, 0, 1, 1])
            _, _, width, height = box if len(box) == 4 else [0, 0, 1, 1]
            area_weight = max(float(width * height), 1.0)

            grouped_label, grouped_score = self._aggregate_emotion(emotion_scores)
            grouped_scores = {
                "Happy": float(emotion_scores.get("happy", 0.0) + emotion_scores.get("surprise", 0.0)),
                "Neutral": float(emotion_scores.get("neutral", 0.0)),
                "Sad": float(
                    emotion_scores.get("sad", 0.0)
                    + emotion_scores.get("angry", 0.0)
                    + emotion_scores.get("fear", 0.0)
                    + emotion_scores.get("disgust", 0.0)
                ),
            }
            score = float(grouped_score) * area_weight
            if score > best_score:
                best_label = grouped_label
                best_score = score
                best_confidence = float(grouped_score)
                best_grouped_scores = grouped_scores

        if best_label is None:
            return None
        # Confidence is normalized to [0, 1] for API responses.
        confidence = min(max(best_confidence, 0.0), 1.0)
        return best_label, round(confidence, 3), best_grouped_scores

    def _map_emotion(self, raw_emotion: str) -> str:
        label = raw_emotion.strip().lower()
        if label in {"happy", "surprise"}:
            return "Happy"
        if label in {"sad", "fear", "angry", "disgust"}:
            return "Sad"
        return "Neutral"

    def detect(self, frame: np.ndarray) -> tuple[str, float]:
        details = self.detect_with_details(frame)
        return details["emotion"], details["confidence"]

    def detect_with_details(self, frame: np.ndarray) -> dict[str, object]:
        processed = self.preprocess_frame(frame)
        if processed is None:
            no_face_result = {
                "emotion": "Neutral",
                "confidence": 0.45,
                "method": "no_face",
                "grouped_scores": {"Happy": 0.0, "Neutral": 1.0, "Sad": 0.0},
            }
            self._append_log("Neutral", 0.45)
            return no_face_result

        full_frame, face_region, face_gray = processed

        fer_result = self._detect_with_fer(full_frame)
        if fer_result is None:
            fer_result = self._detect_with_fer(face_region)

        if fer_result is not None:
            raw_emotion, confidence, grouped_scores = fer_result
            emotion = self._map_emotion(raw_emotion)
            rounded_confidence = round(float(confidence), 3)
            self._append_log(emotion, rounded_confidence)
            return {
                "emotion": emotion,
                "confidence": rounded_confidence,
                "method": "fer",
                "grouped_scores": grouped_scores,
            }

        fallback_emotion, fallback_confidence = self._fallback(face_gray)
        return {
            "emotion": fallback_emotion,
            "confidence": round(float(fallback_confidence), 3),
            "method": "opencv_fallback",
            "grouped_scores": None,
        }

    def _fallback(self, face_gray: np.ndarray) -> tuple[str, float]:
        smiles = SMILE_CASCADE.detectMultiScale(face_gray, scaleFactor=1.6, minNeighbors=14, minSize=(20, 20))
        brightness = float(np.mean(face_gray))
        contrast = float(np.std(face_gray))

        if len(smiles) > 0:
            emotion = "Happy"
            confidence = 0.67
        elif brightness < 120 and contrast < 62:
            emotion = "Sad"
            confidence = 0.62
        elif brightness > 165 and contrast > 45:
            emotion = "Happy"
            confidence = 0.57
        else:
            emotion = "Neutral"
            confidence = 0.52
        self._append_log(emotion, confidence)
        return emotion, confidence

    def _append_log(self, emotion: str, confidence: float) -> None:
        exists = LOG_PATH.exists()
        with LOG_PATH.open("a", encoding="utf-8") as file:
            if not exists:
                file.write("timestamp,emotion,confidence\n")
            file.write(f"{datetime.now(timezone.utc).isoformat()},{emotion},{confidence}\n")


detector = MoodDetector()


def detect_emotion_from_frame(frame: np.ndarray) -> tuple[str, float]:
    return detector.detect(frame)


def detect_emotion_debug_from_frame(frame: np.ndarray) -> dict[str, object]:
    return detector.detect_with_details(frame)
