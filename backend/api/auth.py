import jwt
from fastapi import APIRouter, BackgroundTasks, HTTPException, Response

from common.models.auth import (
    LoginRequest,
    LoginResponse,
    PasswordResetConfirm,
    PasswordResetRequest,
    RegisterResponse,
)
from common.models.user import UserCreate, UserRead
from common.utils._jwt import create_access_token, decode_token, password_fingerprint
from common.utils.config import settings
from common.utils.dependency_injection import UserRepo
from common.utils.email import send_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse)
def register(user_in: UserCreate, repository: UserRepo) -> RegisterResponse:
    existing_user = repository.get_user_by_email(str(user_in.email))
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = repository.create_user(user_in)
    token = create_access_token({"sub": user.email})
    return RegisterResponse(
        user=UserRead.model_validate(user), access_token=token, token_type="bearer"
    )


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, repository: UserRepo) -> LoginResponse:
    user = repository.authenticate_user(str(request.email), request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return LoginResponse(access_token=token, token_type="bearer")


@router.post("/reset-password")
def reset_password(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    repository: UserRepo,
) -> Response:
    email = str(request.email)
    token = repository.create_reset_token(email)
    if token is not None:
        background_tasks.add_task(
            send_email,
            email,
            "Password Reset",
            "Click the link to reset your password: "
            f"{settings.base_url}/reset-password?token={token}",
        )
    return Response(
        content="If that email is registered, a reset link has been sent",
        status_code=200,
    )


# verify user's token and reset password
@router.post("/reset-confirm")
def reset_confirm(
    request: PasswordResetConfirm,
    repository: UserRepo,
) -> Response:
    try:
        payload = decode_token(request.token, "reset")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired") from None
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid token") from None

    user = repository.get_user_by_email(payload["sub"])
    if user is None or payload.get("pwd") != password_fingerprint(
        str(user.hashed_password)
    ):
        raise HTTPException(status_code=400, detail="Invalid token")
    repository.update_password(user, request.new_password)
    return Response(content="Password reset successful", status_code=200)
