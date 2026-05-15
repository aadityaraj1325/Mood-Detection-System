# 🚀 PulseMind AI: Comprehensive Setup Guide

This guide provides step-by-step instructions for running the PulseMind AI platform. Depending on your storage availability and preference, choose one of the three methods below.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js 20+** (for Frontend)
- **Python 3.11 (64-bit)** (for Backend - *Mandatory for AI module*)
- **Docker Desktop** (if using Method 2 or 3)
- **Git** (for version control)

---

## ⚡ Method 1: Local Development (Lean & Clean)
**Recommended for:** Low storage users, speed, and easy disposal. This method avoids the 40GB Docker storage bloat.

### 1. Backend Setup
1. Open a terminal in the `backend` directory.
2. Create a virtual environment:
   ```powershell
   python -m venv .venv
   ```
3. Activate the environment:
   ```powershell
   .\.venv\Scripts\activate
   ```
4. Install dependencies (ensure you are using 64-bit Python):
   ```powershell
   pip install -r requirements.txt
   ```
5. Create `.env` file:
   ```powershell
   copy .env.example .env
   ```
6. Start the backend with Mock DB (if no MongoDB installed):
   ```powershell
   $env:USE_MOCK_DB="1"; uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Open a new terminal in the `frontend` directory.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create `.env` file:
   ```powershell
   copy .env.example .env
   ```
4. Start the Vite dev server:
   ```powershell
   npm run dev
   ```

---

## 🐳 Method 2: Docker Compose (Full Stack)
**Recommended for:** Production-like environment testing.

1. Ensure Docker Desktop is running.
2. Open a terminal in the project root directory.
3. Run the following command:
   ```powershell
   docker compose up --build
   ```
4. **Access the app:**
   - Frontend: `http://localhost:5173`
   - Backend Docs: `http://localhost:8000/docs`

---

## 🪄 Method 3: Automated Demo Scripts
**Recommended for:** Quick testing and demonstration.

### 1. Startup
From the project root in PowerShell:
```powershell
./scripts/start_local_demo.ps1
```
*This script automatically starts MongoDB via Docker and launches both frontend and backend in separate terminals.*

### 2. Stop & Cleanup
```powershell
./scripts/stop_local_demo.ps1
```

---

## 🛠️ Specialized Configurations

### Running without a Database (Mock Mode)
If you don't want to install MongoDB or run it in Docker, you can use the **Mock Database**.
1. Open `backend/.env`.
2. Set `USE_MOCK_DB=true`.
3. Restart the backend.
*Note: Data will be lost when the backend restarts.*

### Troubleshooting: Python Version
The AI module requires **64-bit Python 3.11**. If you see errors related to `numpy` or `tensorflow`, check your version:
```powershell
python -c "import platform; print(platform.architecture())"
```
If it says `32bit`, uninstall it and download the **64-bit** installer from Python.org.

---

## 🧹 Storage Reclamation (Cleaning Up)

If you need to reclaim disk space, perform these steps in order:

### 1. Cleanup Docker (Crucial)
Docker containers and images can take up 40GB+. Run these in order:
```powershell
# Remove all unused Docker data
docker system prune -a --volumes
```

### 2. Cleanup Local Environments
Delete these folders manually or via terminal:
- `backend/.venv/` (Approx 1GB)
- `frontend/node_modules/` (Approx 500MB)
- `frontend/dist/` (If built)

### 3. Cleanup AI Logs
The AI module generates CSV logs. You can safely delete:
- `ai_module/emotion_logs.csv`

---

## 📊 Summary of URLs
| Service | URL |
| :--- | :--- |
| **Frontend App** | [http://localhost:5173](http://localhost:5173) |
| **Backend API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) |

---
*Developed for PulseMind AI Mental Health Support Platform.*
