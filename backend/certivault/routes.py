from __future__ import annotations

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db
from .models import Certificate, User
from .utils import (
    allowed_file,
    build_asset_url,
    ensure_scheme,
    parse_issue_date,
    remove_upload,
    save_upload,
    split_skills,
)


api = Blueprint("api", __name__)


def _api_base_url() -> str:
    return request.host_url.rstrip("/")


def _serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "skills": split_skills(user.skills),
        "profile_image": user.profile_image,
        "social_links": {
            "linkedin": user.social_linkedin,
            "github": user.social_github,
        },
        "has_portfolio_password": bool(user.portfolio_password_hash),
    }


def _serialize_certificate(certificate: Certificate) -> dict:
    return {
        "id": certificate.id,
        "title": certificate.title,
        "issuer": certificate.issuer,
        "issue_date": certificate.issue_date.isoformat(),
        "credential_id": certificate.credential_id,
        "credential_url": certificate.credential_url,
        "category": certificate.category,
        "file_name": certificate.file_name,
        "file_url": build_asset_url(_api_base_url(), certificate.file_path),
        "visibility": certificate.visibility,
        "created_at": certificate.created_at.isoformat() if certificate.created_at else None,
    }


def _portfolio_payload(user: User) -> dict:
    public_certificates = (
        user.certificates.filter_by(visibility="public")
        .order_by(Certificate.issue_date.desc(), Certificate.created_at.desc())
        .all()
    )
    return {
        "profile": {
            "name": user.name,
            "username": user.username,
            "bio": user.bio,
            "skills": split_skills(user.skills),
            "profile_image": user.profile_image,
            "social_links": {
                "linkedin": user.social_linkedin,
                "github": user.social_github,
            },
        },
        "certificates": [_serialize_certificate(item) for item in public_certificates],
    }


def _current_user() -> User | None:
    identity = get_jwt_identity()
    if identity is None:
        return None
    return User.query.get(int(identity))


@api.get("/health")
def health():
    return jsonify({"status": "ok"})


@api.post("/register")
def register():
    data = request.get_json(force=True)

    required = {
        "name": (data.get("name") or "").strip(),
        "username": (data.get("username") or "").strip().lower(),
        "email": (data.get("email") or "").strip().lower(),
        "password": data.get("password") or "",
    }

    missing = [field for field, value in required.items() if not value]
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    if User.query.filter_by(email=required["email"]).first():
        return jsonify({"message": "Email already registered"}), 409

    if User.query.filter_by(username=required["username"]).first():
        return jsonify({"message": "Username already taken"}), 409

    user = User(
        name=required["name"],
        username=required["username"],
        email=required["email"],
        password_hash=generate_password_hash(required["password"]),
    )

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "user": _serialize_user(user)}), 201


@api.post("/login")
def login():
    data = request.get_json(force=True)
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "user": _serialize_user(user)})


@api.get("/user/me")
@jwt_required()
def get_current_user():
    user = _current_user()
    if user is None:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"user": _serialize_user(user)})


@api.put("/user/me")
@jwt_required()
def update_current_user():
    user = _current_user()
    if user is None:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json(force=True)

    username = (data.get("username") or user.username).strip().lower()
    email = (data.get("email") or user.email).strip().lower()

    username_owner = User.query.filter(User.username == username, User.id != user.id).first()
    if username_owner:
        return jsonify({"message": "Username already taken"}), 409

    email_owner = User.query.filter(User.email == email, User.id != user.id).first()
    if email_owner:
        return jsonify({"message": "Email already registered"}), 409

    user.name = (data.get("name") or user.name).strip()
    user.username = username
    user.email = email
    user.bio = (data.get("bio") or "").strip()
    skills = data.get("skills") or []
    if isinstance(skills, list):
        user.skills = ", ".join(skill.strip() for skill in skills if skill.strip())
    else:
        user.skills = str(skills).strip()
    user.profile_image = ensure_scheme((data.get("profile_image") or "").strip())
    user.social_linkedin = ensure_scheme((data.get("social_links", {}).get("linkedin") or "").strip())
    user.social_github = ensure_scheme((data.get("social_links", {}).get("github") or "").strip())

    portfolio_password = data.get("portfolio_password")
    if portfolio_password is not None:
        trimmed_password = portfolio_password.strip()
        user.portfolio_password_hash = (
            generate_password_hash(trimmed_password) if trimmed_password else None
        )

    db.session.commit()
    return jsonify({"user": _serialize_user(user)})


