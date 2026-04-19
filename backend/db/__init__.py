from db.database import Base, engine


def init_db() -> None:
    """Create tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
