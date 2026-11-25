from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api import api_router
from db import init_db
from repositories.exceptions import InvalidPasswordError


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://project-1lm4u.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.exception_handler(InvalidPasswordError)
def handle_invalid_password(
    _request: Request, _exc: InvalidPasswordError
) -> JSONResponse:
    return JSONResponse(
        status_code=400, content={"detail": "Current password is incorrect"}
    )
