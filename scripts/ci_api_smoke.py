from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request
from datetime import datetime


SAMPLE_FRAME_BASE64 = (
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U"
    "HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN"
    "DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy"
    "MjL/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEA"
    "AAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/AP/EABQQAQAAAAAAAAAAAAAAAAAA"
    "AAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8BP//EABQR"
    "AQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8BP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/"
    "2gAIAQEABj8Cf//Z"
)


def request_json(method: str, url: str, payload: dict | None = None, token: str | None = None) -> dict:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(url=url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as response:
        body = response.read().decode("utf-8")
        return json.loads(body)


def wait_for_health(base_url: str, timeout_seconds: int = 60) -> None:
    deadline = time.time() + timeout_seconds
    last_error = None
    while time.time() < deadline:
        try:
            payload = request_json("GET", f"{base_url}/health")
            if payload.get("status") == "ok":
                return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
        time.sleep(2)
    raise RuntimeError(f"Backend health check timed out: {last_error}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run CI API smoke test flow")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000")
    parser.add_argument("--password", default="StudentPass123!")
    args = parser.parse_args()

    stamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    email = f"ci.student.{stamp}@university.edu"
    full_name = f"CI Student {stamp}"

    wait_for_health(args.base_url)
    ready = request_json("GET", f"{args.base_url}/ready")
    assert ready.get("status") == "ready"

    request_json(
        "POST",
        f"{args.base_url}/api/auth/register",
        payload={"email": email, "full_name": full_name, "password": args.password},
    )

    login = request_json(
        "POST",
        f"{args.base_url}/api/auth/login",
        payload={"email": email, "password": args.password},
    )
    token = login["access_token"]

    analysis = request_json(
        "POST",
        f"{args.base_url}/api/analyze-mood",
        payload={"frame_base64": SAMPLE_FRAME_BASE64},
        token=token,
    )

    request_json(
        "POST",
        f"{args.base_url}/api/save-mood",
        payload={
            "emotion": analysis["emotion"],
            "confidence": float(analysis["confidence"]),
            "source": "ci-smoke",
        },
        token=token,
    )

    history = request_json("GET", f"{args.base_url}/api/get-history?limit=5", token=token)
    assert len(history.get("items", [])) >= 1

    recommendation = request_json("GET", f"{args.base_url}/api/recommend", token=token)
    assert "predicted_next_mood" in recommendation

    analytics = request_json("GET", f"{args.base_url}/api/analytics/summary", token=token)
    assert "stress_score" in analytics

    notification = request_json("GET", f"{args.base_url}/api/notifications/daily-check", token=token)
    assert "message" in notification

    print("CI smoke flow passed")


if __name__ == "__main__":
    main()
