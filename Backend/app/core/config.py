from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "learning_academy"
    groq_api_key: str | None = None
    jwt_secret: str = "replace_me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    tmp_dir: str = "tmp"
    certificates_dir: str = "certificates"
    port: int = 8080

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
