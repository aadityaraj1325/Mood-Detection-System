# PulseMind AI — Product Requirements Document (PRD)
**Version:** 2.0 — Final Year B.Tech Project  
**Team:** Team Vijayas — Lovely Professional University  
**Date:** April 21, 2026  
**Status:** Production-Ready Specification

---

## 1. Product Overview

### 1.1 Vision Statement

PulseMind AI is a full-stack, AI-driven digital mental health and psychological support platform built specifically for university students. It transforms traditional passive wellness tools into an intelligent, gamified, and emotionally adaptive experience — one that meets students where they are: their phones, laptops, and late-night study sessions.

The platform combines real-time emotion detection via facial recognition (OpenCV + FER), an AI recommendation engine, psychological analytics, peer support mechanics, and therapeutic gamification into one coherent product. Every design decision is grounded in clinical frameworks: Cognitive Behavioural Therapy (CBT), Acceptance and Commitment Therapy (ACT), and Resilience Theory.

### 1.2 Problem Statement

- 20–31% of higher education students exhibit clinically significant mental health symptoms (Hyseni Duraku et al., 2023).
- University counselling services are understaffed, stigmatized, and inaccessible due to scheduling and resource constraints.
- Traditional digital mental health tools are passive, one-size-fits-all, and fail to sustain engagement.
- Students — particularly those from stigmatized backgrounds — avoid formal help-seeking altogether.

### 1.3 Solution Summary

PulseMind AI provides:
1. **AI Mood Detection** — Webcam-based emotion analysis with FER + fallback heuristics.
2. **Gamified Therapy** — Therapeutic mini-games based on CBT, ACT, and resilience principles.
3. **Personalized Recommendations** — Logistic-regression + confidence-weighted engine that adapts over time.
4. **Psychological Analytics Dashboard** — Weekly/monthly mood trends, stress scoring, resilience tracking.
5. **Peer Community Layer** — Moderated, stigma-free social support.
6. **Gamification System** — Points, badges, streaks to incentivize daily engagement.
7. **Realtime Alerts** — WebSocket-based live mood updates and admin notifications.

### 1.4 Target Users

| User Type | Description |
|-----------|-------------|
| **Students (Primary)** | University students aged 18–25 experiencing mild-to-moderate academic/social stress |
| **University Counsellors** | Mental health professionals who monitor aggregate data and receive AI-flagged high-risk alerts |
| **Platform Administrators** | System administrators who manage user data, roles, and system health |

---

## 2. Goals and Success Metrics

### 2.1 Academic Project Goals

| Goal | Metric | Target |
|------|--------|--------|
| Stress Reduction | DASS-21 pre/post score delta | ≥ 20% reduction |
| Resilience Improvement | Brief Resilience Scale (BRS) | ≥ 15% improvement |
| Usability | System Usability Scale (SUS) | ≥ 80/100 |
| Engagement | Weekly Active Users | ≥ 70% weekly active rate |
| Satisfaction | Net Promoter Score (NPS) | ≥ +40 |

### 2.2 Technical Excellence Metrics

| Area | Metric | Target |
|------|--------|--------|
| API Response | P95 latency | < 500ms |
| Emotion Detection | FER inference time | < 2 seconds |
| Uptime | System availability | ≥ 99% (dev/demo) |
| Test Coverage | Backend unit tests | ≥ 70% coverage |
| Security | Auth vulnerabilities | 0 critical issues |

---

## 3. Functional Requirements

### 3.1 Authentication & User Management

**FR-AUTH-01:** User Registration  
- Students register with name, email, password, and optional profile fields.  
- Duplicate email detection with descriptive error messages.  
- Passwords hashed via bcrypt (passlib).  
- Sensitive profile fields encrypted via Fernet symmetric encryption.

**FR-AUTH-02:** Login & Session Management  
- Login returns JWT with role claim (student, counsellor, admin).  
- JWT expiry configurable via environment variable.  
- Frontend persists token in localStorage with AuthContext.  
- Protected routes redirect unauthenticated users to /auth.

**FR-AUTH-03:** Role-Based Access Control  
- Role-gated middleware on all sensitive endpoints.  
- Admin-only routes: `/api/analytics/admin/user-metrics`.  
- Counsellor role receives high-risk student alerts.

---

### 3.2 Mood Detection (Core AI Feature)

