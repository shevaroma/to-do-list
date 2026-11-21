from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base

if TYPE_CHECKING:
    from db.models.todo import Todo
    from db.models.todo_list import TodoList


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(String)
    hashed_password: Mapped[str] = mapped_column(String)

    todo_lists: Mapped[list["TodoList"]] = relationship(
        back_populates="owner", cascade="all, delete"
    )
    todos: Mapped[list["Todo"]] = relationship(
        back_populates="owner", cascade="all, delete"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, display_name={self.display_name})>"
