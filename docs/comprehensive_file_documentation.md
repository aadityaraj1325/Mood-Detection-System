# Comprehensive Per-File Documentation

This document explains every file and folder in the repository at the time of writing. For each item I describe: purpose, what is implemented, what it processes, why it is used, and where it is typically used in cloud deployments (AWS/GCP/Azure). This is organized top-down: root, then folders and subfolders.

**Notes:** If a folder contained `...` in the workspace listing, I explain the folder purpose and typical file types you will find there (route handlers, controllers, etc.).

**Root files**

- [AGENTS.md](AGENTS.md): Project agent guidance and configuration. Purpose: documents agent workflows used by contributors (e.g., Copilot or CI agents). Implemented: markdown guidance and conventions for automation. Cloud usage: not directly deployed; useful for on-boarding and CI pipeline automation.

- [CLAUDE.md](CLAUDE.md): Notes or instructions relating to Anthropic Claude usage in the project (if any). Purpose: documents prompts, access patterns, or integration guidance. Cloud usage: documents how to store and call Claude via hosted APIs (Secrets Manager / environment variables).

- [design.md](design.md): High-level design notes and architecture diagrams. Purpose: capture system architecture decisions, UX notes and component interactions. Implemented: diagrams, rationale. Cloud usage: informs deployment architecture choices (regions, multi-AZ, service split).

- [docker-compose.yml](docker-compose.yml): Local development orchestrator. Purpose: run multiple services (frontend, backend, DB, etc.) locally with Docker. Implemented: service definitions, networks, volumes, env files. Processes: brings up containers, maps ports, sets dependencies. Cloud usage: useful for local testing before pushing images to ECR / Container Registry; can be used in CI to run integration tests.

- [GEMINI.md](GEMINI.md): Notes for Google Gemini model integration (if present). Purpose: documents usage, API patterns and prompt designs. Cloud usage: details how to securely store API keys and call external LLMs from cloud services.

- [prd.md](prd.md): Product Requirements Document. Purpose: authoritative feature list, acceptance criteria, and project scope. Implemented: product goals, timelines. Cloud usage: used to prioritize cloud resources and SLAs for production environments.

- [README.md](README.md): Project overview and quick start instructions. Purpose: entrypoint for contributors. Implemented: setup, running locally, architecture summary. Cloud usage: often includes deployment notes and links to infra scripts.

- [TASK_LIST.md](TASK_LIST.md): Project-level TODOs and tasks. Purpose: developer task tracking outside of issue tracker. Implemented: lists of work items. Cloud usage: guides which infra or cloud tasks remain.

- [tech.md](tech.md): Technology choices and rationale. Purpose: documents why particular libraries, frameworks and infra were chosen. Cloud usage: maps tech decisions to managed services (e.g., FastAPI -> App Runner/ECS; React -> S3+CloudFront).


