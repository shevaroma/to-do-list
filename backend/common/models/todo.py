from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[int] = 1  # 1–5 scale
    todo_list_id: Optional[int] = None  # none = inbox


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[int] = None
    is_completed: Optional[bool] = None
    todo_list_id: Optional[int] = None


class TodoRead(TodoBase):
    id: int
    is_completed: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
