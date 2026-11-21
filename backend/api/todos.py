from fastapi import APIRouter, status

from common.models.todo import TodoCreate, TodoRead, TodoUpdate
from common.utils.dependency_injection import (
    CurrentUser,
    OwnedTodo,
    TodoListRepo,
    TodoRepo,
    ensure_list_owned,
)
from db.models.todo import Todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=list[TodoRead])
def get_my_todos(
    user: CurrentUser, repository: TodoRepo, todo_list_id: int | None = None
) -> list[Todo]:
    return repository.get_todos_by_list(user.id, todo_list_id)


@router.post("/", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_in: TodoCreate,
    user: CurrentUser,
    repository: TodoRepo,
    list_repository: TodoListRepo,
) -> Todo:
    ensure_list_owned(todo_in.todo_list_id, user.id, list_repository)
    return repository.create_todo(todo_in, user_id=user.id)


@router.delete("/completed", status_code=status.HTTP_204_NO_CONTENT)
def delete_completed_todos(
    user: CurrentUser, repository: TodoRepo, todo_list_id: int | None = None
) -> None:
    repository.delete_completed_todos(user.id, todo_list_id)


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo_by_id(todo: OwnedTodo) -> Todo:
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
    updates: TodoUpdate,
    todo: OwnedTodo,
    repository: TodoRepo,
    list_repository: TodoListRepo,
) -> Todo:
    ensure_list_owned(updates.todo_list_id, todo.owner_id, list_repository)
    return repository.update_todo(todo, updates)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo: OwnedTodo, repository: TodoRepo) -> None:
    repository.delete_todo(todo)
