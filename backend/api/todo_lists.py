from fastapi import APIRouter, Depends, HTTPException, status
from typing import cast

from common.models.todo_list import TodoListRead, TodoListCreate, TodoListUpdate
from common.models.user import UserRead
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_todo_list_repository
from db.models.todo_list import TodoList
from repositories.todo_list import TodoListRepository

router = APIRouter(prefix="/todo-lists", tags=["todo-lists"])


@router.get("/", response_model=list[TodoListRead])
def get_my_todo_lists(
    user: UserRead = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> list[TodoList]:
    return repository.get_all_lists_for_user(user.id)


@router.post("/", response_model=TodoListRead, status_code=status.HTTP_201_CREATED)
def create_todo_list(
    todo_list: TodoListCreate,
    user: UserRead = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> TodoList:
    return repository.create_list(todo_list, user.id)


@router.get("/{list_id}", response_model=TodoListRead)
def get_todo_list_by_id(
    list_id: int,
    user: UserRead = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> TodoList:
    todo_list = repository.get_list_by_id(list_id)
    if todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    if cast(int, todo_list.owner_id) != user.id:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return todo_list


@router.put("/{list_id}", response_model=TodoListRead)
def update_todo_list(
    list_id: int,
    updates: TodoListUpdate,
    user: UserRead = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> TodoList:
    todo_list = repository.get_list_by_id(list_id)
    if todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    if cast(int, todo_list.owner_id) != user.id:
        raise HTTPException(status_code=404, detail="Todo list not found")
    updated_list = repository.update_list(list_id, updates)
    if updated_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return updated_list


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo_list(
    list_id: int,
    user: UserRead = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> None:
    todo_list = repository.get_list_by_id(list_id)
    if todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    if cast(int, todo_list.owner_id) != user.id:
        raise HTTPException(status_code=404, detail="Todo list not found")
    repository.delete_list(list_id)
    return
