from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.core.security import get_current_user
from app.core.database import get_db
from app.schemas.user import UserPublic
import os

os.environ["USE_MOCK_DB"] = "1"
client = TestClient(app)

def override_get_current_user():
    return UserPublic(id="60d5ec49f192b1574828f731", email="test@test.com", full_name="Test User", role="student", points=0, streak=0, badges=[])

# Create a mock database
mock_db = MagicMock()
mock_db.game_feedbacks = AsyncMock()
mock_db.users = AsyncMock()

# Mock insert_one for feedback
mock_insert_result = MagicMock()
mock_insert_result.inserted_id = "mock_id_123"
mock_db.game_feedbacks.insert_one.return_value = mock_insert_result

# Mock update_one for users points
mock_db.users.update_one.return_value = MagicMock(modified_count=1)

def override_get_db():
    return mock_db

app.dependency_overrides[get_current_user] = override_get_current_user
app.dependency_overrides[get_db] = override_get_db

def test_submit_game_feedback():
    response = client.post("/api/games/feedback", json={
        "game_id": "breathing",
        "stress_reduction": 4,
        "enjoyment": 5,
        "notes": "Felt good"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "points_awarded" in data
