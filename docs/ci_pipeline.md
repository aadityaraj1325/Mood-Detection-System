# CI Pipeline Guide

## Workflow File
- .github/workflows/ci.yml

## Trigger Events
- Push to main or master
- Pull request targeting main or master

## Jobs
1. backend-tests
- Installs backend dependencies
- Runs pytest suite from backend/tests

2. api-smoke
- Starts MongoDB service in GitHub Actions
- Boots FastAPI backend
- Runs end-to-end smoke flow using scripts/ci_api_smoke.py

## Smoke Flow Coverage
- GET /health
- GET /ready
- POST /api/auth/register
- POST /api/auth/login
- POST /api/analyze-mood
- POST /api/save-mood
- GET /api/get-history
- GET /api/recommend
- GET /api/analytics/summary
- GET /api/notifications/daily-check

## How to Read Failures
- Open Actions tab in GitHub
- Select CI run
- Inspect failed job logs
- backend-ci.log is printed automatically if api-smoke fails
