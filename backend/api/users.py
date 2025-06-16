from fastapi import APIRouter, Depends, Response

from common.models.user import UserRead, UserUpdate, UserUpdateResponse
from common.utils._jwt import create_access_token
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_user_repository
from repositories.user import UserRepository

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def get_me(user: UserRead = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserUpdateResponse)
def update_me(
    user_update: UserUpdate,
    user: UserRead = Depends(get_current_user),
    repository: UserRepository = Depends(get_user_repository),
):
    updated_user = repository.update_user(user.id, user_update)
    if user_update.email:
        new_token = create_access_token({"sub": updated_user.email})
        return {"user": updated_user, "access_token": new_token, "token_type": "bearer"}
    return {"user": updated_user, "access_token": None, "token_type": "bearer"}


@router.delete("/me")
def delete_me(
    user: UserRead = Depends(get_current_user),
    repository: UserRepository = Depends(get_user_repository),
):
    repository.delete_user(user.id)
    return Response(status_code=204)
