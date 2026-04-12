from __future__ import annotations

from sqlalchemy import func

from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text, default="", nullable=False)
    skills = db.Column(db.Text, default="", nullable=False)
    social_linkedin = db.Column(db.String(255), default="", nullable=False)
    social_github = db.Column(db.String(255), default="", nullable=False)
    profile_image = db.Column(db.String(255), default="", nullable=False)
    portfolio_password_hash = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    certificates = db.relationship(
        "Certificate",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="dynamic",
    )


class Certificate(db.Model):
    __tablename__ = "certificates"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(160), nullable=False)
    issuer = db.Column(db.String(160), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    credential_id = db.Column(db.String(120), default="", nullable=False)
    credential_url = db.Column(db.String(255), default="", nullable=False)
    category = db.Column(db.String(80), default="Others", nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    mime_type = db.Column(db.String(80), nullable=False)
    visibility = db.Column(db.String(20), default="public", nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = db.relationship("User", back_populates="certificates")
