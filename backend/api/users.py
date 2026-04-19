from fastapi import APIRouter, Depends, HTTPException, Response

from common.models.user import UserRead, UserUpdate, UserUpdateResponse
from common.utils._jwt import create_access_token
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_user_repository
from repositories.user import UserRepository

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def get_me(user: UserRead = Depends(get_current_user)) -> UserRead:
    return user


@router.put("/me", response_model=UserUpdateResponse)
def update_me(
    user_update: UserUpdate,
    user: UserRead = Depends(get_current_user),
    repository: UserRepository = Depends(get_user_repository),
) -> UserUpdateResponse:
    updated_user = repository.update_user(user.id, user_update)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user_read = UserRead.model_validate(updated_user)
    if user_update.email:
        new_token = create_access_token({"sub": updated_user_read.email})
        return UserUpdateResponse(
            user=updated_user_read,
            access_token=new_token,
            token_type="bearer",
        )
    return UserUpdateResponse(
        user=updated_user_read,
        access_token=None,
        token_type="bearer",
    )


@router.delete("/me")
def delete_me(
    user: UserRead = Depends(get_current_user),
    repository: UserRepository = Depends(get_user_repository),
) -> Response:
    repository.delete_user(user.id)
    return Response(status_code=204)