**FR-MOOD-01:** Webcam Emotion Analysis  
- React frontend captures webcam frames via browser APIs.  
- Local BlazeFace model runs in-browser for privacy-first face detection.  
- Captured frame sent to backend `/api/analyze-mood` endpoint.  
- Backend runs OpenCV cascade preprocessing → FER deep learning inference.  
- Emotions grouped into: Happy, Neutral, Sad.  
- Confidence score returned alongside primary emotion label.

**FR-MOOD-02:** Fallback Heuristics  
- When FER library unavailable, OpenCV-based heuristic pipeline activates.  
- Heuristic flags gracefully communicated to the debug endpoint.

**FR-MOOD-03:** Mood Save & Persistence  
- Users confirm and save analyzed mood via `/api/save-mood`.  
- Saved entries stored in MongoDB `moods` collection.  
- Each entry contains: user_id, emotion, confidence, timestamp, method.  
- Gamification engine triggered on save: +points and badge evaluation.

**FR-MOOD-04:** Mood History Retrieval  
- `/api/get-history` returns paginated recent mood records.  
- Limit configurable via query parameter.

---

### 3.3 AI Recommendation Engine

**FR-REC-01:** Personalized Recommendations  
- `/api/recommend` analyzes user's recent mood records + confidence history.  
- Logistic regression model (seeded with synthetic training data) classifies user state.  
- Returns 3–5 activity recommendations: game types, breathing exercises, journaling prompts.

**FR-REC-02:** Recommendation Taxonomy  
- Stress Reduction: Breathing exercises, mindfulness games.  
- Cognitive Training: Memory puzzles, focus challenges.  
- Resilience Building: Gratitude journaling, reflection prompts.  
- Social Connection: Peer forum suggestions, group challenges.

**FR-REC-03:** Journaling Integration  
- Recommendations page surfaces daily journaling prompt.  
- Prompts rotate based on mood trend (lower mood → gentler prompts).

---

### 3.4 Analytics Dashboard

**FR-ANALYTICS-01:** User Analytics  
- Weekly and monthly mood trend charts (Recharts/Chart.js).  
- Stress score calculation from mood mix over rolling 7-day window.  
- Monthly confidence chart showing detection reliability.  
- Recent mood table with timestamps and emotion labels.

**FR-ANALYTICS-02:** Trend Prediction  
- Linear projection utility in `ai_module/trend_predictor.py`.  
- Predicts mood direction for next 3 days from recent history.  
- Displayed on dashboard as a predictive indicator card.

**FR-ANALYTICS-03:** Admin Metrics  
- Aggregate user count, daily active users, top stress periods.  
- Role-gated to admin only.

---

### 3.5 Gamification System

**FR-GAME-01:** Points Engine  
- Points awarded per mood save, per recommendation followed, per streak day.  
- Point ledger stored in user profile document.

**FR-GAME-02:** Badges  
- Milestone badges: First Check-in, 7-Day Streak, Resilience Champion.  
- Badge state evaluated on every gamification update call.

**FR-GAME-03:** Streaks  
- Daily login/mood-check streak tracked in user document.  
- Streak reset logic triggered on missed day.

---

### 3.6 Notifications & Realtime

**FR-NOTIF-01:** Notification Preferences  
- `/api/notifications/preferences` stores reminder time and frequency.  
- Daily check payload endpoint provides reminder content.

**FR-NOTIF-02:** WebSocket Realtime  
- Per-user WebSocket channel at `/api/ws/mood/{user_id}`.  
- Server pushes live badge award and mood event on analyze/save.  
- Dashboard displays live websocket badge indicator.

---

### 3.7 Therapeutic Mini-Games (Phase 2 / Stretch)

**FR-GAMES-01:** Game Library  
- Mindfulness breathing game (rhythm-based visual breathing guide).  
- Cognitive puzzle (memory match with calming design).  
- Creative sandbox (freeform digital drawing/doodling).  
- Each game tagged with therapeutic category (CBT / ACT / Resilience).

**FR-GAMES-02:** Post-Game Feedback  
- Short 3-question reflection survey after each game session.  
- Responses feed back into the AI recommendation engine.

---

### 3.8 Peer Community Layer (Phase 2 / Stretch)

**FR-COMMUNITY-01:** Anonymous Forum  
- Students post anonymously to moderated topic threads.  
- Topics: Academic Stress, Relationships, Self-Care, Wins.

**FR-COMMUNITY-02:** Moderation  
- Counsellor role can flag and remove posts.  
- Automated keyword filter for crisis language → triggers counsellor alert.

---

## 4. Non-Functional Requirements

### 4.1 Security

