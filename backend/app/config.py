from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    secret_key: str = Field(..., alias="SECRET_KEY")
    algorithm: str = Field(..., alias="ALGORITHM")
    access_token_expire_minutes: int = Field(..., alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")

    class Config:
        env_file = ".env"
        extra = "forbid"  # disallow unexpected keys

settings = Settings()
