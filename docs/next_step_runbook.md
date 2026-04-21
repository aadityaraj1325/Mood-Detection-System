# Next Step Runbook: Operational Validation and Demo Confidence

## Goal
Validate the platform quickly before viva, deployment, or interview demo using automated checks.

## Step 1: Start local stack
From project root:

```powershell
./scripts/start_local_demo.ps1
```

## Step 2: Run API smoke flow
In another PowerShell terminal:

```powershell
./scripts/demo_api_flow.ps1
```

Expected outcome:
- Health and readiness checks pass.
- New test user is registered and logged in.
- Mood is analyzed and saved.
- History, recommendation, analytics, and notification endpoints return valid payloads.

## Step 3: Stop stack after demo

```powershell
./scripts/stop_local_demo.ps1
```

## Viva Talking Points
1. Operational reliability: /health and /ready endpoints prove runtime and database readiness.
2. End-to-end confidence: one script validates core user journey from auth to analytics.
3. Security: JWT, RBAC, rate limiting, encrypted user profile fields, and no raw image storage.
4. AI lifecycle: mood logs captured for future model improvement.
