from fastapi import APIRouter, Depends, status

from common.models.todo_list import TodoListRead, TodoListCreate, TodoListUpdate
from common.utils.auth import get_current_user
from common.utils.dependency_injection import get_owned_list, get_todo_list_repository
from db.models.todo_list import TodoList
from db.models.user import User
from repositories.todo_list import TodoListRepository

router = APIRouter(prefix="/todo-lists", tags=["todo-lists"])


@router.get("/", response_model=list[TodoListRead])
def get_my_todo_lists(
    user: User = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> list[TodoList]:
    return repository.get_all_lists_for_user(user.id)


@router.post("/", response_model=TodoListRead, status_code=status.HTTP_201_CREATED)
def create_todo_list(
    todo_list: TodoListCreate,
    user: User = Depends(get_current_user),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> TodoList:
    return repository.create_list(todo_list, user.id)


@router.get("/{list_id}", response_model=TodoListRead)
def get_todo_list_by_id(todo_list: TodoList = Depends(get_owned_list)) -> TodoList:
    return todo_list


@router.put("/{list_id}", response_model=TodoListRead)
def update_todo_list(
    updates: TodoListUpdate,
    todo_list: TodoList = Depends(get_owned_list),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> TodoList:
    return repository.update_list(todo_list, updates)


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo_list(
    todo_list: TodoList = Depends(get_owned_list),
    repository: TodoListRepository = Depends(get_todo_list_repository),
) -> None:
    repository.delete_list(todo_list)
