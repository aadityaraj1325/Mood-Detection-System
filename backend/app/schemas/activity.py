from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityCreate(BaseModel):
    name: str
    category: str

class ActivityResponse(BaseModel):
    id: str
    name: str
    category: str
    created_at: datetime
