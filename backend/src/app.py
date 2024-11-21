import json
from pathlib import Path

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.src.modules.auth.auth_router import auth_router
from backend.src.modules.travel_posts.travel_posts_router import travel_posts_router
from backend.src.modules.users.users_router import users_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_openapi_file():
    openapi_file = Path(__file__).parent.parent / "openapi.json"
    openapi_file.write_text(json.dumps(app.openapi(), indent=2))


app.include_router(auth_router, prefix="/auth")
app.include_router(users_router, prefix="/users")
app.include_router(travel_posts_router, prefix="/travel_posts")
create_openapi_file()
