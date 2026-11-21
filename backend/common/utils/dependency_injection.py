from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from common.utils._jwt import decode_token
from db.db_session import get_db
from db.models.todo import Todo
from db.models.todo_list import TodoList
from db.models.user import User
from repositories.todo import TodoRepository
from repositories.todo_list import TodoListRepository
from repositories.user import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

DbSession = Annotated[Session, Depends(get_db)]


def get_user_repository(db: DbSession) -> UserRepository:
    return UserRepository(db)


def get_todo_list_repository(db: DbSession) -> TodoListRepository:
    return TodoListRepository(db)


def get_todo_repository(db: DbSession) -> TodoRepository:
    return TodoRepository(db)


UserRepo = Annotated[UserRepository, Depends(get_user_repository)]
TodoListRepo = Annotated[TodoListRepository, Depends(get_todo_list_repository)]
TodoRepo = Annotated[TodoRepository, Depends(get_todo_repository)]


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], repository: UserRepo
) -> User:
    try:
        email: str = decode_token(token, "access")["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired") from None
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token") from None

    user = repository.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_owned_list(
    list_id: int, user: CurrentUser, repository: TodoListRepo
) -> TodoList:
    todo_list = repository.get_list_for_owner(list_id, user.id)
    if todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return todo_list


def get_owned_todo(todo_id: int, user: CurrentUser, repository: TodoRepo) -> Todo:
    todo = repository.get_todo_for_owner(todo_id, user.id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


OwnedList = Annotated[TodoList, Depends(get_owned_list)]
OwnedTodo = Annotated[Todo, Depends(get_owned_todo)]


def ensure_list_owned(
    todo_list_id: int | None, user_id: int, repository: TodoListRepository
) -> None:
    if todo_list_id is None:
        return
    if repository.get_list_for_owner(todo_list_id, user_id) is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
