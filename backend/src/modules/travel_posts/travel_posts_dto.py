import uuid

from backend.src.modules.common.dto import DTO
from backend.src.modules.users.users_dto import UserDTO


class CreateTravelPostDTO(DTO):
    title: str
    cost: int
    transportation_rating: int
    safety_rating: int
    overcrowding_rating: int
    nature_rating: int
    cultural_heritage_sites: list[str]


class TravelPostDTO(DTO):
    id: uuid.UUID
    title: str
    cost: int
    transportation_rating: int
    safety_rating: int
    overcrowding_rating: int
    nature_rating: int
    cultural_heritage_sites: list[str]
    user: UserDTO
