# Mood Detection System (PulseMind AI)

AI-powered digital mental health support platform for higher-education students, combining webcam mood detection, historical analytics, personalized recommendations, gamification, and reminder workflows in a privacy-aware full-stack architecture.

---

## Table of Contents

1. [What This Project Does](#what-this-project-does)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Features in Detail](#features-in-detail)
6. [API Reference](#api-reference)
7. [Environment Configuration](#environment-configuration)
8. [Run Locally (Docker - Recommended)](#run-locally-docker---recommended)
9. [Run Locally (Without Docker Compose)](#run-locally-without-docker-compose)
10. [One-Command Local Demo (PowerShell)](#one-command-local-demo-powershell)
11. [Testing, Build, and CI](#testing-build-and-ci)
12. [Admin Seeding](#admin-seeding)
13. [Presentation/Documentation Assets](#presentationdocumentation-assets)
14. [Troubleshooting](#troubleshooting)
15. [Security and Privacy Notes](#security-and-privacy-notes)
16. [Roadmap / Future Enhancements](#roadmap--future-enhancements)

---

## What This Project Does

The system is designed to support emotional well-being workflows for students by:

- detecting mood from webcam frames using AI-assisted emotion inference
- storing mood history and confidence over time
- computing analytics summaries (trend and stress-like scoring)
- generating personalized recommendations and micro-actions
- awarding points and badges to encourage consistency
- providing notification preference and daily check-in APIs
- enabling optional real-time mood updates via WebSocket

The backend is API-first (FastAPI), while the frontend is a React dashboard.

---

## Architecture Overview

High-level flow:

1. User authenticates (`/api/auth/*`) and receives JWT.
2. Frontend captures frame and sends base64 image to `/api/analyze-mood`.
3. Backend runs emotion analysis:
   - primary detector via `ai_module` (FER/OpenCV path)
   - fallback brightness heuristic if detector is unavailable
4. User confirms/saves mood via `/api/save-mood`.
5. Backend stores mood event in MongoDB and updates points/badges.
6. Analytics (`/api/analytics/summary`) and recommendation (`/api/recommend`) consume mood history.
7. Optional realtime events are sent to `/api/ws/mood/{user_id}` consumers.

See architecture docs:

- `docs/architecture.md`
- `docs/api_sequence.md`

---

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Charting: Recharts + Chart.js wrappers
- Webcam capture: `react-webcam`
- Routing: `react-router-dom`
- State utilities: Zustand

### Backend
- FastAPI + Uvicorn
- MongoDB driver: Motor
- Auth: JWT (`python-jose`) + password hashing (`passlib`/bcrypt)
- Rate limiting: SlowAPI
- Settings: Pydantic Settings
- Encryption of sensitive fields: Fernet (`cryptography`)

### AI / ML
- OpenCV + FER integration
- Numpy / Scikit-learn
- Lightweight logistic regression bootstrapped model for next-mood prediction
- Deterministic fallback mood heuristic when FER path is unavailable

### DevOps / Delivery
- Docker + Docker Compose
- GitHub Actions CI (`.github/workflows/ci.yml`)

---

## Repository Structure

```text
.
├── ai_module/                  # Emotion detection module dependencies and detector integration
├── backend/
│   ├── app/
│   │   ├── api/routes/         # Auth, mood, analytics, recommendation, notification, websocket routes
│   │   ├── core/               # Config, DB, crypto, auth/security, rate limiter
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   └── services/           # AI service, analytics/recommendation/gamification logic
│   ├── scripts/                # Utility scripts (admin seeding)
│   ├── tests/                  # Backend unit tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/              # Auth, dashboard, mood capture, analytics, recommendations, achievements
│   │   ├── components/
│   │   ├── services/
│   │   └── store/
│   ├── package.json
│   └── .env.example
├── scripts/                    # Demo scripts, smoke flow, presentation prep
├── docs/                       # Architecture, CI pipeline, runbook, presentation script
└── docker-compose.yml
```

---

## Features in Detail

### 1) Authentication and Access Control
- User registration and login with JWT token issuance.
- Protected user profile endpoint (`/api/auth/me`).
- Role-based authorization helper (`require_role`) for admin-only metrics endpoint.
- Auth route rate limiting (`RATE_LIMIT_AUTH`, default `5/minute`).

### 2) Mood Analysis
- `/api/analyze-mood` accepts base64-encoded image frame.
- Returns normalized emotion and confidence score.
- `/api/analyze-mood-debug` provides method-level debug metadata.
- If FER detector cannot initialize, fallback uses brightness-based inference.

### 3) Mood Logging + Gamification
- `/api/save-mood` stores normalized emotion, confidence, source, mood score.
- Points awarded per entry (`base + confidence bonus`).
- Badge logic includes consistency and positivity milestones.

### 4) History + Analytics
- `/api/get-history` returns latest mood entries.
- `/api/analytics/summary` computes trend-oriented summary and predicted next mood.
- `/api/analytics/admin/user-metrics` gives admin aggregate usage stats.

### 5) Recommendations
- `/api/recommend` uses recent emotions + confidence to estimate next mood.
- Returns:
  - activities
  - journaling prompt
  - breathing exercise
  - challenge
  - predicted next mood
  - stress score

### 6) Notifications
- Store notification preferences (`/api/notifications/preferences`).
- Retrieve daily check payload (`/api/notifications/daily-check`).

### 7) Realtime Updates
- WebSocket endpoint at `/api/ws/mood/{user_id}`.
- Mood analyze/save actions can push event updates to connected clients.

---

## API Reference

Base backend URL (local): `http://localhost:8000`  
API prefix: `/api`

### System
- `GET /` - service message
- `GET /health` - liveness
- `GET /ready` - readiness + DB check

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

### Mood
- `POST /api/analyze-mood` (Bearer token)
- `POST /api/analyze-mood-debug` (Bearer token)
- `POST /api/save-mood` (Bearer token)
- `GET /api/get-history?limit=50` (Bearer token)

### Recommendations
- `GET /api/recommend` (Bearer token)

### Analytics
- `GET /api/analytics/summary` (Bearer token)
- `GET /api/analytics/admin/user-metrics` (Bearer token, admin role required)

### Notifications
- `POST /api/notifications/preferences` (Bearer token)
- `GET /api/notifications/daily-check` (Bearer token)

### Realtime
- `WS /api/ws/mood/{user_id}`

Interactive docs (Swagger UI): `http://localhost:8000/docs`

---

## Environment Configuration

### Backend (`backend/.env`)

Copy from:

```bash
cp backend/.env.example backend/.env
```

Variables:

| Variable | Purpose | Example |
|---|---|---|
| `APP_NAME` | FastAPI app name | `Mood Detection API` |
| `API_PREFIX` | API prefix | `/api` |
| `SECRET_KEY` | JWT signing secret | `change-me-in-production` |
| `ENCRYPTION_KEY` | Fernet key for encrypted profile fields | `...` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT lifetime | `1440` |
| `MONGODB_URI` | Mongo connection URI | `mongodb://mongo:27017` |
| `MONGODB_DB_NAME` | DB name | `mood_detection_system` |
| `USE_MOCK_DB` | In-memory mock DB mode | `false` |
| `CORS_ORIGINS` | Allowed frontend origins | `["http://localhost:5173"]` |
| `RATE_LIMIT_AUTH` | Auth endpoint rate limit | `5/minute` |
| `RATE_LIMIT_API` | API endpoint rate limit | `60/minute` |

### Frontend (`frontend/.env`)

Copy from:

```bash
cp frontend/.env.example frontend/.env
```

Variables:

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend REST API base | `http://localhost:8000/api` |
| `VITE_WS_BASE_URL` | Backend websocket base | `ws://localhost:8000/api/ws/mood` |

---

## Run Locally (Docker - Recommended)

This is the easiest and most stable setup for local development.

### Prerequisites
- Docker Desktop (or Docker Engine + Compose plugin)

### Steps

1. Create env files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Start stack:
   ```bash
   docker compose up --build
   ```
3. Open:
   - Frontend: `http://localhost:5173`
   - Backend docs: `http://localhost:8000/docs`
4. Stop:
   ```bash
   docker compose down
   ```

### What starts
- `mongo` (`mongo:7`) with named volume `mongo_data` for persistence
- `backend` (FastAPI)
- `frontend` (Vite app container)

---

## Run Locally (Without Docker Compose)

Use this if you want backend/frontend to run directly on your machine.

### Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB (local or external), unless using mock mode

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## One-Command Local Demo (PowerShell)

For Windows/PowerShell-driven demo flow, use:

```powershell
./scripts/start_local_demo.ps1
```

What it does:
- attempts to ensure Docker daemon is running
- starts Mongo in Docker (`docker compose up -d mongo`) when available
- opens backend and frontend in new PowerShell terminals
- waits for backend `/health`
- writes runtime state to `.runtime/local-demo-state.json`

Optional flags:

```powershell
./scripts/start_local_demo.ps1 -UseDockerMongo:$false -BackendPort 8000 -FrontendPort 5173
```

- `-UseDockerMongo:$false` forces in-memory mock DB mode (`USE_MOCK_DB=true`)

Stop demo services:

```powershell
./scripts/stop_local_demo.ps1
```

---

## Testing, Build, and CI

### Backend tests

```bash
cd backend
python -m pytest -q
```

### Frontend production build

```bash
cd frontend
npm ci
npm run build
```

### API smoke flow (manual/local demo)

```powershell
./scripts/demo_api_flow.ps1
```

This validates end-to-end API behavior:
- health/readiness
- auth register/login
- analyze + save mood
- history, recommendation, analytics, notifications

### CI

Workflow: `.github/workflows/ci.yml`

CI jobs:
1. **backend-tests**: installs backend deps and runs `pytest -q`
2. **api-smoke**: starts Mongo service + backend, then runs `scripts/ci_api_smoke.py`

CI guide: `docs/ci_pipeline.md`

---

## Admin Seeding

Create an admin user for RBAC demos:

```bash
cd backend
python -m scripts.seed_admin --email admin@university.edu --full-name "System Admin" --password "AdminPass123!"
```

---

## Presentation/Documentation Assets

- `docs/architecture.md` - architecture narrative
- `docs/api_sequence.md` - API interaction sequence
- `docs/next_step_runbook.md` - operational runbook
- `docs/presentation_day_script.md` - structured live demo script
- `scripts/presentation_prep.ps1` - pre-demo checks

Run pre-demo validator:

```powershell
./scripts/presentation_prep.ps1
```

---

## Troubleshooting

### Backend readiness fails (`/ready`)
- verify MongoDB is reachable via configured `MONGODB_URI`
- if using Docker stack, confirm `mongo` service is up

### Auth errors (`401` / `Could not validate credentials`)
- ensure `Authorization: Bearer <token>` is present
- ensure backend `SECRET_KEY`/`ALGORITHM` are consistent and unchanged mid-session

### Frontend cannot reach backend
- verify `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` in `frontend/.env`
- confirm CORS origin includes frontend URL in backend `.env`

### Large frontend bundle warning during build
- Vite may warn about chunk size; current build still succeeds
- optimize later using route-level dynamic imports and chunk config if needed

---

## Security and Privacy Notes

- Passwords are hashed with bcrypt (via Passlib).
- JWTs are used for API authentication.
- Sensitive user profile field(s) are encrypted using Fernet.
- Raw image frames are analyzed in request flow and not persisted by default.
- Rotate `SECRET_KEY` and `ENCRYPTION_KEY` for production.
- Enable HTTPS and hardened deployment settings in production environments.

---

## Roadmap / Future Enhancements

- Wearable data integration
- Multilingual recommendation content
- Richer notification channels (push/email)
- Stronger mood modeling and privacy-preserving learning strategies
