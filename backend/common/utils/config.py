from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(alias="DATABASE_URL")
    secret_key: str = Field(alias="SECRET_KEY")
    email_address: str = Field(alias="EMAIL_ADDRESS")
    email_password: str = Field(alias="EMAIL_PASSWORD")
    base_url: str = Field(alias="BASE_URL")

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

settings = Settings()
