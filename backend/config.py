# backend/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    SECRET_KEY: str = "your-super-secret-key" # CHANGE THIS IN PRODUCTION
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # OAuth
    # GITHUB_CLIENT_ID: Optional[str] = None
    # GITHUB_CLIENT_SECRET: Optional[str] = None
    # GOOGLE_CLIENT_ID: Optional[str] = None
    # GOOGLE_CLIENT_SECRET: Optional[str] = None

    # AI API Keys
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()