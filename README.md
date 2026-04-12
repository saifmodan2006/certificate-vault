# CertiVault 🏆

A polished certificate vaultー where scattered PDFs, course completions, and workshop badges become a clean public portfolio built for resumes, interviews, and personal branding.

Turn your professional achievements into a shareable, stunning digital portfolio. One link. Unlimited credentials.

## Why CertiVault?

**Problem:** Most people's credentials live in scattered folders, email inboxes, or platform-specific archives. Recruiters want proof, but you're scrambling to compile everything.

**Solution:** CertiVault centralizes everything into a beautiful, password-protected portfolio that you control completely. Share a public profile link with QR code support or just the link itself. Your achievements travel from LinkedIn to your CV with style.

### Key Features

- 🎖️ **Profile-First Showcase** — Curate your name, bio, skills, and social links (LinkedIn, GitHub) in a recruiter-ready header
- 📁 **Certificate Control** — Upload PDFs or images, tag by category, keep sensitive items private until you're ready
- 🔐 **Privacy & Security** — Password-protect your entire portfolio or keep specific certificates hidden from public view
- 🔗 **Resume-Ready Sharing** — Get a clean public profile URL or generate a QR code for easy sharing
- ⚡ **Built for Speed** — Optimized frontend and efficient API for instant load times
- 📱 **Mobile Responsive** — Looks perfect on phones, tablets, and desktops

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **Backend** | Flask, Flask-SQLAlchemy, Flask-JWT-Extended |
| **Database** | SQLite |
| **File Storage** | Local uploads (easily swappable for S3/cloud) |

## Getting Started

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- Git

### Quick Setup

**1. Clone & Enter Directory**
```bash
git clone https://github.com/saifmodan2006/certificate-vault.git
cd certificate-vault
```

**2. Backend Setup**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # On macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend runs on `http://localhost:5000`

**3. Frontend Setup** (in a new terminal)
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000` (or `3100` if port 3000 is busy)

### Environment Configuration

Optional — override defaults by copying example files:
- `backend/.env.example` → `backend/.env`
- `frontend/.env.local.example` → `frontend/.env.local`

## Project Structure

```
certificate-vault/
├── backend/              # Flask API + SQLite
│   ├── certivault/       # Main application code
│   │   ├── routes.py     # API endpoints
│   │   ├── models.py     # Database models (User, Certificate)
│   │   ├── config.py     # Configuration
│   │   └── utils.py      # Helper functions
│   ├── requirements.txt   # Python dependencies
│   └── run.py            # Start server
│
├── frontend/             # Next.js React app
│   ├── src/app/          # App routes & layouts
│   ├── src/components/   # Reusable React components
│   ├── src/lib/          # API client, types, utilities
│   └── package.json      # Node dependencies
│
└── README.md
```

## API Overview

### Authentication
- `POST /auth/register` — Create new account
- `POST /auth/login` — Get JWT token

### Certificates
- `GET /api/certificates` — List user's certificates
- `POST /api/certificates` — Upload new certificate
- `PATCH /api/certificates/<id>` — Update certificate (visibility, metadata)
- `DELETE /api/certificates/<id>` — Remove certificate

### Public Profile
- `GET /profile/<username>` — View public portfolio
- `POST /profile/<username>/unlock` — Unlock password-protected portfolio

## Development Notes

- Backend uses SQLAlchemy ORM with Flask extensions
- Frontend uses server-side session management via `lib/session.ts`
- Certificates stored locally in `backend/uploads/` (designed to be modular)
- JWT tokens for secure API access

## Roadmap

- [ ] S3/cloud storage integration
- [ ] Certificate verification & authenticity badges
- [ ] Analytics (view counts, download tracking)
- [ ] Certificate templates and styling options
- [ ] Batch upload from Coursera, Udemy, LinkedIn
- [ ] Social sharing with preview cards

## Contributing

We'd love your input! Here's how:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source under the MIT License.

## Questions?

Open an issue on GitHub or reach out to [@saifmodan2006](https://github.com/saifmodan2006)

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
