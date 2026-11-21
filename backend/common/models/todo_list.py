from typing import Optional

from pydantic import BaseModel, ConfigDict

from common.models.fields import NonEmptyStr


class TodoListCreate(BaseModel):
    title: NonEmptyStr


class TodoListUpdate(BaseModel):
    title: Optional[NonEmptyStr] = None


class TodoListRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    owner_id: int
