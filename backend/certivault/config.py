import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
IS_VERCEL = os.getenv("VERCEL") == "1"
DEFAULT_DATA_DIR = Path("/tmp/certivault-data") if IS_VERCEL else BASE_DIR / "data"
DEFAULT_UPLOAD_DIR = Path("/tmp/certivault-uploads") if IS_VERCEL else BASE_DIR / "uploads"

DATA_DIR = Path(os.getenv("DATA_DIR", str(DEFAULT_DATA_DIR)))
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(DEFAULT_UPLOAD_DIR)))


def _get_database_url() -> str:
    url = os.getenv("DATABASE_URL", f"sqlite:///{(DATA_DIR / 'certivault.db').as_posix()}")
    # Supabase / Heroku use postgres:// but SQLAlchemy 1.4+ requires postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "certivault-dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "certivault-dev-jwt-secret")
    SQLALCHEMY_DATABASE_URI = _get_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Connection pool settings for PostgreSQL (Supabase)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", str(UPLOAD_DIR))
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    GOOGLE_CLIENT_ID = os.getenv(
        "GOOGLE_CLIENT_ID",
        "122819830627-dst4jjn14nc2noqen0561mmvk4144336.apps.googleusercontent.com",
    )
