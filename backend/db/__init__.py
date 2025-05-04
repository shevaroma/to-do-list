import db.models
from db.database import Base, engine


def init_db():
    """Create tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
