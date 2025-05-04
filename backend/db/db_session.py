from db.database import SessionLocal


def get_db() -> SessionLocal:
    """Get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
