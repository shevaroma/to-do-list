from datetime import UTC, datetime
from typing import Annotated

from pydantic import AfterValidator, Field, StringConstraints

NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
Password = Annotated[str, Field(min_length=8)]
Priority = Annotated[int, Field(ge=1, le=3)]


def _to_naive_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value
    return value.astimezone(UTC).replace(tzinfo=None)


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


UtcDatetimeIn = Annotated[datetime, AfterValidator(_to_naive_utc)]
UtcDatetimeOut = Annotated[datetime, AfterValidator(_as_utc)]
