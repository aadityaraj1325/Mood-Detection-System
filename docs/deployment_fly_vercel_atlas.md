# Deploy to Fly.io + Vercel + MongoDB Atlas

This checklist is the lowest-friction production-style setup for this repo:

- `frontend` on Vercel for static React hosting
- `backend` on Fly.io for the FastAPI app and WebSockets
- MongoDB Atlas free tier for persistent storage

It matches the current project structure, which already has a backend Dockerfile and environment-based configuration.

## 1. Create the Atlas database

1. Create a free MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Add your IP address to the Atlas network access list.
4. Copy the connection string.
5. Choose a database name, such as `mood_detection_system`.

Example Atlas URI:

```text
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mood_detection_system?retryWrites=true&w=majority
```

## 2. Prepare backend secrets

Set these values in Fly.io secrets, not in Git:

- `APP_NAME=Mood Detection API`
- `API_PREFIX=/api`
- `SECRET_KEY` to a long random string
- `ENCRYPTION_KEY` to a valid Fernet key
- `ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=1440`
- `MONGODB_URI` to your Atlas URI
- `MONGODB_DB_NAME=mood_detection_system`
- `USE_MOCK_DB=false`
- `CORS_ORIGINS` to your Vercel URL and any local dev URLs you still use
- `RATE_LIMIT_AUTH=5/minute`
- `RATE_LIMIT_API=60/minute`

Backend env example for production:

```bash
APP_NAME=Mood Detection API
API_PREFIX=/api
SECRET_KEY=replace-with-a-strong-secret
ENCRYPTION_KEY=replace-with-a-valid-fernet-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mood_detection_system?retryWrites=true&w=majority
MONGODB_DB_NAME=mood_detection_system
USE_MOCK_DB=false
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
RATE_LIMIT_AUTH=5/minute
RATE_LIMIT_API=60/minute
```

## 3. Prepare frontend secrets

Set these values in Vercel project settings:

- `VITE_API_BASE_URL=https://<your-fly-app>.fly.dev/api`
- `VITE_WS_BASE_URL=wss://<your-fly-app>.fly.dev/api/ws/mood`

Frontend env example for production:

```bash
VITE_API_BASE_URL=https://your-backend.fly.dev/api
VITE_WS_BASE_URL=wss://your-backend.fly.dev/api/ws/mood
```

## 4. Deploy the backend to Fly.io

1. Install the Fly CLI.
2. Log in to Fly.
3. Create the app from the repository root so Fly can use `backend/Dockerfile`.
4. Set the backend secrets.
5. Deploy.

Recommended commands from the repository root:

```bash
flyctl auth login
flyctl launch --name pulsemind-backend --dockerfile backend/Dockerfile --no-deploy
flyctl secrets set \
  SECRET_KEY="replace-with-a-strong-secret" \
  ENCRYPTION_KEY="replace-with-a-valid-fernet-key" \
  MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mood_detection_system?retryWrites=true&w=majority" \
  MONGODB_DB_NAME="mood_detection_system" \
  USE_MOCK_DB="false" \
  CORS_ORIGINS='["https://your-vercel-app.vercel.app"]'
flyctl deploy
```

If you want a `fly.toml` in the repo, use these key settings:

```toml
app = "pulsemind-backend"

[build]
  dockerfile = "backend/Dockerfile"

[[services]]
  internal_port = 8000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

## 5. Deploy the frontend to Vercel

1. Import the GitHub repository into Vercel.
2. Set the project root to `frontend`.
3. Use the default Vite build command.
4. Add the frontend environment variables.
5. Deploy to production.

Vercel build settings:

- Framework preset: Vite
- Build command: `npm ci && npm run build`
- Output directory: `dist`

## 6. Verify the deployment

1. Open the backend health endpoint:
   - `https://<your-fly-app>.fly.dev/health`
2. Open backend docs:
   - `https://<your-fly-app>.fly.dev/docs`
3. Open the Vercel site and confirm the frontend can log in and call the API.
4. Check that WebSocket updates still connect with `wss://`.

## 7. Free-tier caveats

- Atlas free tier has limits on storage and throughput.
- Fly.io free allocations can sleep or be limited depending on current plan rules.
- Vercel free hosting is excellent for static UI, but backend API traffic still comes from Fly.io.
- The AI stack depends on `tensorflow-cpu` and `opencv-python-headless`, so keep the backend size small and use mock mode only for demos if you hit memory limits.

## 8. Recommended fallback for demos

If the AI workload is too heavy for the free backend plan, switch to this demo mode:

- `USE_MOCK_DB=true`
- keep the backend deployed on Fly.io
- keep the frontend on Vercel
- use Atlas only if you need persistent data between sessions

This is the fastest route to a working public demo without running Docker on a VPS.

## 9. GitHub Actions snippets

### Backend deploy to Fly.io

Use this workflow to deploy whenever `main` changes.

```yaml
name: Deploy Backend to Fly.io

on:
  push:
    branches: [main, master]
    paths:
      - 'backend/**'
      - 'ai_module/**'
      - 'fly.toml'
      - '.github/workflows/deploy-backend-fly.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup flyctl
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy to Fly.io
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        run: flyctl deploy --remote-only --dockerfile backend/Dockerfile
```

### Frontend deploy to Vercel

Use the Vercel GitHub integration if you want the simplest path. If you prefer Actions, this snippet works as a starting point.

```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [main, master]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend-vercel.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### CI + deploy separation

Keep your current CI workflow for tests and add deploy workflows separately. That gives you:

- faster feedback on pull requests
- safer production deploys from `main`
- clean rollback by redeploying a previous commit
