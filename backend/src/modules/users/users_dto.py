import uuid

from backend.src.modules.common.dto import DTO


class UserDTO(DTO):
    id: uuid.UUID
    username: str
