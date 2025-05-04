from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    display_name = Column(String)
    hashed_password = Column(String)

    todo_lists = relationship("TodoList", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, display_name={self.display_name})>"