@api.post("/certificate/add")
@jwt_required()
def add_certificate():
    user = _current_user()
    if user is None:
        return jsonify({"message": "User not found"}), 404

    file = request.files.get("file")
    if file is None or not file.filename:
        return jsonify({"message": "Certificate file is required"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "Allowed file types: PDF, JPG, JPEG, PNG"}), 400

    try:
        issue_date = parse_issue_date(request.form.get("issue_date", ""))
    except ValueError:
        return jsonify({"message": "Issue date must be in YYYY-MM-DD format"}), 400

    title = (request.form.get("title") or "").strip()
    issuer = (request.form.get("issuer") or "").strip()
    if not title or not issuer:
        return jsonify({"message": "Title and issuer are required"}), 400

    relative_path = save_upload(file, current_app.config["UPLOAD_FOLDER"], user.username)
    certificate = Certificate(
        user_id=user.id,
        title=title,
        issuer=issuer,
        issue_date=issue_date,
        credential_id=(request.form.get("credential_id") or "").strip(),
        credential_url=ensure_scheme((request.form.get("credential_url") or "").strip()),
        category=(request.form.get("category") or "Others").strip(),
        file_path=relative_path,
        file_name=file.filename,
        mime_type=file.mimetype or "application/octet-stream",
        visibility=(request.form.get("visibility") or "public").strip().lower(),
    )

    if certificate.visibility not in {"public", "private"}:
        certificate.visibility = "public"

    db.session.add(certificate)
    db.session.commit()
    return jsonify({"certificate": _serialize_certificate(certificate)}), 201


@api.get("/certificate/list")
@jwt_required()
def list_certificates():
    user = _current_user()
    if user is None:
        return jsonify({"message": "User not found"}), 404

    certificates = user.certificates.order_by(
        Certificate.issue_date.desc(),
        Certificate.created_at.desc(),
    ).all()
    return jsonify({"certificates": [_serialize_certificate(item) for item in certificates]})


@api.delete("/certificate/<int:certificate_id>")
@jwt_required()
def delete_certificate(certificate_id: int):
    user = _current_user()
    if user is None:
        return jsonify({"message": "User not found"}), 404

    certificate = Certificate.query.filter_by(id=certificate_id, user_id=user.id).first()
    if certificate is None:
        return jsonify({"message": "Certificate not found"}), 404

    remove_upload(current_app.config["UPLOAD_FOLDER"], certificate.file_path)
    db.session.delete(certificate)
    db.session.commit()
    return jsonify({"message": "Certificate deleted"})


@api.get("/profile/<string:username>")
def public_profile(username: str):
    user = User.query.filter_by(username=username.lower()).first()
    if user is None:
        return jsonify({"message": "Profile not found"}), 404

    if user.portfolio_password_hash:
        return (
            jsonify(
                {
                    "requires_password": True,
                    "message": "This portfolio is password protected",
                }
            ),
            403,
        )

    return jsonify(_portfolio_payload(user))


@api.post("/profile/<string:username>/unlock")
def unlock_public_profile(username: str):
    user = User.query.filter_by(username=username.lower()).first()
    if user is None:
        return jsonify({"message": "Profile not found"}), 404

    if not user.portfolio_password_hash:
        return jsonify(_portfolio_payload(user))

    password = (request.get_json(force=True).get("password") or "").strip()
    if not password or not check_password_hash(user.portfolio_password_hash, password):
        return jsonify({"message": "Incorrect portfolio password"}), 401

    return jsonify(_portfolio_payload(user))
