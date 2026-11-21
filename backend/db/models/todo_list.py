from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base

if TYPE_CHECKING:
    from db.models.todo import Todo
    from db.models.user import User


class TodoList(Base):
    __tablename__ = "todo_lists"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True, nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    owner: Mapped["User"] = relationship(back_populates="todo_lists")
    todos: Mapped[list["Todo"]] = relationship(
        back_populates="todo_list", cascade="all, delete"
    )

    def __repr__(self) -> str:
        return f"<TodoList(id={self.id}, title={self.title}, owner_id={self.owner_id})>"
