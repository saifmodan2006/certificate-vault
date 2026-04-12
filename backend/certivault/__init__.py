from __future__ import annotations

from pathlib import Path

from flask import Flask, send_from_directory

from .config import Config, DATA_DIR
from .extensions import cors, db, jwt
from .routes import api


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(api)

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename: str):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=False)

    with app.app_context():
        db.create_all()

    return app
