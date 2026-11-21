from pydantic import BaseModel, EmailStr

from common.models.fields import Password
from common.models.user import UserRead


class RegisterResponse(BaseModel):
    user: UserRead
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: Password
