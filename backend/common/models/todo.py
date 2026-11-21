from typing import Optional

from pydantic import BaseModel, ConfigDict

from common.models.fields import NonEmptyStr, Priority, UtcDatetimeIn, UtcDatetimeOut


class TodoBase(BaseModel):
    title: NonEmptyStr
    description: Optional[str] = None
    due_date: Optional[UtcDatetimeIn] = None
    priority: Optional[Priority] = 3
    todo_list_id: Optional[int] = None


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[NonEmptyStr] = None
    description: Optional[str] = None
    due_date: Optional[UtcDatetimeIn] = None
    priority: Optional[Priority] = None
    is_completed: Optional[bool] = None
    todo_list_id: Optional[int] = None


class TodoRead(TodoBase):
    model_config = ConfigDict(from_attributes=True)

    title: str
    due_date: Optional[UtcDatetimeOut] = None
    priority: Optional[int] = None
    id: int
    is_completed: bool
    owner_id: int
    created_at: UtcDatetimeOut
    updated_at: UtcDatetimeOut
