import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, Relationship, relationship
from sqlalchemy.testing.schema import mapped_column

from backend.src.modules.common.exceptions import DomainException

if TYPE_CHECKING:
    from backend.src.modules.auth.auth_models import User
from backend.src.modules.database.db import Base


class TravelPost(Base):
    __tablename__ = "travel_posts"

    title: Mapped[str] = mapped_column()
    cost: Mapped[int] = mapped_column()
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
    )
    user: Relationship["User"] = relationship(
        "User",
        back_populates="travel_posts",
        lazy="selectin",
        init=False,
    )

    transportation_rating: Mapped[int] = mapped_column()
    safety_rating: Mapped[int] = mapped_column()

    overcrowding_rating: Mapped[int] = mapped_column()
    nature_rating: Mapped[int] = mapped_column()

    cultural_heritage_sites: Mapped[list[str]] = mapped_column(
        ARRAY(String),
    )
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default_factory=uuid.uuid4)

    def assert_valid(self):
        if self.cost < 0:
            raise DomainException("Cost cannot be negative")
        if self.transportation_rating < 0 or self.transportation_rating > 5:
            raise DomainException("Transportation rating must be between 0 and 5")
        if self.safety_rating < 0 or self.safety_rating > 5:
            raise DomainException("Safety rating must be between 0 and 5")
        if self.overcrowding_rating < 0 or self.overcrowding_rating > 5:
            raise DomainException("Overcrowding rating must be between 0 and 5")
        if self.nature_rating < 0 or self.nature_rating > 5:
            raise DomainException("Nature rating must be between 0 and 5")
