from fastapi import APIRouter, Depends, HTTPException, status
from typing import cast

from common.models.todo import TodoCreate, TodoUpdate, TodoRead
from common.models.user import UserRead
from common.utils.auth import get_current_user
from common.utils.dependency_injection import (
    get_todo_list_repository,
    get_todo_repository,
)
from db.models.todo import Todo
from repositories.todo import TodoRepository
from repositories.todo_list import TodoListRepository

router = APIRouter(prefix="/todos", tags=["todos"])


def _ensure_list_owned(
    todo_list_id: int | None, user_id: int, list_repository: TodoListRepository
) -> None:
    if todo_list_id is None:
        return
    todo_list = list_repository.get_list_by_id(todo_list_id)
    if todo_list is None or cast(int, todo_list.owner_id) != user_id:
        raise HTTPException(status_code=404, detail="Todo list not found")


@router.get("/", response_model=list[TodoRead])
def get_my_todos(
    todo_list_id: int | None = None,
    user: UserRead = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> list[Todo]:
    return repository.get_todos_by_list(user.id, todo_list_id)


@router.post("/", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_in: TodoCreate,
    user: UserRead = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
    list_repository: TodoListRepository = Depends(get_todo_list_repository),
) -> Todo:
    _ensure_list_owned(todo_in.todo_list_id, user.id, list_repository)
    return repository.create_todo(todo_in, user_id=user.id)


@router.delete("/completed", status_code=status.HTTP_204_NO_CONTENT)
def delete_completed_todos(
    todo_list_id: int | None = None,
    user: UserRead = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> None:
    repository.delete_completed_todos(user.id, todo_list_id)
    return


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo_by_id(
    todo_id: int,
    user: UserRead = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> Todo:
    todo = repository.get_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    if cast(int, todo.owner_id) != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: int,
    updates: TodoUpdate,
    user: UserRead = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
    list_repository: TodoListRepository = Depends(get_todo_list_repository),
) -> Todo:
    todo = repository.get_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    if cast(int, todo.owner_id) != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    _ensure_list_owned(updates.todo_list_id, user.id, list_repository)
    updated_todo = repository.update_todo(todo_id, updates)
    if updated_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    user: UserRead = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> None:
    todo = repository.get_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    if cast(int, todo.owner_id) != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    repository.delete_todo(todo_id)
    return
