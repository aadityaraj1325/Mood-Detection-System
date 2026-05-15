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

mock_db = MagicMock()
mock_db.community_posts = AsyncMock()

mock_insert_result = MagicMock()
mock_insert_result.inserted_id = "mock_post_id_123"
mock_db.community_posts.insert_one.return_value = mock_insert_result

mock_cursor = AsyncMock()
mock_cursor.to_list.return_value = []
mock_find_result = MagicMock()
mock_find_result.sort.return_value = mock_cursor
mock_db.community_posts.find = MagicMock(return_value=mock_find_result)

mock_db.community_posts.update_one.return_value = MagicMock(modified_count=1)

def override_get_db():
    return mock_db

app.dependency_overrides[get_current_user] = override_get_current_user
app.dependency_overrides[get_db] = override_get_db

def test_create_post():
    response = client.post("/api/community/posts", json={
        "topic": "Academic Stress",
        "content": "I am feeling overwhelmed with exams."
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_get_posts():
    response = client.get("/api/community/posts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_flag_post():
    response = client.post("/api/community/posts/60d5ec49f192b1574828f731/flag")
    assert response.status_code == 200
    assert response.json()["status"] == "flagged"
