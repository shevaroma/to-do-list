from fastapi import Depends
from sqlalchemy.orm import Session

from common.models.todo_list import TodoListCreate, TodoListUpdate
from db.db_session import get_db
from db.models.todo_list import TodoList


class TodoListRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self._db = db

    def get_list_by_id(self, list_id: int):
        return self._db.query(TodoList).filter(TodoList.id == list_id).first()

    def get_all_lists_for_user(self, user_id: int):
        return self._db.query(TodoList).filter(TodoList.owner_id == user_id).all()

    def create_list(self, list_in: TodoListCreate, user_id: int):
        todo_list = TodoList(title=list_in.title, owner_id=user_id)
        self._db.add(todo_list)
        self._db.commit()
        self._db.refresh(todo_list)
        return todo_list

    def update_list(self, list_id: int, list_in: TodoListUpdate):
        todo_list = self.get_list_by_id(list_id)
        if not todo_list:
            return None
        update_data = list_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo_list, field, value)
        self._db.commit()
        self._db.refresh(todo_list)
        return todo_list

    def delete_list(self, list_id: int):
        todo_list = self.get_list_by_id(list_id)
        if todo_list:
            self._db.delete(todo_list)
            self._db.commit()
        return todo_list
