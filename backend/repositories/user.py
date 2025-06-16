from datetime import timedelta
from typing import Optional

from fastapi import Depends, HTTPException, BackgroundTasks
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import common.models.user as models
from common.utils._jwt import create_access_token
from common.utils.config import settings
from common.utils.email import send_email
from db.db_session import get_db
from db.models.user import User

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
BASE_URL = settings.base_url


class UserRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self._db = db

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        user = self._db.query(User).filter(User.id == user_id).first()
        return user

    def get_user_by_email(self, email: str):
        return self._db.query(User).filter(User.email == email).first()

    def create_user(self, user_in: models.UserCreate):
        user = User(
            email=str(user_in.email),
            hashed_password=self.hash_password(user_in.password),
            display_name=user_in.display_name,
        )
        self._db.add(user)
        self._db.commit()
        self._db.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if user and self.verify_password(password, user.hashed_password):
            return user
        return None

    def update_user(
        self, user_id: int, user_in: models.UserUpdate
    ) -> Optional[models.User]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        update_data = user_in.model_dump(exclude_unset=True)
        if "email" in update_data:
            user.email = update_data["email"]
        if "display_name" in update_data:
            user.display_name = update_data["display_name"]
        if "password" in update_data:
            current_password = update_data.get("current_password")
            if not current_password or not self.verify_password(
                current_password, user.hashed_password
            ):
                raise HTTPException(
                    status_code=400, detail="Current password is incorrect"
                )
            user.hashed_password = self.hash_password(update_data["password"])
        self._db.commit()
        self._db.refresh(user)
        return models.User.model_validate(user)

    def reset_password(self, email: str, background_tasks: BackgroundTasks) -> str:
        user = self.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        token = create_access_token(
            {"sub": user.email}, expires_delta=timedelta(hours=1)
        )
        background_tasks.add_task(
            send_email,
            str(user.email),
            "Password Reset",
            f"Click the link to reset your password: {BASE_URL}/reset-password?token={token}",
        )
        return token

    def update_password(self, email: str, current_password: str, new_password: str):
        user = self.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not self.verify_password(current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.hashed_password = self.hash_password(new_password)
        self._db.commit()
        self._db.refresh(user)
        return user

    def delete_user(self, user_id: int):
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        self._db.delete(user)
        self._db.commit()
        return user
