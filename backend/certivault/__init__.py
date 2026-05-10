from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from .config import Config, DATA_DIR
from .extensions import db, jwt
from .routes import api


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure required directories exist (uses /tmp on Vercel)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)

    # Accept requests from any Vercel preview URL + configured frontend
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

    app.register_blueprint(api)

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename: str):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=False)

    @app.route("/")
    def root():
        return jsonify({"status": "ok", "service": "CertiVault API"})

    with app.app_context():
        db.create_all()

    return app
