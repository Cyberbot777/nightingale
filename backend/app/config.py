# app/config.py

from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    secret_key: str = Field(..., alias="SECRET_KEY")
    algorithm: str = Field("HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")
    sendgrid_api_key: str = Field(..., alias="SENDGRID_API_KEY")
    sendgrid_from_email: str = Field(..., alias="SENDGRID_FROM_EMAIL")

    class Config:
        env_file = ".env"
        extra = "forbid"

settings = Settings()
