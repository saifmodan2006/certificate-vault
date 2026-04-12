import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "certivault-dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "certivault-dev-jwt-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{(DATA_DIR / 'certivault.db').as_posix()}",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", str(UPLOAD_DIR))
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
