import os

class Settings:
    PROJECT_NAME: str = "AI-Based Landslide Risk Monitoring System (NER)"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./landslide_ner.db")
    DATA_MODE: str = os.getenv("DATA_MODE", "DEMO")
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()
