from pydantic import BaseModel, EmailStr

# User registration and login schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True  # Allow Pydantic to work with SQLAlchemy models

class Token(BaseModel):
    access_token: str
    token_type: str

# Journal entry input schema
class EntryCreate(BaseModel):
    title: str
    content: str
