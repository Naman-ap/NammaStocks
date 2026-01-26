from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ItemRead(ItemCreate):
    id: int

    class Config:
        from_attributes = True
