from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API Settings
    api_v1_str: str = "/api/v1"
    secret_key: str = "your-secret-key-here"
    access_token_expire_minutes: int = 60 * 24 * 8  # 8 days

    # Server Settings
    server_name: str = "The Cheater's Dilemma API"
    server_host: str = "http://localhost"
    server_port: int = 8000
    debug: bool = True

    # CORS Settings
    backend_cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Simulation Settings
    max_agents: int = 20
    max_turns: int = 1000

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()