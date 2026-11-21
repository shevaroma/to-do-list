from fastapi import APIRouter, status

from common.models.todo_list import TodoListCreate, TodoListRead, TodoListUpdate
from common.utils.dependency_injection import CurrentUser, OwnedList, TodoListRepo
from db.models.todo_list import TodoList

router = APIRouter(prefix="/todo-lists", tags=["todo-lists"])


@router.get("/", response_model=list[TodoListRead])
def get_my_todo_lists(user: CurrentUser, repository: TodoListRepo) -> list[TodoList]:
    return repository.get_all_lists_for_user(user.id)


@router.post("/", response_model=TodoListRead, status_code=status.HTTP_201_CREATED)
def create_todo_list(
    todo_list: TodoListCreate, user: CurrentUser, repository: TodoListRepo
) -> TodoList:
    return repository.create_list(todo_list, user.id)


@router.get("/{list_id}", response_model=TodoListRead)
def get_todo_list_by_id(todo_list: OwnedList) -> TodoList:
    return todo_list


@router.put("/{list_id}", response_model=TodoListRead)
def update_todo_list(
    updates: TodoListUpdate, todo_list: OwnedList, repository: TodoListRepo
) -> TodoList:
    return repository.update_list(todo_list, updates)


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo_list(todo_list: OwnedList, repository: TodoListRepo) -> None:
    repository.delete_list(todo_list)
