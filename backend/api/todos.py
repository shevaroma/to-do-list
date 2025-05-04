from fastapi import APIRouter, Depends, HTTPException, status

from common.models.todo import TodoCreate, TodoUpdate, TodoRead
from common.models.user import UserRead
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_todo_repository
from repositories.todo import TodoRepository

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=list[TodoRead])
def get_my_todos(
        user: UserRead = Depends(get_current_user),
        repository: TodoRepository = Depends(get_todo_repository)
):
    return repository.get_todos_by_list(user.id)


@router.post("/", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(
        todo_in: TodoCreate,
        user: UserRead = Depends(get_current_user),
        repository: TodoRepository = Depends(get_todo_repository)
):
    return repository.create_todo(todo_in, user_id=user.id)


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo_by_id(
        todo_id: int,
        user: UserRead = Depends(get_current_user),
        repository: TodoRepository = Depends(get_todo_repository)
):
    todo = repository.get_todo_by_id(todo_id)
    if not todo or todo.todo_list.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
        todo_id: int,
        updates: TodoUpdate,
        user: UserRead = Depends(get_current_user),
        repository: TodoRepository = Depends(get_todo_repository)
):
    todo = repository.get_todo_by_id(todo_id)
    if not todo or todo.todo_list.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return repository.update_todo(todo_id, updates)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
        todo_id: int,
        user: UserRead = Depends(get_current_user),
        repository: TodoRepository = Depends(get_todo_repository)
):
    todo = repository.get_todo_by_id(todo_id)
    if not todo or todo.todo_list.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    repository.delete_todo(todo_id)
    return
