
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from sqlalchemy.orm import Session

import common.models.user as models
from common.utils._jwt import create_reset_token
from db.models.user import User
from repositories.exceptions import InvalidPasswordError, NotFoundError

password_hasher = PasswordHasher()


class UserRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    @staticmethod
    def hash_password(password: str) -> str:
        return password_hasher.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            return password_hasher.verify(hashed_password, plain_password)
        except (VerificationError, InvalidHashError):
            return False

    def get_user_by_id(self, user_id: int) -> User | None:
        user = self._db.query(User).filter(User.id == user_id).first()
        return user

    def get_user_by_email(self, email: str) -> User | None:
        return self._db.query(User).filter(User.email == email).first()

    def create_user(self, user_in: models.UserCreate) -> User:
        user = User(
            email=str(user_in.email),
            hashed_password=self.hash_password(user_in.password),
            display_name=user_in.display_name,
        )
        self._db.add(user)
        self._db.commit()
        self._db.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str) -> User | None:
        user = self.get_user_by_email(email)
        if user and self.verify_password(password, user.hashed_password):
            return user
        return None

    def update_user(self, user_id: int, user_in: models.UserUpdate) -> User | None:
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
                raise InvalidPasswordError()
            user.hashed_password = self.hash_password(update_data["password"])
        self._db.commit()
        self._db.refresh(user)
        return user

    def create_reset_token(self, email: str) -> str | None:
        user = self.get_user_by_email(email)
        if not user:
            return None
        return create_reset_token(user.email, user.hashed_password)

    def update_password(self, email: str, new_password: str) -> User:
        user = self.get_user_by_email(email)
        if not user:
            raise NotFoundError("User not found")
        user.hashed_password = self.hash_password(new_password)
        self._db.commit()
        self._db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> None:
        user = self.get_user_by_id(user_id)
        if not user:
            return
        self._db.delete(user)
        self._db.commit()
