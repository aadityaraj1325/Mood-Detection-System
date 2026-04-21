# PulseMind AI — Technical Specification
**Version:** 2.0  
**Team:** Team Vijayas — Lovely Professional University  
**Date:** April 21, 2026  
**Status:** Production-Ready Technical Reference

---

## 1. Technology Stack

### 1.1 Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.x | SPA component model |
| **Build Tool** | Vite | 5.x | Fast HMR, optimized builds |
| **Styling** | Tailwind CSS | 3.x | Utility-first styling |
| **State Management** | Zustand | 4.x | Lightweight global state |
| **HTTP Client** | Axios | 1.x | API calls with interceptors |
| **Charts** | Recharts | 2.x | Mood/analytics visualization |
| **Animation** | Framer Motion | 11.x | Page transitions, micro-interactions |
| **3D Graphics** | Three.js | r160+ | Neural network hero, 3D elements |
| **Face Detection (Client)** | TensorFlow.js + BlazeFace | 3.x | In-browser face localization |
| **Backend Framework** | FastAPI | 0.110.x | Async Python REST API |
| **ASGI Server** | Uvicorn | 0.29.x | FastAPI runtime |
| **Database** | MongoDB | 7.0 | Document store |
| **ODM** | Motor | 3.x | Async MongoDB driver for Python |
| **Auth** | python-jose | 3.3.x | JWT signing/validation |
| **Password Hashing** | passlib[bcrypt] | 1.7.x | Bcrypt password storage |
| **Encryption** | cryptography (Fernet) | 42.x | Symmetric field encryption |
| **Rate Limiting** | SlowAPI | 0.1.x | FastAPI rate limiter |
| **AI/ML** | FER | 22.x | Facial emotion recognition |
| **Computer Vision** | OpenCV (opencv-python) | 4.x | Frame preprocessing |
| **Numeric/ML Baseline** | scikit-learn, numpy | latest | Recommendation engine |
| **Containerization** | Docker + Docker Compose | 25.x | Local dev orchestration |
| **CI/CD** | GitHub Actions | — | Automated test + smoke |
| **Testing** | pytest, pytest-asyncio | latest | Backend test suite |

---

## 2. Repository Structure

