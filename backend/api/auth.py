import jwt
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Response

from common.models.auth import LoginResponse, ChangePasswordRequest, RegisterResponse
from common.models.auth import PasswordResetRequest, LoginRequest, PasswordResetConfirm
from common.models.user import UserCreate
from common.utils._jwt import create_access_token, SECRET_KEY, ALGORITHM
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_user_repository
from db.models.user import User
from repositories.user import UserRepository

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse)
def register(
    user_in: UserCreate, repository: UserRepository = Depends(get_user_repository)
):
    existing_user = repository.get_user_by_email(str(user_in.email))
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = repository.create_user(user_in)
    token = create_access_token({"sub": user.email})
    return RegisterResponse(user=user, access_token=token, token_type="bearer")


@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest, repository: UserRepository = Depends(get_user_repository)
):
    user = repository.authenticate_user(str(request.email), request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return LoginResponse(access_token=token, token_type="bearer")


@router.post("/reset-password")
def reset_password(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    repository: UserRepository = Depends(get_user_repository),
):
    repository.reset_password(str(request.email), background_tasks)
    return Response(content="Password reset link sent", status_code=200)


# verify user's token and reset password
@router.post("/reset-confirm")
def reset_confirm(
    request: PasswordResetConfirm,
    repository: UserRepository = Depends(get_user_repository),
):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    repository.update_password(email, None, request.new_password)
    return Response(content="Password reset successful", status_code=200)


# change password for logged-in user
@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    repository: UserRepository = Depends(get_user_repository),
):
    if not repository.verify_password(request.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.hashed_password = repository.hash_password(request.new_password)
    return Response(content="Password updated successfully", status_code=200)


@router.get("/logout")
def logout():
    # client-side logout in frontend
    return Response(content="Logout successful", status_code=200)
