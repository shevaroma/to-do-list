import hashlib
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

import jwt

from common.utils.config import settings

SECRET_KEY: str = settings.secret_key
ALGORITHM: str = "HS256"

TokenType = Literal["access", "reset"]


def password_fingerprint(hashed_password: str) -> str:
    return hashlib.sha256(hashed_password.encode()).hexdigest()[:16]


def _create_token(
    data: dict[str, Any], token_type: TokenType, expires_delta: timedelta
) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.now(UTC) + expires_delta, "type": token_type})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(
    data: dict[str, Any], expires_delta: timedelta = timedelta(hours=1)
) -> str:
    return _create_token(data, "access", expires_delta)


def create_reset_token(
    email: str, hashed_password: str, expires_delta: timedelta = timedelta(hours=1)
) -> str:
    return _create_token(
        {"sub": email, "pwd": password_fingerprint(hashed_password)},
        "reset",
        expires_delta,
    )


def decode_token(token: str, expected_type: TokenType) -> dict[str, Any]:
    payload: dict[str, Any] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    if payload.get("type") != expected_type:
        raise jwt.InvalidTokenError("Wrong token type")
    sub = payload.get("sub")
    if not isinstance(sub, str) or not sub:
        raise jwt.InvalidTokenError("Missing subject")
    return payload