```
pulsemind-ai/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI pipeline
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app factory + lifecycle
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py           # /api/auth/* endpoints
│   │   │       ├── mood.py           # /api/analyze-mood, /api/save-mood etc
│   │   │       ├── recommendation.py # /api/recommend
│   │   │       ├── analytics.py      # /api/analytics/*
│   │   │       ├── notifications.py  # /api/notifications/*
│   │   │       └── websocket.py      # /api/ws/mood/{user_id}
│   │   ├── core/
│   │   │   ├── config.py             # Settings from env vars (pydantic-settings)
│   │   │   ├── database.py           # Motor async MongoDB connection
│   │   │   ├── security.py           # JWT creation/validation, role deps
│   │   │   ├── crypto.py             # Fernet encrypt/decrypt helpers
│   │   │   └── rate_limiter.py       # SlowAPI limiter instance
│   │   ├── schemas/
│   │   │   ├── user.py               # UserCreate, UserOut, UserInDB
│   │   │   ├── mood.py               # MoodAnalyzeRequest, MoodSaveRequest, MoodEntry
│   │   │   ├── recommendation.py     # RecommendationResponse
│   │   │   └── analytics.py          # SummaryResponse, AdminMetrics
│   │   └── services/
│   │       ├── ai_service.py         # Calls ai_module, formats response
│   │       ├── emotion_utils.py      # Emotion grouping, score normalization
│   │       ├── recommendation_service.py  # Logistic regression + rule engine
│   │       ├── analytics_service.py  # Aggregation queries + stress scoring
│   │       ├── gamification_service.py    # Points/badge evaluation
│   │       └── websocket_manager.py  # Per-user connection registry
│   ├── tests/
│   │   ├── conftest.py               # pytest fixtures, test client setup
│   │   ├── test_auth.py
│   │   ├── test_mood.py
│   │   ├── test_analytics.py
│   │   └── test_recommendations.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── ai_module/
│   ├── detector.py                   # Main emotion detection pipeline
│   ├── trend_predictor.py            # Linear mood trend projection
│   └── emotion_logs.csv              # Timestamped detection log
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── App.jsx                   # Router + route definitions
│   │   ├── main.jsx                  # React DOM render, global providers
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx    # JWT gate component
│   │   │   ├── ErrorBoundary.jsx     # Error fallback
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── BottomNav.jsx         # Mobile bottom nav
│   │   │   ├── ToastNotification.jsx # Toast system
│   │   │   ├── GlassCard.jsx         # Base card container
│   │   │   ├── MetricCard.jsx        # KPI metric card
│   │   │   ├── MoodOrb.jsx           # Animated emotion orb
│   │   │   ├── NeuralParticles.jsx   # Background particle system
│   │   │   ├── SkeletonLoader.jsx    # Loading skeleton
│   │   │   └── BadgeModal.jsx        # Badge unlock celebration
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT storage, user state, login/logout
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx          # Login/Register split layout
│   │   │   ├── DashboardPage.jsx     # Main dashboard
│   │   │   ├── MoodDetectionPage.jsx # Camera + FER + save flow
│   │   │   ├── HistoryAnalyticsPage.jsx  # Charts + table
│   │   │   ├── RecommendationsPage.jsx   # Recommendations + journaling
│   │   │   └── AchievementsPage.jsx  # Badges + points + streak
│   │   ├── services/
│   │   │   ├── api.js                # Axios base instance + interceptors
│   │   │   ├── authService.js        # register(), login(), getMe()
│   │   │   ├── moodService.js        # analyzeMood(), saveMood(), getHistory()
│   │   │   ├── recommendService.js   # getRecommendations()
│   │   │   ├── analyticsService.js   # getSummary(), getAdminMetrics()
│   │   │   └── socketService.js      # WebSocket connection helper
│   │   ├── store/
│   │   │   └── uiStore.js            # Zustand: sidebar, theme, notifications, range
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth context consumer hook
│   │   │   ├── useMoodHistory.js     # Data fetching + caching hook
│   │   │   └── useWebSocket.js       # WebSocket event listener hook
│   │   ├── utils/
│   │   │   ├── emotionColors.js      # Emotion → CSS color mappings
│   │   │   ├── dateHelpers.js        # Chart date formatting
│   │   │   └── validators.js         # Form validation helpers
│   │   ├── index.css                 # Global CSS, design token variables
│   │   └── tailwind.config.js        # Tailwind theme extension
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
│
├── scripts/
│   ├── start_local_demo.ps1          # Launch stack (Windows PowerShell)
│   ├── stop_local_demo.ps1           # Teardown stack
│   ├── demo_api_flow.ps1             # End-to-end API validation
│   ├── presentation_prep.ps1         # Health + smoke for live demos
│   └── ci_api_smoke.py               # Python smoke test for CI
│
├── docker-compose.yml
├── .env.example
├── README.md
├── prd.md                            # Product Requirements Document
├── design.md                         # Design Specification
└── tech.md                           # This document
```

---

## 3. Backend Technical Detail

### 3.1 FastAPI App Structure

```python
# backend/app/main.py (pattern)
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.database import connect_db, close_db
from app.core.rate_limiter import limiter, rate_limit_exceeded_handler
from app.api.routes import auth, mood, recommendation, analytics, notifications, websocket

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(title="PulseMind AI API", version="2.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, ...)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(mood.router, prefix="/api", tags=["mood"])
app.include_router(recommendation.router, prefix="/api", tags=["recommendations"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(websocket.router, prefix="/api/ws", tags=["websocket"])
```

### 3.2 Configuration (Pydantic Settings)

```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "pulsemind"
    SECRET_KEY: str  # REQUIRED — no default
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ENCRYPTION_KEY: str  # REQUIRED — Fernet key
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    RATE_LIMIT_DEFAULT: str = "100/minute"

    class Config:
        env_file = ".env"

settings = Settings()
```

### 3.3 JWT Security Pattern

```python
# backend/app/core/security.py
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def create_access_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role", "student")
        if user_id is None:
            raise credentials_exception
        return {"user_id": user_id, "role": role}
    except JWTError:
        raise credentials_exception

def require_role(required_role: str):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

require_admin = require_role("admin")
```

### 3.4 Emotion Detection Pipeline

