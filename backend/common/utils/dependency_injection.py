from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from common.utils.auth import get_current_user
from db.db_session import get_db
from db.models.todo import Todo
from db.models.todo_list import TodoList
from db.models.user import User
from repositories.todo import TodoRepository
from repositories.todo_list import TodoListRepository
from repositories.user import UserRepository


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


def get_todo_list_repository(db: Session = Depends(get_db)) -> TodoListRepository:
    return TodoListRepository(db)


def get_todo_repository(db: Session = Depends(get_db)) -> TodoRepository:
    return TodoRepository(db)


def get_owned_list(
    list_id: int,
    user: User = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> TodoList:
    todo_list = repository.get_list_for_owner(list_id, user.id)
    if todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return todo_list


def get_owned_todo(
    todo_id: int,
    user: User = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> Todo:
    todo = repository.get_todo_for_owner(todo_id, user.id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


def ensure_list_owned(
    todo_list_id: int | None, user_id: int, repository: TodoListRepository
) -> None:
    if todo_list_id is None:
        return
    if repository.get_list_for_owner(todo_list_id, user_id) is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
