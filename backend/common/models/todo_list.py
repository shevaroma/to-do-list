from typing import Optional

from pydantic import BaseModel


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
