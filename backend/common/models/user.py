from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr


class User(UserBase):
    id: int
    display_name: Optional[str] = None
    hashed_password: str

    class Config:
        from_attributes = True


class UserRead(UserBase):
    id: int
    display_name: str

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    display_name: str


class UserUpdate(UserBase):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    password: Optional[str] = None
