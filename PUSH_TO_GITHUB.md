# Pushing CertiVault to GitHub

This guide walks you through pushing the project to GitHub properly.

## Step 1: Verify .gitignore

Make sure sensitive and build files are ignored. Check [.gitignore](./.gitignore):

```
backend/.venv/
backend/__pycache__/
backend/data/
backend/uploads/
backend/*.log
backend/*.err

frontend/node_modules/
frontend/.next/
frontend/*.log
frontend/*.err

.DS_Store
```

❌ **Never commit:**
- `.venv` or `node_modules`
- `*.log` or `*.err` files
- `.env` files (use `.env.example` instead)
- IDE files (`.vscode/`, `.idea/`)
- `__pycache__` or `.next` builds

## Step 2: Clean Up Working Directory

Remove any error/log files:

```bash
# Clean backend
cd backend
rm -f *.log *.err
cd ..

# Clean frontend
cd frontend
rm -f *.log *.err
cd ..
```

## Step 3: Check Git Status

```bash
git status
```

You should NOT see:
- `.venv/` or `node_modules/`
- `*.log` or `*.err` files
- Large files
- Sensitive files

If something shouldn't be there, update `.gitignore` and run:
```bash
git rm --cached <filename>
git commit -m "Stop tracking <filename>"
```

## Step 4: Add & Commit

Add all changes:
```bash
git add .
```

Commit with a clear message:
```bash
git commit -m "docs: comprehensive README, setup guide, and contributing guidelines

- Rewrote README with compelling copy and feature highlights
- Added detailed SETUP.md for all operating systems
- Created CONTRIBUTING.md for new developers
- Added issue templates for bug reports and feature requests
- Added MIT LICENSE
- Cleaned up project structure"
```

## Step 5: Connect to GitHub (if not already connected)

Verify remote is set correctly:
```bash
git remote -v
```

Should show something like:
```
origin  https://github.com/saifmodan2006/certificate-vault.git (fetch)
origin  https://github.com/saifmodan2006/certificate-vault.git (push)
```

If not set up:
```bash
git remote add origin https://github.com/saifmodan2006/certificate-vault.git
```

## Step 6: Push to GitHub

For the first time (set upstream):
```bash
git branch -M main
git push -u origin main
```

Subsequent pushes:
```bash
git push
```

## Step 7: Verify on GitHub

Visit: https://github.com/saifmodan2006/certificate-vault

Check:
- ✅ README displays nicely
- ✅ All files present (no `.venv`, `node_modules`, logs)
- ✅ Commit history looks clean
- ✅ CONTRIBUTING.md, SETUP.md, LICENSE visible

## Step 8: Add GitHub Profile Details

Make your profile stand out:

1. **Add a Description** to your repo:
   - Go to repo settings
   - Add: "Digital certificate portfolio platform built with Next.js + Flask"

2. **Add Topics** (helps discoverability):
   - Click "Add topics"
   - Add: `portfolio`, `certificates`, `nextjs`, `flask`, `full-stack`

3. **Add a Social Preview Image**:
   - Create a 1200×630px image showing the app
   - Upload in repo settings

## Step 9: Pin This Repo to Your Profile

1. Go to your GitHub profile
2. Click "Customize your pins"
3. Add "certificate-vault"
4. Showcase it as a featured project

## Ongoing: Keep It Fresh

1. **Regular commits** show activity
2. **Active issues** encourage contributions
3. **Respond to PRs** within 48 hours
4. **Update documentation** as features change

---

**Questions?** See [CONTRIBUTING.md](./CONTRIBUTING.md) or open an issue!
