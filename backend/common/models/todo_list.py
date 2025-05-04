from pydantic import BaseModel
from typing import Optional


class TodoListCreate(BaseModel):
    title: str


class TodoListUpdate(BaseModel):
    title: Optional[str] = None


class TodoListRead(BaseModel):
    id: int
    title: str
    owner_id: int

    class Config:
        from_attributes = True
