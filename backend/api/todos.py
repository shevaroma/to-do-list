from fastapi import APIRouter, Depends, status

from common.models.todo import TodoCreate, TodoUpdate, TodoRead
from common.utils.auth import get_current_user
from common.utils.dependency_injection import (
    ensure_list_owned,
    get_owned_todo,
    get_todo_list_repository,
    get_todo_repository,
)
from db.models.todo import Todo
from db.models.user import User
from repositories.todo import TodoRepository
from repositories.todo_list import TodoListRepository

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=list[TodoRead])
def get_my_todos(
    todo_list_id: int | None = None,
    user: User = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> list[Todo]:
    return repository.get_todos_by_list(user.id, todo_list_id)


@router.post("/", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_in: TodoCreate,
    user: User = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
    list_repository: TodoListRepository = Depends(get_todo_list_repository),
) -> Todo:
    ensure_list_owned(todo_in.todo_list_id, user.id, list_repository)
    return repository.create_todo(todo_in, user_id=user.id)


@router.delete("/completed", status_code=status.HTTP_204_NO_CONTENT)
def delete_completed_todos(
    todo_list_id: int | None = None,
    user: User = Depends(get_current_user),
    repository: TodoRepository = Depends(get_todo_repository),
) -> None:
    repository.delete_completed_todos(user.id, todo_list_id)


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo_by_id(todo: Todo = Depends(get_owned_todo)) -> Todo:
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
    updates: TodoUpdate,
    todo: Todo = Depends(get_owned_todo),
    repository: TodoRepository = Depends(get_todo_repository),
    list_repository: TodoListRepository = Depends(get_todo_list_repository),
) -> Todo:
    ensure_list_owned(updates.todo_list_id, todo.owner_id, list_repository)
    return repository.update_todo(todo, updates)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo: Todo = Depends(get_owned_todo),
    repository: TodoRepository = Depends(get_todo_repository),
) -> None:
    repository.delete_todo(todo)
