# CertiVault

CertiVault is a digital certificate portfolio platform with a Flask API and a Next.js frontend. Users can register, manage certificates, control visibility, protect their portfolio with a password, and share a public profile link.

## Stack

- Frontend: Next.js 16, React 19, Tailwind CSS 4
- Backend: Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- Database: SQLite
- File storage: local uploads directory for the MVP

## Project Structure

- `backend/` Flask API, SQLite database, uploads, smoke test
- `frontend/` Next.js app with landing page, auth, dashboard, settings, and public profile

## Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python run.py
```

API runs on `http://localhost:5000`.

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` when the port is free.

If `3000` is already occupied:

```powershell
npm run dev -- --port 3100
```

## Environment

Copy these examples if you want to override defaults:

- `backend/.env.example`
- `frontend/.env.local.example`

## Core Routes

- `POST /register`
- `POST /login`
- `GET /user/me`
- `PUT /user/me`
- `POST /certificate/add`
- `GET /certificate/list`
- `DELETE /certificate/<id>`
- `GET /profile/<username>`
- `POST /profile/<username>/unlock`

## Smoke Test

After both servers are running:

```powershell
$env:FRONTEND_BASE='http://127.0.0.1:3000'
backend\.venv\Scripts\python backend\smoke_test.py
```

The smoke test verifies registration, profile update, password protection, certificate upload, certificate listing, and the public profile page.
