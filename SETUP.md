# Setup Guide — CertiVault

Detailed instructions for getting CertiVault running on your machine.

## Prerequisites

**System Requirements:**
- OS: Windows, macOS, or Linux
- RAM: 2GB minimum
- Disk: 500MB free space

**Software:**
- Python 3.8 or higher → [Download](https://www.python.org/downloads/)
- Node.js 18+ → [Download](https://nodejs.org/)
- Git → [Download](https://git-scm.com/)

Verify installations:
```bash
python --version
node --version
git --version
```

## Installation by OS

### Windows Setup

**1. Clone Repository**
```powershell
git clone https://github.com/saifmodan2006/certificate-vault.git
cd certificate-vault
```

**2. Backend Setup**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python run.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

**3. Frontend Setup** (new PowerShell window)
```powershell
cd certificate-vault/frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### macOS Setup

**1. Clone Repository**
```bash
git clone https://github.com/saifmodan2006/certificate-vault.git
cd certificate-vault
```

**2. Backend Setup**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
python3 run.py
```

**3. Frontend Setup** (new terminal)
```bash
cd certificate-vault/frontend
npm install
npm run dev
```

### Linux Setup

**1. Clone Repository**
```bash
git clone https://github.com/saifmodan2006/certificate-vault.git
cd certificate-vault
```

**2. Backend Setup**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
python3 run.py
```

**3. Frontend Setup** (new terminal)
```bash
cd certificate-vault/frontend
npm install
npm run dev
```

## Environment Variables (Optional)

These override defaults if needed:

**Backend** (`backend/.env`):
```
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///certivault.db
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### Port Already in Use

**Frontend on port 3000?**
```bash
npm run dev -- --port 3100
```

**Backend on port 5000?**
Update `backend/run.py`:
```python
app.run(debug=True, port=5001)
```

### Python Version Mismatch

Ensure Python 3.8+:
```bash
python --version
```

If you have multiple versions:
```bash
python3 -m venv .venv
```

### Node Modules Issues

Clean install:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

Reset database (loses all data):
```bash
cd backend
rm certivault.db
python run.py
```

## Running Tests

**Backend Smoke Test:**
```bash
cd backend
python smoke_test.py
```

**Frontend Lint Check:**
```bash
cd frontend
npm run lint
npm run build
```

## Next Steps

1. Create an account on the login page
2. Upload a certificate
3. View your public profile at `http://localhost:3000/@yourusername`
4. Check out the dashboard settings

## Need Help?

- Check the main [README.md](../README.md)
- Open an issue on [GitHub](https://github.com/saifmodan2006/certificate-vault/issues)
- Review [CONTRIBUTING.md](../CONTRIBUTING.md)

Happy setting up! 🎉
