from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Global application settings."""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://namanchawla:naman@localhost:5432/postgres"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "FastAPI Application"
    VERSION: str = "1.0.0"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # External APIs
    FINNHUB_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
