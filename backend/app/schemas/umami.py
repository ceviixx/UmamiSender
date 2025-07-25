from pydantic import BaseModel
from enum import Enum
from typing import Optional

class UmamiType(str, Enum):
    cloud = "cloud"
    self_hosted = "self_hosted"

class UmamiInstanceCreate(BaseModel):
    name: str
    type: UmamiType
    api_key: Optional[str] = None
    hostname: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None  # Klartext nur zum Hashen

class UmamiInstanceOut(BaseModel):
    id: int
    name: str
    type: UmamiType
    hostname: Optional[str] = None
    username: Optional[str] = None

    class Config:
        from_attributes = True

class UmamiInstanceUpdate(BaseModel):
    name: Optional[str] = None
    type: UmamiType
    api_key: Optional[str] = None
    hostname: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    bearer_token: Optional[str] = None