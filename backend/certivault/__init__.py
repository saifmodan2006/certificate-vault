from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, send_from_directory

from .config import Config, DATA_DIR
from .extensions import cors, db, jwt
from .routes import api


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure required directories exist (uses /tmp on Vercel)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)

    # Allow requests from the configured frontend URL and localhost for dev
    frontend_url = app.config.get("FRONTEND_URL", "http://localhost:3000")
    allowed_origins = [
        frontend_url,
        "http://localhost:3000",
        "http://localhost:3001",
    ]
    cors.init_app(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    app.register_blueprint(api)

    # Serve uploaded files (works locally; on Vercel use external storage)
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename: str):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=False)

    # Health check
    @app.route("/")
    def root():
        return jsonify({"status": "ok", "service": "CertiVault API"})

    with app.app_context():
        db.create_all()

    return app
