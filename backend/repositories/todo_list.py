from sqlalchemy.orm import Session

from common.models.todo_list import TodoListCreate, TodoListUpdate
from db.models.todo_list import TodoList


class TodoListRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_list_for_owner(self, list_id: int, owner_id: int) -> TodoList | None:
        return (
            self._db.query(TodoList)
            .filter(TodoList.id == list_id, TodoList.owner_id == owner_id)
            .first()
        )

    def get_all_lists_for_user(self, user_id: int) -> list[TodoList]:
        return self._db.query(TodoList).filter(TodoList.owner_id == user_id).all()

    def create_list(self, list_in: TodoListCreate, user_id: int) -> TodoList:
        todo_list = TodoList(title=list_in.title, owner_id=user_id)
        self._db.add(todo_list)
        self._db.commit()
        self._db.refresh(todo_list)
        return todo_list

    def update_list(self, todo_list: TodoList, list_in: TodoListUpdate) -> TodoList:
        update_data = list_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo_list, field, value)
        self._db.commit()
        self._db.refresh(todo_list)
        return todo_list

    def delete_list(self, todo_list: TodoList) -> None:
        self._db.delete(todo_list)
        self._db.commit()
