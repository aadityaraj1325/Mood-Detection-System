from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel
from typing import List

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.security import get_current_user
from app.schemas.user import UserPublic

router = APIRouter(prefix="/community", tags=["Community"])

class PostCreate(BaseModel):
    topic: str
    content: str

class PostResponse(BaseModel):
    id: str
    topic: str
    content: str
    author_alias: str
    created_at: datetime
    flagged: bool

CRISIS_KEYWORDS = ["suicide", "kill myself", "end it all", "hopeless", "hurt myself", "worthless"]

def check_crisis_keywords(content: str) -> bool:
    content_lower = content.lower()
    return any(keyword in content_lower for keyword in CRISIS_KEYWORDS)

@router.post("/posts")
@limiter.limit(settings.rate_limit_api)
async def create_post(
    request: Request,
    post: PostCreate,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    # Check for crisis keywords (Phase 15.3 AI Filter)
    is_crisis = check_crisis_keywords(post.content)

    entry = {
        "author_id": ObjectId(user.id),
        "author_alias": f"User_{str(user.id)[-4:]}", # Safe anonymous author mapping (Phase 15.2)
        "topic": post.topic,
        "content": post.content,
        "created_at": datetime.now(timezone.utc),
        "flagged": is_crisis, # Auto-flag if crisis detected
        "crisis_alert": is_crisis
    }
    
    result = await db.community_posts.insert_one(entry)
    
    # If crisis, theoretically we would trigger an email or alert to counselor here
    if is_crisis:
        pass # Alerting logic handled via 'flagged' state

    return {"post_id": str(result.inserted_id), "status": "success", "crisis_detected": is_crisis}

@router.get("/posts")
@limiter.limit(settings.rate_limit_api)
async def get_posts(
    request: Request,
    topic: str = None,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    query = {}
    if topic:
        query["topic"] = topic
        
    records = await db.community_posts.find(query).sort("created_at", -1).to_list(length=100)
    return [
        {
            "id": str(record["_id"]),
            "topic": record["topic"],
            "content": record["content"],
            "author_alias": record["author_alias"],
            "created_at": record["created_at"].isoformat(),
            "flagged": record.get("flagged", False)
        }
        for record in records
    ]

@router.post("/posts/{post_id}/flag")
@limiter.limit(settings.rate_limit_api)
async def flag_post(
    request: Request,
    post_id: str,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    result = await db.community_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"flagged": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
        
    return {"status": "flagged"}

@router.delete("/posts/{post_id}")
@limiter.limit(settings.rate_limit_api)
async def delete_post(
    request: Request,
    post_id: str,
    user: UserPublic = Depends(get_current_user),
    db = Depends(get_db)
):
    # Require counsellor or admin role
    if user.role not in ["counsellor", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete posts")
        
    result = await db.community_posts.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
        
    return {"status": "deleted"}
