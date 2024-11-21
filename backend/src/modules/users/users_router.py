import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from backend.src.modules.auth.auth_dependencies import get_user_id
from backend.src.modules.auth.auth_models import User
from backend.src.modules.database.db import get_session
from backend.src.modules.travel_posts.travel_posts_dto import TravelPostDTO
from backend.src.modules.users.users_dto import UserDTO

users_router = APIRouter(
    dependencies=[Depends(get_user_id)],
)


class UserWithProfileDTO(UserDTO):
    travel_posts: list[TravelPostDTO]


@users_router.get("/me")
def get_me(
    user_id: uuid.UUID = Depends(get_user_id), session: Session = Depends(get_session)
) -> UserWithProfileDTO:
    user = session.get(User, user_id, options=[selectinload(User.travel_posts)])
    return UserWithProfileDTO.model_validate(user)


@users_router.get("/{user_id}")
def get_by_id(
    user_id: uuid.UUID, session: Session = Depends(get_session)
) -> UserWithProfileDTO:
    user = session.get(User, user_id, options=[selectinload(User.travel_posts)])
    return UserWithProfileDTO.model_validate(user)
