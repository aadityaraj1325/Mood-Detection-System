# Development of an AI-Driven Digital Mental Health and Psychological Support System for Higher Education Students

## Overview
PulseMind AI is a modular full-stack mental health support platform for higher education students. The project combines AI-based facial emotion detection, trend analytics, and personalized interventions in a privacy-first architecture.

## Tech Stack
- Frontend: React (Vite), Recharts, react-webcam
- Backend: FastAPI, Motor (MongoDB), JWT auth, SlowAPI rate limiting
- AI Module: OpenCV + FER (with fallback heuristics), basic ML prediction
- Data: MongoDB
- Deployment: Docker, Docker Compose

## Core Features
- JWT authentication (register/login) with role-based access control
- Mood detection endpoint with confidence scoring
- Mood history logging and analytics dashboard
- Recommendation engine with gamification (points and badges)
- Mood trend prediction (basic time-series/ML)
- Optional real-time mood stream via WebSocket
- Daily reminder notification API
- Privacy-first approach: no raw images stored, sensitive profile fields encrypted

## Project Structure
- `frontend/`: React dashboard and pages
- `backend/`: FastAPI REST API and websocket server
- `ai_module/`: Emotion detection and trend prediction logic
- `scripts/`: Utility scripts for reminders

## API Endpoints
- `GET /health`
- `GET /ready`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/analyze-mood`
- `POST /api/save-mood`
- `GET /api/get-history`
- `GET /api/recommend`
- `GET /api/analytics/summary`
- `GET /api/analytics/admin/user-metrics` (admin only)
- `POST /api/notifications/preferences`
- `GET /api/notifications/daily-check`
- `WS /api/ws/mood/{user_id}`

## Local Setup With Persistent MongoDB
This is the recommended way to run the project if you want accounts and mood history to survive restarts.

### 1) Install prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.11+

### 2) Create environment files
```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

### 3) Start the persistent stack
```powershell
docker compose up --build
```

This starts:
- MongoDB with a named Docker volume for persistence
- FastAPI backend
- Vite frontend

### 4) Open the app
- Frontend: http://localhost:5173
- Backend docs: http://localhost:8000/docs

### 5) Stop the stack
```powershell
docker compose down
```

### Optional: local backend/frontend without Docker Mongo
If you only want a temporary in-memory demo, use the helper script:
```powershell
./scripts/start_local_demo.ps1 -UseDockerMongo:$false
```
That mode is not persistent across restarts.

## New Steps Completed
- Added admin user seeding utility for RBAC demos.
- Added architecture and API sequence diagrams for viva/presentation.
- Added an evaluation-oriented demo flow checklist.

## Run Admin Seeding Script
```bash
cd backend
python -m scripts.seed_admin --email admin@university.edu --full-name "System Admin" --password "AdminPass123!"
```

## Architecture and Sequence Docs
- `docs/architecture.md`
- `docs/api_sequence.md`

## Continuous Integration
- Workflow: `.github/workflows/ci.yml`
- Includes backend tests and live API smoke checks against MongoDB
- CI smoke script: `scripts/ci_api_smoke.py`
- Guide: `docs/ci_pipeline.md`

## Instant Local Demo Mode (One Command)
From the project root in PowerShell:

```powershell
./scripts/start_local_demo.ps1
```

This script will:
- Start MongoDB using Docker (`mongo` service) with a persistent Docker volume
- Launch backend in a new PowerShell terminal (creates `.venv`, installs dependencies, starts FastAPI)
- Launch frontend in a new PowerShell terminal (installs npm packages if needed, starts Vite)

To stop everything launched by the script:

```powershell
./scripts/stop_local_demo.ps1
```

Optional startup flags:

```powershell
./scripts/start_local_demo.ps1 -UseDockerMongo:$false -BackendPort 8000 -FrontendPort 5173
```

Use `-UseDockerMongo:$false` only for temporary in-memory testing.

## API Smoke Test (Next Step)
After starting the backend, run:

```powershell
./scripts/demo_api_flow.ps1
```

This executes an end-to-end verification flow:
- health and readiness checks
- register/login with JWT
- mood analysis and save
- history, recommendation, analytics, and notification retrieval

Detailed runbook: `docs/next_step_runbook.md`

## Presentation Day Assets
- Full 7-minute live script: `docs/presentation_day_script.md`
- One-command pre-demo validator: `scripts/presentation_prep.ps1`

Run pre-demo validation after startup:

```powershell
./scripts/presentation_prep.ps1
```

## Production Readiness Notes
- Change `SECRET_KEY` and `ENCRYPTION_KEY` before deployment
- Enable HTTPS and secure cookie/session strategy in production
- Add proper observability (logs + metrics + tracing)
- Add CI tests and load testing for scale

## Future Enhancements
- Wearable integration
- Multilingual recommendations
- Push/email notification channels
- Stronger ML models with federated privacy controls
