# app/config.py

from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    secret_key: str = Field(..., alias="SECRET_KEY")
    algorithm: str = Field(..., alias="ALGORITHM")
    access_token_expire_minutes: int = Field(..., alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"
        populate_by_name = True

settings = Settings()
