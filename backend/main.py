from contextlib import asynccontextmanager

from fastapi import FastAPI

from api import auth, users, todo_lists, todos
from fastapi.middleware.cors import CORSMiddleware

from db import init_db

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(todo_lists.router)
app.include_router(todos.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
