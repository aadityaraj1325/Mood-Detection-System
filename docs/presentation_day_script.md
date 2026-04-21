# Presentation-Day Demo Script (7 Minutes)

## Objective
Deliver a confident, end-to-end technical demo of PulseMind AI for final-year evaluation.

## Pre-Demo Checklist (Do this 10-15 minutes before)
1. Ensure Docker Desktop is running.
2. Ensure webcam permissions are enabled for browser.
3. Open PowerShell at project root.
4. Run local stack startup command.

## Live Demo Flow

### 1) Start System (30-60 sec)
```powershell
cd E:\MoodDetectionSystem
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./scripts/start_local_demo.ps1
```

Narration:
- This one command starts MongoDB, FastAPI backend, and React frontend.
- The platform follows a modular architecture: frontend, backend, AI module.

### 2) Prove Operational Readiness (20 sec)
```powershell
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod http://localhost:8000/ready
```

Narration:
- Health confirms service runtime.
- Ready confirms live database connectivity.

### 3) Authentication and Dashboard (60 sec)
Open browser: http://localhost:5173

Actions:
1. Register a student account.
2. Log in.
3. Show dashboard metrics and trend chart.

Narration:
- JWT authentication secures user sessions.
- Dashboard presents stress score and trend insights.

### 4) AI Mood Detection (90 sec)
Actions in app:
1. Open Mood Detection page.
2. Click Analyze Mood.
3. Click Save Mood.

Narration:
- Webcam frame is processed by OpenCV plus FER pipeline.
- The system stores mood label and confidence only.
- Raw image data is not persisted (privacy-first design).

### 5) Analytics and Recommendations (90 sec)
Actions in app:
1. Open History and Analytics page.
2. Show monthly confidence chart and history table.
3. Open Recommendations page.

Narration:
- Trend analytics compute weekly and monthly emotional patterns.
- Recommendation engine suggests activities, journaling prompts, and breathing exercises.
- Predicted next mood and stress score are generated from mood history.

### 6) API Automation Proof (45 sec)
```powershell
./scripts/demo_api_flow.ps1
```

Narration:
- This script validates core APIs end-to-end.
- It demonstrates reproducibility and engineering rigor.

### 7) RBAC and Admin Proof (45 sec)
```powershell
cd backend
python -m scripts.seed_admin --email admin@university.edu --full-name "System Admin" --password "AdminPass123!"
cd ..
```

Narration:
- Role-based access control protects admin-only metrics.
- Admin endpoint is isolated from student permissions.

### 8) Close with Engineering Quality (30 sec)
Narration:
- CI pipeline runs backend tests and API smoke checks on push and pull requests.
- Architecture, sequence, and CI documentation are included in project docs.

### 9) Shutdown (15 sec)
```powershell
./scripts/stop_local_demo.ps1
```

## Fallback Plan if Webcam Fails
1. Continue with API smoke script to prove backend + AI flow.
2. Show existing mood history and analytics pages.
3. Explain privacy, security, and recommendation logic with architecture docs.

## Supporting Documents
- docs/architecture.md
- docs/api_sequence.md
- docs/next_step_runbook.md
- docs/ci_pipeline.md
