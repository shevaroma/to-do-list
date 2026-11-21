from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from common.models.fields import NonEmptyStr, Password


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    display_name: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: Password
    display_name: NonEmptyStr


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[NonEmptyStr] = None
    password: Optional[Password] = None
    current_password: Optional[str] = None


class UserUpdateResponse(BaseModel):
    user: UserRead
    access_token: Optional[str] = None
    token_type: str
