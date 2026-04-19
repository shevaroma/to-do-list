from datetime import timedelta, datetime, UTC
from typing import Any

import jwt

from common.utils.config import settings

SECRET_KEY: str = settings.secret_key
ALGORITHM: str = "HS256"


def create_access_token(
    data: dict[str, Any], expires_delta: timedelta = timedelta(hours=1)
) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
