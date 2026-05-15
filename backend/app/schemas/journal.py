from datetime import datetime
from pydantic import BaseModel

class JournalCreate(BaseModel):
    content: str

class JournalResponse(BaseModel):
    id: str
    user_id: str
    content: str
    created_at: datetime
