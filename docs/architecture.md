# PulseMind AI Architecture

## System Architecture Diagram

```mermaid
graph TD
    A[Student Client Browser] --> B[React Frontend]
    B -->|JWT + REST| C[FastAPI Backend]
    B -->|WebSocket| C

    C --> D[Auth + RBAC]
    C --> E[Mood APIs]
    C --> F[Analytics + Recommendation Engine]
    C --> G[Notification APIs]

    E --> H[AI Service Adapter]
    H --> I[AI Module: OpenCV + FER]
    I --> J[(Emotion Logs CSV)]

    C --> K[(MongoDB)]
    K --> L[Users]
    K --> M[Mood History]

    F --> N[Trend Predictor]
    F --> O[Gamification Service]
```

## Data Flow Summary
1. Student authenticates via JWT login.
2. Frontend captures webcam frame and sends base64 payload to /analyze-mood.
3. Backend runs AI inference, returns emotion + confidence.
4. Frontend confirms save and backend persists mood event to MongoDB.
5. Analytics and recommendation APIs process history to compute trends, stress score, and personalized actions.
6. WebSocket channel streams live mood updates to dashboard.

## Privacy and Security Controls
- Password hashing with bcrypt via passlib.
- JWT-based authentication and role checks.
- Sensitive profile fields encrypted before database storage.
- No raw webcam images stored in MongoDB.
- API rate limits to reduce abuse risk.
