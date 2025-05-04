from typing import Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


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

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    display_name: str

    @model_validator(mode="after")
    def passwords_match(self) -> "UserCreate":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class UserUpdate(UserBase):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    password: Optional[str] = None