- All API routes behind JWT authentication except `/api/auth/register` and `/api/auth/login`.
- Passwords stored as bcrypt hashes — never in plaintext.
- Sensitive profile fields encrypted at rest with Fernet.
- HTTPS enforced in all deployment environments.
- AES-256 for database-level encryption (production target).
- OAuth 2.0 readiness for future institutional SSO.
- GDPR-aligned data handling: anonymized analytics, user-controlled data deletion.
- Rate limiting via SlowAPI on all public endpoints.

### 4.2 Performance

- Emotion analysis endpoint: P95 < 2s.
- All other API endpoints: P95 < 500ms.
- Frontend initial load: < 3s on standard broadband.
- MongoDB indexes on `user_id` and `timestamp` fields in moods collection.

### 4.3 Reliability

- Docker Compose orchestration for consistent local environment.
- Health endpoint `/health` and readiness endpoint `/ready` with DB ping.
- CI/CD: GitHub Actions runs backend pytest suite + API smoke test on every push.
- Graceful Mongo connection lifecycle (open on startup, close on shutdown).

### 4.4 Scalability

- Modular FastAPI router structure supports independent scaling of auth, mood, analytics.
- MongoDB horizontal scaling readiness (replica set configuration documented).
- WebSocket manager designed for multi-user concurrent connections.

### 4.5 Accessibility

- WCAG 2.1 AA compliance target for all frontend components.
- Keyboard-navigable UI.
- Sufficient color contrast across all theme variants.
- Screen-reader friendly ARIA labels on interactive elements.

---

## 5. User Stories

### Student User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Student | Register with my university email | I can create a private account |
| US-02 | Student | Log in securely | My data is protected |
| US-03 | Student | Analyze my mood via webcam | I get instant emotional feedback |
| US-04 | Student | Save my mood entry | I can track my emotional patterns |
| US-05 | Student | View my mood history chart | I can see how I'm trending over time |
| US-06 | Student | Receive AI recommendations | I get personalized coping suggestions |
| US-07 | Student | Earn points and badges | I feel motivated to check in daily |
| US-08 | Student | See realtime notifications | I know when I've earned a new badge |
| US-09 | Student | Write in a journal | I can reflect on my day |
| US-10 | Student | Play a mindfulness game | I can de-stress in a fun way |

### Counsellor User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-11 | Counsellor | View aggregate stress trends | I can identify at-risk student cohorts |
| US-12 | Counsellor | Receive high-stress alerts | I can proactively reach out to struggling students |
| US-13 | Counsellor | Moderate community posts | I ensure a safe peer environment |

### Admin User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-14 | Admin | View user metrics dashboard | I can monitor platform health |
| US-15 | Admin | Manage user roles | I can promote students to counsellors |

---

## 6. System Architecture

### 6.1 High-Level Architecture Diagram (Described)

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│   React + Vite SPA (Tailwind, Zustand, Axios, Recharts) │
│   BlazeFace (In-Browser Face Detection)                  │
│   WebSocket Client (per-user channel)                    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / WSS
┌────────────────────────▼────────────────────────────────┐
│                    API GATEWAY LAYER                     │
│   FastAPI (Python 3.11)                                  │
│   Routers: auth | mood | recommend | analytics |          │
│            notifications | websocket                     │
│   Middleware: CORS | JWT Auth | SlowAPI Rate Limiter     │
└──────┬───────────────┬──────────────────┬───────────────┘
       │               │                  │
┌──────▼──────┐ ┌──────▼──────┐ ┌────────▼──────────────┐
│  AI MODULE  │ │  SERVICES   │ │    DATA LAYER          │
│  detector.py│ │ gamification│ │  MongoDB               │
│  FER + CV2  │ │ analytics   │ │  Collections:          │
│  trend_pred │ │ recommend   │ │   - users              │
│  emotion_log│ │ websocket   │ │   - moods              │
└─────────────┘ └─────────────┘ └────────────────────────┘
```

### 6.2 Data Models

#### User Document (MongoDB)
```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed)",
  "password_hash": "bcrypt string",
  "full_name_encrypted": "Fernet encrypted string",
  "role": "student | counsellor | admin",
  "points": "integer",
  "badges": ["string"],
  "streak": "integer",
  "last_active": "ISO datetime",
  "notification_prefs": {
    "reminder_time": "HH:MM",
    "frequency": "daily | weekly"
  },
  "created_at": "ISO datetime"
}
```

#### Mood Document (MongoDB)
```json
{
  "_id": "ObjectId",
  "user_id": "string (indexed)",
  "emotion": "Happy | Neutral | Sad",
  "confidence": "float 0.0–1.0",
  "raw_scores": { "happy": 0.0, "neutral": 0.0, "sad": 0.0 },
  "method": "FER | heuristic",
  "timestamp": "ISO datetime (indexed)"
}
```

---

## 7. API Specification

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user profile |

### Mood

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/analyze-mood` | JWT | Analyze emotion from image |
| POST | `/api/analyze-mood-debug` | JWT | Debug mode with raw scores |
| POST | `/api/save-mood` | JWT | Save mood entry + gamification |
| GET | `/api/get-history` | JWT | Retrieve mood history |

