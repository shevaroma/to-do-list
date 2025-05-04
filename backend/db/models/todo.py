from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from db.database import Base


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String)
    is_completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    priority = Column(Integer, default=1)  # default priority
    todo_list_id = Column(Integer, ForeignKey("todo_lists.id"))
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    todo_list = relationship("TodoList", back_populates="todos")

    def __repr__(self):
        return f"<Todo(id={self.id}, name={self.title}, due_date={self.due_date}, priority={self.priority})>"
