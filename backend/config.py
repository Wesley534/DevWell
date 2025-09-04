# backend/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv("SECRET_KEY", os.urandom(32).hex())  # Secure default
    SQLALCHEMY_DATABASE_URL: str = os.getenv("SQLALCHEMY_DATABASE_URL", "sqlite:///./devwell.db")
    # ALLOWED_ORIGINS: List[str] = ["https://aidevwell.netlify.app"]
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173"]



    # OAuth (optional, commented out as per your code)
    # GITHUB_CLIENT_ID: Optional[str] = None
    # GITHUB_CLIENT_SECRET: Optional[str] = None
    # GOOGLE_CLIENT_ID: Optional[str] = None
    # GOOGLE_CLIENT_SECRET: Optional[str] = None

    # AI API Keys (optional)
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
