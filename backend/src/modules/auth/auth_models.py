import uuid
from datetime import timedelta
from typing import TYPE_CHECKING

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerificationError
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from backend.src.env import JWT_SECRET, JWT_ALGORITHM
from backend.src.modules.common.dto import DTO
from backend.src.modules.common.exceptions import DomainException
from backend.src.modules.common.utils import utc_now
from backend.src.modules.database.db import Base

if TYPE_CHECKING:
    from backend.src.modules.travel_posts.travel_posts_models import TravelPost

password_hasher = PasswordHasher()


class AccessTokenDTO(DTO):
    token: str


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        init=False,
        default_factory=uuid.uuid4,
    )
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()
    travel_posts: Mapped[list["TravelPost"]] = relationship(
        "TravelPost",
        back_populates="user",
        lazy="raise",
    )

    @classmethod
    def create_from(cls, username: str, password: str):
        encoded_password = password_hasher.hash(password)
        return cls(
            username=username,
            password=encoded_password,
            travel_posts=[],
        )

    def login(self, password: str) -> "AccessTokenDTO":
        try:
            password_hasher.verify(self.password, password)
        except VerificationError:
            raise DomainException("Password is incorrect")

        return AccessTokenDTO(token=self._generate_access_token())

    def _generate_access_token(self):
        issued_at = utc_now()
        data = {
            "user_id": str(self.id),
            "exp": issued_at + timedelta(hours=2),
            "iat": issued_at,
        }
        return jwt.encode(data, JWT_SECRET, JWT_ALGORITHM)
