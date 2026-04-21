from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import analytics, auth, mood, notifications, recommendation, websocket
from app.core.config import settings
from app.core.database import close_mongo_connection, connect_to_mongo, get_db
from app.core.rate_limiter import limiter


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(mood.router, prefix=settings.api_prefix)
app.include_router(recommendation.router, prefix=settings.api_prefix)
app.include_router(analytics.router, prefix=settings.api_prefix)
app.include_router(notifications.router, prefix=settings.api_prefix)
app.include_router(websocket.router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    return {"message": "Mood Detection API is running"}


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}


@app.get("/ready")
async def readiness():
    if settings.use_mock_db:
        return {"status": "ready", "database": "mock"}

    db = get_db()
    await db.command("ping")
    return {"status": "ready", "database": "connected"}
