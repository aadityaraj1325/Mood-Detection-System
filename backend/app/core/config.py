from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Mood Detection API"
    api_prefix: str = "/api"
    secret_key: str = "change-me-in-production"
    encryption_key: str = "o4ZuQ_4pw5fV8adM0Qf6WQxM7AadR_a2tfdY5N0Nn7k="
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "mood_detection_system"
    use_mock_db: bool = False

    cors_origins: list[str] = ["http://localhost:5173"]

    rate_limit_auth: str = "5/minute"
    rate_limit_api: str = "60/minute"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