```python
# ai_module/detector.py — logical flow

def analyze_emotion(image_bytes: bytes) -> dict:
    """
    Pipeline:
    1. Decode image bytes → numpy array
    2. OpenCV: Convert to grayscale
    3. OpenCV: Haar cascade face detection
    4. If face found:
       a. FER model inference on face ROI
       b. Group to Happy/Neutral/Sad
       c. Return emotion + confidence + raw scores
    5. If FER unavailable:
       a. Heuristic: brightness/contrast analysis
       b. Flag method as 'heuristic'
    6. Log to emotion_logs.csv (timestamp, emotion, confidence)
    """

    # Preprocessing
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    
    if len(faces) == 0:
        return {"error": "no_face_detected", "emotion": None, "confidence": 0.0}
    
    # FER inference
    try:
        from fer import FER
        detector = FER(mtcnn=False)
        emotions = detector.detect_emotions(img)
        raw = emotions[0]["emotions"]  # {"happy": 0.8, "sad": 0.05, "neutral": 0.15, ...}
        
        # Grouping: FER's 7 → 3
        grouped = {
            "Happy": raw.get("happy", 0),
            "Neutral": raw.get("neutral", 0) + raw.get("surprise", 0) * 0.5,
            "Sad": raw.get("sad", 0) + raw.get("angry", 0) * 0.5 + raw.get("fear", 0) * 0.3,
        }
        emotion = max(grouped, key=grouped.get)
        confidence = grouped[emotion]
        method = "FER"
    
    except ImportError:
        # Heuristic fallback
        emotion, confidence, method = heuristic_emotion(gray, faces[0])
    
    # Logging
    log_to_csv(emotion, confidence)
    
    return {
        "emotion": emotion,
        "confidence": round(confidence, 4),
        "raw_scores": grouped,
        "method": method
    }
```

### 3.5 Recommendation Engine

```python
# backend/app/services/recommendation_service.py

from sklearn.linear_model import LogisticRegression
import numpy as np

# Synthetic training data seed
# Features: [avg_mood_score, avg_confidence, streak_days, stress_score]
# Labels: 0=Mindfulness, 1=Cognitive, 2=Resilience, 3=Social

SEED_X = np.array([
    [20, 0.6, 1, 85],  # Low mood → Mindfulness
    [80, 0.9, 7, 20],  # High mood → Cognitive
    [50, 0.75, 3, 50], # Mid mood → Resilience
    ...
])
SEED_Y = np.array([0, 1, 2, ...])

model = LogisticRegression(max_iter=200)
model.fit(SEED_X, SEED_Y)

RECOMMENDATION_CATALOG = {
    0: [  # Mindfulness
        {"title": "Box Breathing", "description": "4-4-4-4 breathing pattern for instant calm.", "category": "CBT", "duration_min": 5},
        {"title": "Body Scan Meditation", "description": "Progressive muscle relaxation from head to toe.", "category": "ACT", "duration_min": 10},
    ],
    1: [  # Cognitive
        {"title": "Memory Garden", "description": "A gentle memory match game that sharpens focus.", "category": "CBT", "duration_min": 8},
    ],
    2: [  # Resilience
        {"title": "Gratitude Journal", "description": "Write 3 things you're grateful for today.", "category": "Resilience", "duration_min": 5},
    ],
    3: [  # Social
        {"title": "Peer Support Forum", "description": "Share and connect with fellow students.", "category": "Community", "duration_min": 0},
    ],
}

async def get_recommendations(user_id: str, db) -> list:
    history = await db.moods.find({"user_id": user_id}).sort("timestamp", -1).limit(10).to_list(10)
    
    if not history:
        return RECOMMENDATION_CATALOG[0]  # Default to mindfulness
    
    avg_score = np.mean([mood_to_score(m["emotion"]) for m in history])
    avg_confidence = np.mean([m["confidence"] for m in history])
    user_doc = await db.users.find_one({"_id": user_id})
    streak = user_doc.get("streak", 1)
    stress = calculate_stress_score(history)
    
    features = np.array([[avg_score, avg_confidence, streak, stress]])
    category_idx = model.predict(features)[0]
    
    return RECOMMENDATION_CATALOG[category_idx]
```

### 3.6 WebSocket Manager