### Recommendations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/recommend` | JWT | Get personalized recommendations |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/summary` | JWT | Weekly/monthly trend data |
| GET | `/api/analytics/admin/user-metrics` | JWT (Admin) | Aggregate platform metrics |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/notifications/preferences` | JWT | Set reminder preferences |
| GET | `/api/notifications/daily-check` | JWT | Get daily check payload |

### Realtime

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| WS | `/api/ws/mood/{user_id}` | JWT (header) | Per-user WebSocket channel |

### System

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | None | Liveness probe |
| GET | `/ready` | None | Readiness probe (DB ping) |

---

## 8. Evaluation Framework

### 8.1 Psychological Evaluation

| Tool | Description | Target |
|------|-------------|--------|
| DASS-21 | Depression, Anxiety, Stress Scale — 21 items | ≥ 20% stress reduction |
| BRS | Brief Resilience Scale — 6-item resilience measure | ≥ 15% improvement |
| SUS | System Usability Scale — 10-item usability score | ≥ 80/100 |
| NPS | Net Promoter Score — recommendation likelihood | ≥ +40 |

### 8.2 Pilot Study Design

- **Participants:** 150 university students, ages 18–25.
- **Duration:** 6 weeks.
- **Session Length:** 10–15 minutes per day.
- **Design:** Pre/post intervention comparison with paired t-tests and ANOVA.
- **Ethics:** IRB-approved protocol. GDPR-compliant data handling. Informed consent required. High-risk cases auto-flagged for counsellor review.

---

## 9. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| FER unavailable in deployment env | High | Fallback OpenCV heuristic always active |
| Default SECRET_KEY in production | Critical | Env var injection; documented in deployment guide |
| WebSocket auth bypass | High | Route-level auth middleware; user binding checks |
| Low test coverage | Medium | Add pytest fixtures; target 70% coverage pre-demo |
| Recommendation model drift | Medium | Log predictions; add confidence threshold alerts |
| Student privacy breach | Critical | Fernet encryption, GDPR compliance, anonymized analytics |

---

## 10. Deployment Architecture

### 10.1 Docker Compose (Local / Demo)

Services:
- `mongo`: MongoDB 7.0 with named volume.
- `backend`: FastAPI on port 8000.
- `frontend`: React/Vite on port 5173.

Environment variables via `.env` file (never committed to Git):
- `SECRET_KEY`, `ENCRYPTION_KEY`, `MONGO_URI`, `CORS_ORIGINS`

### 10.2 CI/CD Pipeline (GitHub Actions)

Jobs:
1. `backend-tests`: Install deps → run `pytest` suite.
2. `api-smoke`: Spin up mongo + backend → run `scripts/ci_api_smoke.py` end-to-end validation.

Triggers: Push to `main`, pull request to `main`.

---

## 11. Out of Scope (For This Version)

- Native mobile application (iOS/Android).
- Biometric wearable integration (heart rate, sleep data).
- Multilingual support.
- Institutional SSO (OAuth 2.0 hook is present but not wired).
- Full Unity/Phaser game engine integration (mini-games are React-based prototypes).
- Long-term longitudinal study (semester-length).

---

## 12. Glossary

| Term | Definition |
|------|------------|
| FER | Facial Expression Recognition — deep learning model for emotion detection |
| CBT | Cognitive Behavioural Therapy |
| ACT | Acceptance and Commitment Therapy |
| DASS-21 | Depression Anxiety Stress Scale — 21 item validated questionnaire |
| BRS | Brief Resilience Scale |
| SUS | System Usability Scale |
| JWT | JSON Web Token — stateless auth mechanism |
| Fernet | Symmetric encryption scheme from Python cryptography library |
| BlazeFace | Lightweight in-browser face detection model (TensorFlow.js) |
| SlowAPI | FastAPI-compatible rate limiting library |
| NPS | Net Promoter Score |
