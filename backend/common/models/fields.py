from typing import Annotated

from pydantic import Field, StringConstraints

NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
Password = Annotated[str, Field(min_length=8)]
Priority = Annotated[int, Field(ge=1, le=3)]