**Folder: ai_module/**
This folder contains the AI/ML-related code used by the project.

- `ai_module/__init__.py`: Package initializer. Purpose: make `ai_module` importable. Implemented: usually empty or contains package metadata. Cloud usage: packaged as part of backend service image; imported by the backend to run inference.

- `ai_module/detector.py`: Core emotion detection module. Purpose: implement model loading, pre/post-processing, inference entrypoints, and utilities for detecting mood/emotion from data (likely images/audio/text depending on project). Implemented: functions and classes for inference and scoring. Processes: input data (image frames or audio/text), runs model, returns predicted emotion labels and confidence. Cloud usage: runs inside backend container or a dedicated inference service (ECS/Fargate, Lambda for small models, or EC2/GPU instances for heavy models). If inference is heavy, separate into its own service behind an API gateway.

- `ai_module/emotion_logs.csv`: Local sample data or debug logs of detected emotions. Purpose: quick dataset for development or examples. Implemented: CSV rows with timestamps and labels. Processes: read/write by local scripts or the detector during testing. Cloud usage: do NOT keep as writable file in containers in production — use S3 or a managed DB instead.

- `ai_module/requirements.txt`: Python dependencies specifically for the AI module (may be used for virtualenv in local dev). Purpose: pin packages needed for model code (e.g., numpy, torch, tensorflow). Cloud usage: used when building Docker images (system packages and Python libs are installed from this file). When deploying to cloud, bake these into the service image or use a serverless package step.

- `ai_module/trend_predictor.py`: Utility to analyze emotion logs over time and predict trends. Purpose: run simple analytics, smoothing, or time-series forecasting (e.g., moving average, ARIMA, or simple ML models). Implemented: functions for aggregation and prediction. Processes: historical emotion records, outputs trend metrics. Cloud usage: can run as part of a scheduled job (AWS Lambda scheduled via EventBridge, or a cron-like ECS task) or as an on-demand microservice.


**Folder: backend/**
This is the server-side application (FastAPI-based by context). Typically holds the web API, services, models and core infra code.

- `backend/Dockerfile`: Docker build instructions for the backend service. Purpose: create a container image with the Python runtime, application code, and dependencies. Implemented: base image lines, copy app, pip install, expose port, CMD to run Uvicorn/Gunicorn. Cloud usage: build and push to ECR, then deploy on App Runner, ECS, or EKS.

- `backend/requirements.txt`: Top-level Python dependencies for the backend. Purpose: ensure reproducible dependency install. Implemented: pinned package versions (FastAPI, Uvicorn, databases, SQLAlchemy, pydantic). Cloud usage: used in Docker build.

- `backend/app/__init__.py`: Package initializer for the app. Purpose: make `app` importable.

- `backend/app/main.py`: Application entrypoint. Purpose: create FastAPI app instance, include routers, configure middleware (CORS, logging), and start the server with Uvicorn for local runs. Implemented: `create_app()` or module-level `app = FastAPI()`; includes mounting of api routes and startup/shutdown event handlers. Processes: receives HTTP requests and dispatches to route handlers. Cloud usage: served by Uvicorn behind a process manager or container runtime in ECS/App Runner. Health checks from load balancers point here.

- `backend/app/api/__init__.py`: package init for API layer.

- `backend/app/api/routes/` (folder): Holds route modules that register endpoints. Purpose: define REST endpoints for mood detection, analytics, auth, recommendations, etc. Typical files: `auth.py`, `mood.py`, `analytics.py`, `recommendations.py`, `websocket.py`. Implemented: FastAPI `APIRouter` instances and path functions. Processes: HTTP requests, marshalling to service layer, returning responses. Cloud usage: these endpoints are exposed via ALB / API Gateway; secure them with TLS and WAF if needed.

- `backend/app/core/__init__.py`: package init.

- `backend/app/core/config.py`: Central configuration. Purpose: read environment variables, set defaults for DB URLs, secrets, and service flags. Implemented: pydantic BaseSettings or similar. Processes: loads config at app startup. Cloud usage: environment variables or Secrets Manager map into runtime—this file defines which env variables are required.

- `backend/app/core/crypto.py`: Cryptographic utilities. Purpose: hashing passwords, JWT helper functions, encryption helpers. Implemented: wrappers around `passlib` or `cryptography`. Processes: user auth flows and token signing. Cloud usage: use KMS (AWS) for key management in production; store keys in Secrets Manager, and avoid hard-coding secrets.

- `backend/app/core/database.py`: Database connection and ORM setup. Purpose: set up SQLAlchemy / async DB engine, session maker, and helper functions for getting DB sessions. Implemented: engine creation using `DATABASE_URL`, session-scoped dependencies. Processes: queries, migrations (Alembic may be used separately). Cloud usage: connect to RDS or Aurora via VPC. Use connection pooling and proper credentials from Secrets Manager.

- `backend/app/core/rate_limiter.py`: Request rate limiting utilities. Purpose: prevent abuse, throttle endpoints. Implemented: in-memory counters or wrappers around Redis-based rate limiting. Processes: examines client IPs / auth tokens and decides to allow or reject. Cloud usage: serverless deployments should use API Gateway throttling or a Redis/ElastiCache-backed limiter for multi-instance setups.

- `backend/app/core/security.py`: Authorization helpers and security policies. Purpose: dependency injections for current user, JWT validation, role checks. Implemented: `get_current_user()` and permission decorators. Processes: validate tokens and guard endpoints. Cloud usage: integrate with Cognito or IAM in large deployments, or continue using JWT validated against a secret stored in Secrets Manager.

- `backend/app/models/__init__.py`: ORM model package init.

- `backend/app/schemas/__init__.py`: package init for Pydantic schemas.

- `backend/app/schemas/analytics.py`: Pydantic models representing analytics payloads and responses. Purpose: input validation and response shaping for analytics endpoints. Implemented: `AnalyticsRequest`, `AnalyticsResponse` classes. Processes: validate request bodies and serialize database query results.

- `backend/app/schemas/mood.py`: Schemas for mood detection requests and responses. Purpose: define request payloads for detection endpoints and response shape (emotion label, score, metadata). Implemented: `MoodRequest`, `MoodResponse` pydantic classes.

- `backend/app/schemas/recommendation.py`: Schemas for recommendation endpoints. Purpose: define data shapes for personalized suggestions returned to users.

- `backend/app/schemas/user.py`: User-related schemas (signup, login, profile). Purpose: validation for auth endpoints.

- `backend/app/services/__init__.py`: package init for service layer.

- `backend/app/services/ai_service.py`: Service wrapper around `ai_module`. Purpose: orchestrates calls to `ai_module` detector functions, applies business logic, caches results, and transforms model outputs into API-ready responses. Implemented: functions such as `analyze_emotion()` and helpers to cache or persist results. Cloud usage: runs in backend service; heavy inference can be routed to a dedicated inference service.

- `backend/app/services/analytics_service.py`: Analytics business logic. Purpose: aggregate data, run trend predictions (possibly using `ai_module/trend_predictor.py`), and prepare analytics responses. Implemented: DB queries and aggregation. Cloud usage: can be called on-demand by API or run as scheduled batch job.

- `backend/app/services/emotion_utils.py`: Small helpers for emotion labels and normalization. Purpose: utility functions to map model outputs to UI-friendly labels and colors. Implemented: label mapping tables and thresholds.

- `backend/app/services/gamification_service.py`: Business logic for achievements and gamification. Purpose: compute badges, track progress and award points. Implemented: rules engine functions that read/write to DB.

- `backend/app/services/recommendation_service.py`: Recommendation logic. Purpose: produce personalized recommendations based on mood history and analytics. Implemented: heuristics or ML-based recommender wrappers.

- `backend/app/services/websocket_manager.py`: Websocket connection manager. Purpose: manage connected clients for real-time updates (e.g., live mood detection stream). Implemented: tracking dicts of active sockets, broadcast helpers. Processes: real-time messages; used by WebSocket endpoints. Cloud usage: requires sticky sessions or a managed WS service (API Gateway WebSockets, or ECS behind a WebSocket-aware LB). Consider a dedicated pub/sub (SNS/SQS, Redis) for cross-instance broadcasts.


**Folder: backend/scripts/**

- `backend/scripts/__init__.py`: Package init.

- `backend/scripts/seed_admin.py`: Script to create an admin user and seed essential data. Purpose: bootstrap the DB with initial user(s) and roles. Implemented: script reads DB config and inserts records. Run in cloud: use as a one-time job during deployment (ECS task or run from CI/CD) with appropriate DB credentials from Secrets Manager.


**Folder: backend/tests/**

- `backend/tests/test_services.py`: Unit tests for service layer. Purpose: validate business logic for analytics, recommendations, or AI wrappers. Implemented: pytest tests mocking DB and AI calls. Cloud usage: run in CI (GitHub Actions) as part of the pipeline; failing tests should block deploy.


**Folder: docs/**
Contains existing project documentation and runbooks.

- `docs/api_sequence.md`: API call sequence and flow diagrams. Purpose: visualize request lifecycles.
- `docs/architecture.md`: Architecture diagrams and rationale.
- `docs/ci_pipeline.md`: CI/CD pipeline description and steps to push images and deploy.
- `docs/comprehensive_project_report_2026-04-21.md`: Project report snapshot.
- `docs/next_step_runbook.md`: Suggested next steps for maintainers.
- `docs/presentation_day_script.md`: Presentation notes.


**Folder: frontend/**
This is a modern frontend app (likely React + Vite + Tailwind).

- `frontend/Dockerfile`: Dockerfile to build the frontend production artifact (build static files) and optionally serve them with nginx or a static server. Cloud usage: build and upload to S3/CloudFront, or serve from an App Runner static service.

- `frontend/index.html`: Single-page app entrypoint. Purpose: HTML shell that mounts React.

- `frontend/package.json`: NPM package manifest. Purpose: scripts (start, build, dev), dependencies (react, vite, tailwind). Processes: used by dev and CI to run `npm build`.

- `frontend/postcss.config.js`: PostCSS config used by Tailwind.

- `frontend/tailwind.config.js`: Tailwind CSS configuration.

- `frontend/vite.config.js`: Vite configuration for bundling and dev server.

- `frontend/public/` : Static assets folder (images, favicon). Purpose: assets copied to build output.

- `frontend/src/App.jsx`: Root React component or router. Purpose: define top-level routes and layout.

- `frontend/src/index.css`: Global styles, including Tailwind imports.

- `frontend/src/main.jsx`: App bootstrap and ReactDOM render. Purpose: inject App into DOM.

- `frontend/src/components/` : UI components used across pages. Files listed:
  - `BadgeCard.jsx`: UI card to show achievement badges.
  - `BadgeModal.jsx`: Modal showing badge details.
  - `BottomNav.jsx`: Mobile bottom navigation.
  - `ErrorBoundary.jsx`: React error boundary for catching render errors.
  - `GlassCard.jsx`: Decorative card UI.
  - `Layout.jsx`: App layout with header/sidebar.
  - `MetricCard.jsx`: Displays metric values.
  - `MoodCard.jsx`: Component to show mood result.
  - `MoodOrb.jsx`: Visual orb representing mood color/strength.
  - `NeuralParticles.jsx`: Visual effect component.
  - `ProtectedRoute.jsx`: Route gate that checks auth context and redirects.
  - `RecommendCard.jsx`: UI for showing recommendations.
  - `Sidebar.jsx`: Main navigation sidebar.
  - `SkeletonLoader.jsx`: Loading skeleton UI.
  - `ToastNotification.jsx`: In-app toast system.
  - `charts/` folder: chart components used in analytics pages.
  - `ui/` folder: primitive UI elements (buttons, inputs).

Purpose: these components implement presentation logic only and consume data from `services/`.

- `frontend/src/context/AuthContext.jsx`: React context for auth state. Purpose: store user token, profile, and helper methods (login/logout). Processes: token storage in localStorage and providing auth state to `ProtectedRoute`.

- `frontend/src/hooks/` : Custom hooks.
  - `useAuth.js`: Hook exposing auth state and helpers.
  - `useMoodHistory.js`: Hook to fetch mood history for charts and caching logic.
  - `useWebSocket.js`: Hook that manages socket connection for live updates.

- `frontend/src/pages/` : SPA pages.
  - `AchievementsPage.jsx`, `AuthPage.jsx`, `DashboardPage.jsx`, `HistoryAnalyticsPage.jsx`, `MoodDetectionPage.jsx`, `RecommendationsPage.jsx` — each implements page-level state and calls services for data.

- `frontend/src/services/` : JS service modules that call backend APIs.
  - `analyticsService.js`: Calls analytics endpoints and normalizes results.
  - `api.js`: low-level axios/fetch wrapper that attaches auth token and base URL.
  - `authService.js`: Login, logout, refresh tokens.
  - `moodService.js`: Endpoints to submit images/text for mood detection and poll results.
  - `recommendationService.js` / `recommendService.js`: Fetch recommendations.
  - `socketService.js`: Abstraction over WebSocket connection.

- `frontend/src/store/uiStore.js`: Local state store (e.g., Zustand) for UI state like theme and sidebar.

- `frontend/src/styles/global.css`: Additional global CSS.

- `frontend/src/utils/` : Helper utilities.
  - `dateHelpers.js`: Date formatting helpers used in UI.
  - `emotionColors.js`: Map emotion labels to color hex codes used by `MoodOrb`.
  - `validators.js`: Input validators for forms.


**Folder: scripts/**
Top-level operational scripts for demos and CI.

- `scripts/ci_api_smoke.py`: CI smoke test to ensure the API responds. Purpose: quick end-to-end check used in pipeline.

- `scripts/demo_api_flow.ps1`: PowerShell script to demonstrate API flows locally.

- `scripts/presentation_prep.ps1`: Presentation automation script.

- `scripts/send_daily_reminder.py`: Script to send reminders to users (can be scheduled via cron/EventBridge). Cloud usage: convert to Lambda or run as scheduled ECS task.

- `scripts/start_local_demo.ps1` and `scripts/stop_local_demo.ps1`: Helper scripts to spin up and tear down local demos (likely using docker-compose). Cloud usage: not deployed but useful for local staging.


Deployment and Cloud Mapping (how each piece is typically deployed)

- Frontend (`frontend/`): static build -> host on S3 + CloudFront (AWS). Alternative: Amplify Hosting. Why: low cost, global CDN, simple invalidation and TLS via ACM.

- Backend (`backend/` + `ai_module/`): containerized service -> push image to ECR and run on App Runner for quick deploys or ECS Fargate for production. If inference needs GPU, use EC2/GPU instances or SageMaker endpoints for heavy models. Why: Docker images match local dev, Fargate provides scaling, and RDS/Aurora handles DB.

- Database: use Amazon RDS (Postgres/MySQL) or Aurora for production. Why: managed backups, replicas, and mature scaling options.

- Secrets: store JWT keys and API keys in AWS Secrets Manager or Parameter Store and reference them via environment variables in the container service.

- Caching & rate-limiting: Redis via ElastiCache. Why: shared, low-latency in-memory store for distributed rate limiting and caching.

- Real-time (WebSockets): API Gateway WebSockets or ECS service behind an ALB with sticky sessions and a pub/sub (ElastiCache/Redis) to distribute messages. Why: API Gateway provides a managed WebSocket option; ECS + Redis works for more control.

- Batch/trends jobs: run scheduled tasks in ECS (scheduled tasks) or Lambda if lightweight. Why: serverless schedule or short-lived containers reduce cost for infrequent jobs.


Security & Operational Notes

- Never commit secrets or environment-specific files. Use the `backend/app/core/config.py` to enumerate required env vars and use Secrets Manager for production.

- Avoid writable local CSVs in production; use persistent storage (S3 or DB).

- For heavy AI workloads, separate inference from API to avoid blocking HTTP responses; use async job queues (SQS + worker) or model hosting services (SageMaker, Triton, or dedicated GPU hosts).


Where to look for functionality when working on this repo

- API endpoints and business logic: `backend/app/api/routes/` and `backend/app/services/`.
- DB models and migrations: `backend/app/models/` and DB migration tooling (if present in repo). If Alembic is not present, expect manual migration scripts or a missing migrations folder.
- Frontend behavior: `frontend/src/pages/`, `frontend/src/components/`, and `frontend/src/services/`.
- AI and inference: `ai_module/` and `backend/app/services/ai_service.py`.


Suggested next steps (manual actions you can ask me to do)

- I can expand this doc by reading file contents and adding code-level references (function/class-level summaries). Ask me to scan files and update this doc.
- I can generate a deployment checklist and CloudFormation/Terraform templates for AWS (App Runner/ECS, RDS, S3/CloudFront, Secrets Manager).
- I can run tests or build Docker images locally and report results.


EC2 single-instance deployment runbook

This repo can run on one EC2 instance with Docker Compose. That is the simplest way to get it online quickly.

1. Launch an EC2 instance
- Use Ubuntu 22.04 LTS.
- Add an Elastic IP if you want a stable public address.
- Security group inbound rules:
  - `22` from your IP for SSH
  - `8000` for the backend API
  - `5173` for the frontend if you keep the current compose port mapping
  - `27017` only if you expose MongoDB publicly, which is not recommended

2. Install Docker on EC2
- Install Docker Engine and the Compose plugin.
- Add your user to the `docker` group so you do not need `sudo` for every command.

3. Copy the repository onto the instance
- Clone the repo with `git clone` or upload it with SCP.
- Move into the project root directory.

4. Create production environment files
- Backend: set `SECRET_KEY`, `ENCRYPTION_KEY`, `MONGODB_URI`, `MONGODB_DB_NAME`, and `CORS_ORIGINS`.
- Frontend: set `VITE_API_BASE_URL` to your EC2 public IP or Elastic IP, for example `http://YOUR_EC2_PUBLIC_IP:8000`.
- Important: the frontend code reads the API base during build time from `frontend/src/services/api.js`, so the frontend image must be built with the correct public backend URL. If you do not set this before building, the browser will keep trying `localhost`, which only works on your own machine.

5. Start the stack
- Run `docker compose up -d --build` from the repository root.
- This starts:
  - MongoDB on the internal Docker network
  - Backend on port `8000`
  - Frontend on port `5173`

6. Verify the services
- Open `http://YOUR_EC2_PUBLIC_IP:8000/health` for backend health.
- Open `http://YOUR_EC2_PUBLIC_IP:5173` for the frontend.
- If the frontend loads but API calls fail, fix the frontend API base URL and rebuild the frontend image.

7. Share access with others
- Share the EC2 public IP or, better, a domain name pointing to the instance.
- Do not share `localhost` or `127.0.0.1`; those only work on the same machine.

8. Production improvements after it works
- Put Nginx in front of the app and route `/api` to the backend.
- Move MongoDB to a managed service such as MongoDB Atlas or an AWS-hosted database pattern.
- Put the frontend behind a domain and HTTPS using a load balancer or Nginx + Let’s Encrypt.
- Store secrets in AWS Secrets Manager or SSM Parameter Store.

Recommended URL pattern if you keep one EC2 instance
- Frontend: `http://YOUR_EC2_PUBLIC_IP:5173`
- Backend: `http://YOUR_EC2_PUBLIC_IP:8000`
- Swagger docs: `http://YOUR_EC2_PUBLIC_IP:8000/docs`

If you want, I can turn this into an exact AWS EC2 checklist with the commands to run one by one.

---
Generated on: 2026-05-27
