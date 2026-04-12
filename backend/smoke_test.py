from __future__ import annotations

import json
import os
import time
import uuid
from pathlib import Path
from tempfile import gettempdir
from urllib import error, request


API_BASE = "http://127.0.0.1:5000"
FRONTEND_BASE = os.getenv("FRONTEND_BASE", "http://127.0.0.1:3000")


def api_request(
    path: str,
    method: str = "GET",
    data: dict | bytes | None = None,
    headers: dict[str, str] | None = None,
):
    request_headers = headers.copy() if headers else {}
    payload = None

    if isinstance(data, dict):
        payload = json.dumps(data).encode("utf-8")
        request_headers["Content-Type"] = "application/json"
    elif isinstance(data, bytes):
        payload = data

    req = request.Request(
        f"{API_BASE}{path}",
        data=payload,
        headers=request_headers,
        method=method,
    )

    try:
        with request.urlopen(req) as response:
            raw = response.read().decode("utf-8")
            parsed = json.loads(raw) if raw else {}
            return response.getcode(), parsed
    except error.HTTPError as exc:
        raw = exc.read().decode("utf-8")
        parsed = json.loads(raw) if raw else {}
        return exc.code, parsed


def build_multipart(fields: dict[str, str], file_path: Path, mime_type: str):
    boundary = f"----CertiVault{uuid.uuid4().hex}"
    lines: list[bytes] = []

    for name, value in fields.items():
        lines.extend(
            [
                f"--{boundary}".encode("utf-8"),
                f'Content-Disposition: form-data; name="{name}"'.encode("utf-8"),
                b"",
                value.encode("utf-8"),
            ]
        )

    file_bytes = file_path.read_bytes()
    lines.extend(
        [
            f"--{boundary}".encode("utf-8"),
            (
                f'Content-Disposition: form-data; name="file"; filename="{file_path.name}"'
            ).encode("utf-8"),
            f"Content-Type: {mime_type}".encode("utf-8"),
            b"",
            file_bytes,
            f"--{boundary}--".encode("utf-8"),
            b"",
        ]
    )

    return boundary, b"\r\n".join(lines)


def frontend_status(path: str):
    with request.urlopen(f"{FRONTEND_BASE}{path}") as response:
        return response.getcode()


def main():
    stamp = int(time.time())
    username = f"smoke{stamp}"
    email = f"{username}@example.com"

    register_status, register_payload = api_request(
        "/register",
        method="POST",
        data={
            "name": "Smoke Test",
            "username": username,
            "email": email,
            "password": "Pass123!",
        },
    )
    assert register_status == 201, register_payload

    token = register_payload["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    update_status, _ = api_request(
        "/user/me",
        method="PUT",
        data={
            "name": "Smoke Test",
            "username": username,
            "email": email,
            "bio": "Full-stack learner building a shareable certificate vault.",
            "skills": ["React", "Python", "Flask"],
            "profile_image": "",
            "social_links": {
                "linkedin": "linkedin.com/in/smoke-test",
                "github": "github.com/smoke-test",
            },
            "portfolio_password": "open123",
        },
        headers=auth_headers,
    )
    assert update_status == 200

    temp_pdf = Path(gettempdir()) / f"{username}.pdf"
    temp_pdf.write_bytes(b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF")

    boundary, multipart_payload = build_multipart(
        {
            "title": "Demo Certificate",
            "issuer": "Coursera",
            "issue_date": "2026-04-12",
            "credential_id": "CV-001",
            "credential_url": "https://example.com/verify",
            "category": "Programming",
            "visibility": "public",
        },
        temp_pdf,
        "application/pdf",
    )

    upload_status, upload_payload = api_request(
        "/certificate/add",
        method="POST",
        data=multipart_payload,
        headers={
            **auth_headers,
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
    )
    assert upload_status == 201, upload_payload

    list_status, list_payload = api_request("/certificate/list", headers=auth_headers)
    assert list_status == 200, list_payload

    public_status, _ = api_request(f"/profile/{username}")
    assert public_status == 403

    unlock_status, unlock_payload = api_request(
        f"/profile/{username}/unlock",
        method="POST",
        data={"password": "open123"},
    )
    assert unlock_status == 200, unlock_payload

    status = {
        "username": username,
        "registered": bool(token),
        "uploadedCertificateId": upload_payload["certificate"]["id"],
        "listedCount": len(list_payload["certificates"]),
        "publicProfileStatus": public_status,
        "unlockedCertificateCount": len(unlock_payload["certificates"]),
        "frontendProfileStatus": frontend_status(f"/{username}"),
    }

    print(json.dumps(status, indent=2))


if __name__ == "__main__":
    main()
