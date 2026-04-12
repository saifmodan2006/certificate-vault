# Contributing to CertiVault

Thanks for considering contributing! We're excited to have community input on making CertiVault better.

## Ways to Contribute

- **Report bugs** — Found something broken? [Open an issue](https://github.com/saifmodan2006/certificate-vault/issues)
- **Suggest features** — Have an idea? Share it as an issue with `[FEATURE REQUEST]` tag
- **Improve documentation** — README unclear? Submit a PR
- **Build features** — Pick an issue labeled `help wanted` or propose something new
- **Code reviews** — Review open PRs and provide feedback

## Development Workflow

### 1. Setup Local Environment

```bash
git clone https://github.com/saifmodan2006/certificate-vault.git
cd certificate-vault

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Or: .\.venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive names:
- `feature/add-export-pdf` for new features
- `fix/login-redirect` for bug fixes
- `docs/update-setup-guide` for documentation

### 3. Make Your Changes

**Backend:**
- Follow PEP 8 style guide
- Add docstrings to new functions
- Test with `smoke_test.py`

**Frontend:**
- Use TypeScript for type safety
- Follow ESLint config (run `npm run lint`)
- Test responsive design on mobile

### 4. Commit with Clear Messages

```bash
git commit -m "Add feature: XYZ description"
git commit -m "Fix: XYZ issue description"
```

### 5. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub with:
- Clear title describing what changed
- Description of why (problem/solution)
- How to test it
- Any screenshots if UI changes

## Code Guidelines

### Backend (Python)
- Format: PEP 8 (use `python -m black` if available)
- Type hints encouraged for clarity
- Add tests for critical paths
- Document API changes in comments

### Frontend (TypeScript/React)
- Use functional components with hooks
- Extract reusable components to `src/components/`
- Keep types in `src/lib/types.ts`
- Test on mobile (dev tools, or actual phone)

## Testing

**Backend Testing:**
```bash
cd backend
python smoke_test.py
```

**Frontend Testing:**
```bash
cd frontend
npm run build  # Catch TypeScript errors
npm run lint   # Check code style
```

## Pull Request Checklist

Before submitting, make sure:

- [ ] Code follows project style guide
- [ ] Changes don't break existing functionality
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] No console errors or warnings (check browser dev tools)

## Questions?

- Open an issue with your question
- Check existing issues—your question might already be answered
- Reach out to [@saifmodan2006](https://github.com/saifmodan2006)

## Code of Conduct

Be kind and constructive. We welcome all backgrounds and experience levels. Harassment or discrimination isn't tolerated.

---

Happy coding! 🚀
