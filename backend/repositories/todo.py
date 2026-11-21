from sqlalchemy.orm import Session

from common.models.todo import TodoCreate, TodoUpdate
from db.models.todo import Todo


class TodoRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_todo_for_owner(self, todo_id: int, owner_id: int) -> Todo | None:
        return (
            self._db.query(Todo)
            .filter(Todo.id == todo_id, Todo.owner_id == owner_id)
            .first()
        )

    def get_todos_by_list(
        self, user_id: int, todo_list_id: int | None = None
    ) -> list[Todo]:
        query = self._db.query(Todo).filter(Todo.owner_id == user_id)
        if todo_list_id is None:
            query = query.filter(Todo.todo_list_id.is_(None))
        else:
            query = query.filter(Todo.todo_list_id == todo_list_id)
        query = query.order_by(Todo.due_date)
        return query.all()

    def create_todo(self, todo_in: TodoCreate, user_id: int) -> Todo:
        todo = Todo(
            **todo_in.model_dump(),
            owner_id=user_id,
        )
        self._db.add(todo)
        self._db.commit()
        self._db.refresh(todo)
        return todo

    def update_todo(self, todo: Todo, todo_in: TodoUpdate) -> Todo:
        update_data = todo_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(todo, field, value)
        self._db.commit()
        self._db.refresh(todo)
        return todo

    def delete_todo(self, todo: Todo) -> None:
        self._db.delete(todo)
        self._db.commit()

    def delete_completed_todos(
        self, user_id: int, todo_list_id: int | None = None
    ) -> None:
        query = self._db.query(Todo).filter(Todo.owner_id == user_id, Todo.is_completed)
        if todo_list_id is None:
            query = query.filter(Todo.todo_list_id.is_(None))
        else:
            query = query.filter(Todo.todo_list_id == todo_list_id)
        query.delete()
        self._db.commit()
