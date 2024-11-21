import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.src.modules.auth.auth_dependencies import get_user_id
from backend.src.modules.common.exceptions import DomainException
from backend.src.modules.database.db import get_session
from backend.src.modules.travel_posts.travel_posts_dto import (
    TravelPostDTO,
    CreateTravelPostDTO,
)
from backend.src.modules.travel_posts.travel_posts_models import TravelPost

travel_posts_router = APIRouter()


@travel_posts_router.get("/")
def get_all(
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> list[TravelPostDTO]:
    posts = (
        session.execute(select(TravelPost).where(TravelPost.user_id != user_id))
        .scalars()
        .all()
    )

    return [TravelPostDTO.model_validate(post) for post in posts]


@travel_posts_router.get("/{post_id}")
def get_by_id(
    post_id: uuid.UUID,
    session: Session = Depends(get_session),
) -> TravelPostDTO:
    post = session.get(TravelPost, post_id)
    if post is None:
        raise DomainException("Post not found")
    return TravelPostDTO.model_validate(post)


@travel_posts_router.post("/")
def create(
    dto: CreateTravelPostDTO,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> TravelPostDTO:
    post = TravelPost(
        title=dto.title,
        cost=dto.cost,
        user_id=user_id,
        transportation_rating=dto.transportation_rating,
        safety_rating=dto.safety_rating,
        overcrowding_rating=dto.overcrowding_rating,
        nature_rating=dto.nature_rating,
        cultural_heritage_sites=dto.cultural_heritage_sites,
    )
    post.assert_valid()
    session.add(post)
    session.commit()
    session.refresh(post)
    return TravelPostDTO.model_validate(post)


@travel_posts_router.put("/{post_id}")
def update(
    post_id: uuid.UUID,
    dto: CreateTravelPostDTO,
    user_id: uuid.UUID = Depends(get_user_id),
    session: Session = Depends(get_session),
) -> TravelPostDTO:
    post = session.get(TravelPost, post_id)
    if post.user_id != user_id:
        raise DomainException("You don't have permission to update this post")
    post.title = dto.title
    post.cost = dto.cost
    post.transportation_rating = dto.transportation_rating
    post.safety_rating = dto.safety_rating
    post.overcrowding_rating = dto.overcrowding_rating
    post.nature_rating = dto.nature_rating
    post.cultural_heritage_sites = dto.cultural_heritage_sites
    post.assert_valid()
    session.commit()
    return TravelPostDTO.model_validate(post)
