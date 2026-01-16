from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: int

class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=72)  # <- AQUI

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    password: Optional[str] = Field(default=None, min_length=6, max_length=72)  # <- AQUI

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


