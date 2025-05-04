from fastapi import APIRouter, Depends, HTTPException, status

from common.models.todo_list import TodoListRead, TodoListCreate, TodoListUpdate
from common.models.user import UserRead
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_todo_list_repository
from repositories.todo_list import TodoListRepository

router = APIRouter(prefix="/todo-lists", tags=["todo-lists"])


@router.get("/", response_model=list[TodoListRead])
def get_my_todo_lists(user: UserRead = Depends(get_current_user), repository=Depends(get_todo_list_repository)):
    return repository.get_all_lists_for_user(user.id)


@router.post("/", response_model=TodoListRead, status_code=status.HTTP_201_CREATED)
def create_todo_list(
        todo_list: TodoListCreate,
        user: UserRead = Depends(get_current_user),
        repository: TodoListRepository = Depends(get_todo_list_repository),
):
    return repository.create_list(todo_list, user.id)


@router.get("/{list_id}", response_model=TodoListRead)
def get_todo_list_by_id(
        list_id: int,
        user: UserRead = Depends(get_current_user),
        repository: TodoListRepository = Depends(get_todo_list_repository),
):
    todo_list = repository.get_list_by_id(list_id)
    if not todo_list or todo_list.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return todo_list


@router.put("/{list_id}", response_model=TodoListRead)
def update_todo_list(
        list_id: int,
        updates: TodoListUpdate,
        user: UserRead = Depends(get_current_user),
        repository: TodoListRepository = Depends(get_todo_list_repository)
):
    todo_list = repository.get_list_by_id(list_id)
    if not todo_list or todo_list.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return repository.update_list(list_id, updates)


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo_list(
        list_id: int,
        user: UserRead = Depends(get_current_user),
        repository: TodoListRepository = Depends(get_todo_list_repository)
):
    todo_list = repository.get_list_by_id(list_id)
    if not todo_list or todo_list.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Todo list not found")
    repository.delete_list(list_id)
    return
