from fastapi import APIRouter

from api import auth, users, todo_lists, todos

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(todo_lists.router)
api_router.include_router(todos.router)
