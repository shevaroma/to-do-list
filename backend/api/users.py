from fastapi import APIRouter, HTTPException, Response

from common.models.user import UserRead, UserUpdate, UserUpdateResponse
from common.utils._jwt import create_access_token
from common.utils.dependency_injection import CurrentUser, UserRepo

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def get_me(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)


@router.put("/me", response_model=UserUpdateResponse)
def update_me(
    user_update: UserUpdate,
    user: CurrentUser,
    repository: UserRepo,
) -> UserUpdateResponse:
    if user_update.email and user_update.email != user.email:
        if repository.get_user_by_email(str(user_update.email)):
            raise HTTPException(status_code=400, detail="Email already registered")
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
    user: CurrentUser,
    repository: UserRepo,
) -> Response:
    repository.delete_user(user.id)
    return Response(status_code=204)
