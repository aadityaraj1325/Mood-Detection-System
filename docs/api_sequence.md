# API Sequence and Evaluation Demo

## Mood Check-In Sequence

```mermaid
sequenceDiagram
    participant U as Student
    participant FE as React Frontend
    participant BE as FastAPI Backend
    participant AI as AI Module
    participant DB as MongoDB

    U->>FE: Login (email, password)
    FE->>BE: POST /api/auth/login
    BE-->>FE: JWT + profile

    U->>FE: Capture webcam frame
    FE->>BE: POST /api/analyze-mood (frame_base64)
    BE->>AI: preprocess + infer emotion
    AI-->>BE: emotion + confidence
    BE-->>FE: mood result

    U->>FE: Save mood event
    FE->>BE: POST /api/save-mood
    BE->>DB: insert mood record
    BE-->>FE: saved mood + gamification update

    FE->>BE: GET /api/analytics/summary
    BE->>DB: fetch history
    BE-->>FE: trends + stress score + next mood prediction
```

## Suggested Final-Year Demo Script
1. Register a student account and login.
2. Run mood detection with webcam and show confidence output.
3. Save multiple mood entries and open history analytics.
4. Display personalized recommendations and stress score.
5. Use seeded admin account to call admin metrics endpoint.
6. Explain privacy model: no raw image storage, encrypted fields.
