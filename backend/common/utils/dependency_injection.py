from fastapi import Depends
from sqlalchemy.orm import Session

from db.db_session import get_db
from repositories.todo import TodoRepository
from repositories.todo_list import TodoListRepository
from repositories.user import UserRepository


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


def get_todo_list_repository(db: Session = Depends(get_db)) -> TodoListRepository:
    return TodoListRepository(db)


def get_todo_repository(db: Session = Depends(get_db)) -> TodoRepository:
    return TodoRepository(db)
