"""
LOGOS Configuration
Load settings from environment variables with sensible defaults.
"""
from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment."""
    
    # App
    app_name: str = "LOGOS"
    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"
    
    # Database
    database_url: str = "postgresql://localhost:5432/logos"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # API Keys
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    google_ai_api_key: Optional[str] = None
    
    # Twitter
    twitter_api_key: Optional[str] = None
    twitter_api_secret: Optional[str] = None
    twitter_access_token: Optional[str] = None
    twitter_access_token_secret: Optional[str] = None
    twitter_bearer_token: Optional[str] = None
    
    # LinkedIn
    linkedin_client_id: Optional[str] = None
    linkedin_client_secret: Optional[str] = None
    linkedin_access_token: Optional[str] = None
    
    # JWT Auth
    jwt_secret: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # URLs
    frontend_url: str = "http://localhost:3000"
    api_url: str = "http://localhost:8000"
    
    # Admin
    admin_email: str = "admin@logos.app"
    admin_password: str = "change-this-password"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
