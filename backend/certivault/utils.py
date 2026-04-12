from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


def parse_issue_date(value: str):
    return datetime.strptime(value, "%Y-%m-%d").date()


def allowed_file(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def ensure_scheme(value: str) -> str:
    if not value:
        return ""
    if value.startswith(("http://", "https://")):
        return value
    return f"https://{value}"


def save_upload(file: FileStorage, upload_root: str, username: str) -> str:
    extension = Path(file.filename or "").suffix.lower()
    safe_stem = secure_filename(Path(file.filename or "certificate").stem) or "certificate"
    user_dir = Path(upload_root) / secure_filename(username)
    user_dir.mkdir(parents=True, exist_ok=True)
    target_name = f"{uuid4().hex}_{safe_stem}{extension}"
    target_path = user_dir / target_name
    file.save(target_path)
    return str(Path(secure_filename(username)) / target_name).replace("\\", "/")


def remove_upload(upload_root: str, relative_path: str) -> None:
    target_path = Path(upload_root) / relative_path
    if target_path.exists():
        target_path.unlink()


def split_skills(skills_text: str) -> list[str]:
    return [skill.strip() for skill in skills_text.split(",") if skill.strip()]


def build_asset_url(base_url: str, relative_path: str) -> str:
    clean_path = relative_path.replace(os.sep, "/")
    return f"{base_url.rstrip('/')}/uploads/{clean_path}"