```python
# backend/app/services/websocket_manager.py
from fastapi import WebSocket
from typing import dict

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}  # user_id → socket

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, message: dict):
        if ws := self.active_connections.get(user_id):
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(user_id)

    async def broadcast(self, message: dict):
        for ws in self.active_connections.values():
            await ws.send_json(message)

manager = ConnectionManager()
```

### 3.7 Analytics Aggregation

```python
# backend/app/services/analytics_service.py
async def get_summary(user_id: str, db, range_days: int = 30) -> dict:
    cutoff = datetime.utcnow() - timedelta(days=range_days)
    pipeline = [
        {"$match": {"user_id": user_id, "timestamp": {"$gte": cutoff}}},
        {"$group": {
            "_id": {
                "year": {"$year": "$timestamp"},
                "week": {"$week": "$timestamp"}
            },
            "avg_confidence": {"$avg": "$confidence"},
            "mood_counts": {"$push": "$emotion"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.year": 1, "_id.week": 1}}
    ]
    results = await db.moods.aggregate(pipeline).to_list(None)
    
    stress_score = calculate_stress_score_from_pipeline(results)
    trend = compute_trend_direction(results)
    
    return {
        "weekly_data": results,
        "stress_score": stress_score,
        "trend": trend,
        "total_entries": sum(r["count"] for r in results)
    }

def calculate_stress_score(moods: list) -> int:
    """0–100 stress score. Higher = more stressed."""
    score_map = {"Happy": 10, "Neutral": 40, "Sad": 80}
    scores = [score_map.get(m["emotion"], 50) for m in moods]
    weighted = np.average(scores, weights=[m["confidence"] for m in moods])
    return int(weighted)
```

---

## 4. Frontend Technical Detail

### 4.1 Routing Architecture

