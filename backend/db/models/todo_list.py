from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from db.database import Base


class TodoList(Base):
    __tablename__ = "todo_lists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)

    owner = relationship("User", back_populates="todo_lists")
    todos = relationship("Todo", back_populates="todo_list", cascade="all, delete")

    def __repr__(self):
        return f"<TodoList(id={self.id}, title={self.title}, owner_id={self.owner_id})>"
