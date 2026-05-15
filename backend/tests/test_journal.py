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

app.dependency_overrides[get_current_user] = override_get_current_user

# Create a mock database
mock_db = MagicMock()
mock_db.journals = AsyncMock()

# Mock insert_one
mock_insert_result = MagicMock()
mock_insert_result.inserted_id = "mock_id_123"
mock_db.journals.insert_one.return_value = mock_insert_result

# Mock find -> sort -> to_list
mock_cursor = AsyncMock()
mock_cursor.to_list.return_value = [{"_id": "mock_id_123", "user_id": "60d5ec49f192b1574828f731", "content": "Test content", "created_at": __import__('datetime').datetime.now()}]
mock_find_result = MagicMock()
mock_find_result.sort.return_value = mock_cursor
mock_db.journals.find = MagicMock(return_value=mock_find_result)

def override_get_db():
    return mock_db

app.dependency_overrides[get_db] = override_get_db

def test_save_journal():
    response = client.post("/api/journal/save", json={"content": "This is a test journal entry."})
    assert response.status_code == 200
    assert "journal_id" in response.json()

def test_get_journal_history():
    response = client.get("/api/journal/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["content"] == "Test content"