```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
// ...

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mood" element={<MoodDetectionPage />} />
          <Route path="/analytics" element={<HistoryAnalyticsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### 4.2 Auth Context

```jsx
// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('pm_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authService.getMe(token)
        .then(setUser)
        .catch(() => { setToken(null); localStorage.removeItem('pm_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const { access_token, user } = await authService.login(email, password)
    localStorage.setItem('pm_token', access_token)
    setToken(access_token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('pm_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 4.3 Axios API Instance

```javascript
// frontend/src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('pm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pm_token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
```

### 4.4 Zustand UI Store

```javascript
// frontend/src/store/uiStore.js
import { create } from 'zustand'

export const useUIStore = create((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // Theme
  theme: 'neural-dark',
  setTheme: (theme) => set({ theme }),

  // Notifications
  toasts: [],
  addToast: (toast) => set(s => ({
    toasts: [...s.toasts, { ...toast, id: Date.now() }]
  })),
  removeToast: (id) => set(s => ({
    toasts: s.toasts.filter(t => t.id !== id)
  })),

  // Analytics range
  analyticsRange: 30,
  setAnalyticsRange: (days) => set({ analyticsRange: days }),

  // Live feed
  liveFeed: [],
  addLiveEvent: (event) => set(s => ({
    liveFeed: [event, ...s.liveFeed].slice(0, 20)  // Keep last 20
  })),
}))
```

### 4.5 WebSocket Hook

```javascript
// frontend/src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react'
import { useUIStore } from '../store/uiStore'
import { useAuth } from '../context/AuthContext'

export function useWebSocket() {
  const ws = useRef(null)
  const { user, token } = useAuth()
  const { addLiveEvent, addToast } = useUIStore()

  useEffect(() => {
    if (!user?.id) return

    const url = `ws://localhost:8000/api/ws/mood/${user.id}?token=${token}`
    ws.current = new WebSocket(url)

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      addLiveEvent(data)

      if (data.type === 'badge_unlocked') {
        addToast({ type: 'success', title: 'Badge Unlocked! 🏆', message: data.badge_name })
      }
      if (data.type === 'mood_saved') {
        addToast({ type: 'info', title: 'Mood Saved ✓', message: `+${data.points_earned} XP` })
      }
    }

    ws.current.onerror = () => console.warn('WebSocket connection failed')

    return () => ws.current?.close()
  }, [user?.id])

  return ws
}
```

### 4.6 Mood Detection — BlazeFace Integration

```jsx
// frontend/src/pages/MoodDetectionPage.jsx (key logic)
import * as blazeface from '@tensorflow-models/blazeface'
import * as tf from '@tensorflow/tfjs'

// Load model once on page mount
const modelRef = useRef(null)
useEffect(() => {
  blazeface.load().then(m => { modelRef.current = m })
}, [])

// Per-frame detection
const detectFaceLocal = async (videoElement) => {
  if (!modelRef.current) return null
  const predictions = await modelRef.current.estimateFaces(videoElement, false)
  return predictions.length > 0 ? predictions[0] : null
}

// Capture + analyze flow
const captureAndAnalyze = async () => {
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.current.videoWidth
  canvas.height = videoRef.current.videoHeight
  canvas.getContext('2d').drawImage(videoRef.current, 0, 0)

  canvas.toBlob(async (blob) => {
    const formData = new FormData()
    formData.append('image', blob, 'capture.jpg')
    
    setAnalyzing(true)
    const result = await moodService.analyzeMood(formData)
    setAnalysisResult(result)
    setAnalyzing(false)
  }, 'image/jpeg', 0.9)
}
```

---

## 5. Database Schema & Indexes

### 5.1 Collections

```javascript
// MongoDB collection structure

// users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// moods collection
db.moods.createIndex({ "user_id": 1, "timestamp": -1 })
db.moods.createIndex({ "timestamp": -1 })
```

### 5.2 Data Retention Policy

- Mood entries older than 365 days: archived to a cold collection.
- Deleted user: cascade delete all mood entries.
- GDPR right-to-erasure: delete endpoint `DELETE /api/user/me` wipes all user data.

---

## 6. Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.9'

services:
  mongo:
    image: mongo:7.0
    container_name: pulsemind_mongo
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: pulsemind
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: pulsemind_backend
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      mongo:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - ./ai_module:/ai_module
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    container_name: pulsemind_frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      VITE_API_URL: http://localhost:8000

volumes:
  mongo_data:
```

---

## 7. Environment Variables

```bash
# .env.example — copy to .env and fill values

# REQUIRED — Generate with: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-secret-key-here-change-this

# REQUIRED — Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
ENCRYPTION_KEY=your-fernet-key-here-change-this

# Database
MONGO_URI=mongodb://mongo:27017
MONGO_DB_NAME=pulsemind

# CORS — comma-separated origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Rate Limiting
RATE_LIMIT_DEFAULT=100/minute
RATE_LIMIT_AUTH=10/minute

# Environment
ENVIRONMENT=development
```

---

## 8. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: PulseMind CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:7.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r backend/requirements.txt
      - name: Run tests
        env:
          SECRET_KEY: test-secret-key-for-ci
          ENCRYPTION_KEY: ${{ secrets.TEST_ENCRYPTION_KEY }}
          MONGO_URI: mongodb://localhost:27017
        run: pytest backend/tests/ -v --tb=short

  api-smoke:
    runs-on: ubuntu-latest
    needs: backend-tests
    services:
      mongo:
        image: mongo:7.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r backend/requirements.txt httpx
      - name: Start backend
        env:
          SECRET_KEY: test-secret-key-for-ci
          ENCRYPTION_KEY: ${{ secrets.TEST_ENCRYPTION_KEY }}
          MONGO_URI: mongodb://localhost:27017
        run: |
          uvicorn app.main:app --host 0.0.0.0 --port 8000 &
          sleep 5
        working-directory: backend
      - name: Run smoke tests
        run: python scripts/ci_api_smoke.py
```

---

## 9. Backend Requirements

```
# backend/requirements.txt

# Framework
fastapi==0.110.0
uvicorn[standard]==0.29.0
python-multipart==0.0.9

# Database
motor==3.3.2
pymongo==4.6.3

# Auth & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
cryptography==42.0.5

# Settings
pydantic-settings==2.2.1

# Rate Limiting
slowapi==0.1.9

# AI/CV
fer==22.5.1
opencv-python-headless==4.9.0.80
numpy==1.26.4
scikit-learn==1.4.1

# Testing
pytest==8.1.1
pytest-asyncio==0.23.6
httpx==0.27.0
```

---

## 10. Frontend Package Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.0",
    "axios": "^1.7.0",
    "zustand": "^4.5.2",
    "recharts": "^2.12.0",
    "framer-motion": "^11.2.0",
    "three": "^0.164.0",
    "@tensorflow/tfjs": "^4.18.0",
    "@tensorflow-models/blazeface": "^0.1.0",
    "lucide-react": "^0.383.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

## 11. Security Checklist

### Pre-Demo / Pre-Submission

- [ ] Replace `SECRET_KEY` in `.env` with cryptographically random value.
- [ ] Replace `ENCRYPTION_KEY` in `.env` with newly generated Fernet key.
- [ ] `.env` file is in `.gitignore` — never committed.
- [ ] MongoDB not exposed on `0.0.0.0` in production.
- [ ] Rate limiting tested on auth endpoints.
- [ ] CORS origins restricted to known frontend URL.
- [ ] All admin routes tested with non-admin JWT (should return 403).
- [ ] Password validation enforces minimum 8 characters on registration.
- [ ] High-stress detection alert path tested end-to-end.

### Security Headers (Production Target)

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

# Add in production
app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["yourdomain.com"])
```

---

## 12. Performance Optimization

### Backend

- MongoDB indexes on all query fields (user_id, timestamp).
- Async all I/O paths (Motor, asyncio — never sync blocking calls in routes).
- Emotion detection: Cache OpenCV cascade classifier in module scope (not per-request).
- FER model: Load once at startup using FastAPI lifespan, store in `app.state`.

### Frontend

- Code splitting: `React.lazy()` + `Suspense` for each page route.
- Image optimization: Webcam captures compressed to JPEG at 90% quality before upload.
- Memo: Heavy chart components wrapped in `React.memo`.
- Three.js: Dispose geometry/material on component unmount to prevent memory leaks.
- BlazeFace: Only run face detection on active mood detection page (not globally).

---

## 13. Testing Strategy

### Unit Tests (Backend)

| File | What's Tested |
|------|---------------|
| `test_auth.py` | Register, login, JWT validation, duplicate email, wrong password |
| `test_mood.py` | Analyze endpoint (mock FER), save mood, history retrieval |
| `test_analytics.py` | Stress score calculation, weekly grouping logic |
| `test_recommendations.py` | Category prediction from mock mood history |

### Integration Tests (CI Smoke)

`scripts/ci_api_smoke.py` runs this flow:
1. POST `/api/auth/register` → expect 201.
2. POST `/api/auth/login` → capture JWT.
3. GET `/api/auth/me` with JWT → expect user object.
4. POST `/api/save-mood` with dummy emotion → expect 200.
5. GET `/api/get-history` → expect list.
6. GET `/api/recommend` → expect recommendation array.
7. GET `/api/analytics/summary` → expect summary object.
8. GET `/health` → expect `{"status": "healthy"}`.

### Manual Test Checklist (Pre-Presentation)

- [ ] Register → Login → Dashboard loads.
- [ ] Webcam activates on Mood Detection page.
- [ ] Face detected → scan animation plays.
- [ ] Analyze → emotion displayed with confidence.
- [ ] Save mood → XP increments in header.
- [ ] WebSocket badge toast fires.
- [ ] Analytics page charts render with data.
- [ ] Recommendations page shows 3+ cards.
- [ ] Logout clears session, redirect to /auth.
- [ ] Non-admin cannot access `/api/analytics/admin/user-metrics`.

---

## 14. Glossary of Technical Terms

| Term | Definition |
|------|------------|
| FER | Facial Expression Recognition Python library — wraps MTCNN + emotion CNN |
| BlazeFace | TensorFlow.js lightweight face detector optimized for mobile/browser |
| Motor | Async Python driver for MongoDB — wraps PyMongo with asyncio |
| Fernet | Symmetric encryption from Python `cryptography` library — AES-128-CBC + HMAC |
| SlowAPI | FastAPI-compatible rate limiting middleware (wraps `limits` library) |
| Uvicorn | ASGI server — runs FastAPI in production/development |
| Zustand | Minimal React state manager — no boilerplate, hook-based |
| Framer Motion | Production-grade React animation library |
| Recharts | Composable chart library built on D3 for React |
| Vite | Build tool — ESM-first, extremely fast HMR for React |
| Pydantic Settings | Env-var driven configuration with type validation (FastAPI ecosystem) |
| OAuth2PasswordBearer | FastAPI's built-in JWT extraction from Authorization header |
| ASGI | Async Server Gateway Interface — Python's async web server standard |
