# Deploy CertiVault to Vercel (Frontend + Backend)

Both the frontend (Next.js) and backend (Flask) deploy as separate Vercel projects.

---

## Step 1 — Supabase (Database)

1. Go to [supabase.com](https://supabase.com) → **New project**
2. After it provisions, go to **Settings → Database**
3. Copy the **Connection string (URI)** — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Also copy from **Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2 — Deploy the Backend

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repo, set **Root Directory** to `backend`
4. Framework preset: **Other**
5. Add these **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `SECRET_KEY` | any long random string |
   | `JWT_SECRET_KEY` | another long random string |
   | `DATABASE_URL` | your Supabase connection string from Step 1 |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` *(update after Step 3)* |
   | `GOOGLE_CLIENT_ID` | `122819830627-dst4jjn14nc2noqen0561mmvk4144336.apps.googleusercontent.com` |

6. Click **Deploy**
7. Copy your backend URL — e.g. `https://certivault-api.vercel.app`

---

## Step 3 — Deploy the Frontend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the same repo, set **Root Directory** to `frontend`
3. Framework preset: **Next.js** (auto-detected)
4. Add these **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | your backend URL from Step 2 |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `122819830627-dst4jjn14nc2noqen0561mmvk4144336.apps.googleusercontent.com` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://pmtxulbkpesghdvayuoc.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_bjLmS2jzYa8hOY4Tw9k57g_3KtVcINFa` |

5. Click **Deploy**
6. Copy your frontend URL — e.g. `https://certivault.vercel.app`

---

## Step 4 — Update Backend FRONTEND_URL

1. Go to your **backend** Vercel project → **Settings → Environment Variables**
2. Update `FRONTEND_URL` to your actual frontend URL from Step 3
3. **Redeploy** the backend (Deployments → ⋯ → Redeploy)

---

## Step 5 — Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → Credentials** → click your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   https://certivault.vercel.app
   ```
   *(replace with your actual frontend URL)*
4. Save

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env        # fill in your values
pip install -r requirements.txt
python run.py               # runs on http://localhost:5000

# Frontend
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev                 # runs on http://localhost:3000
```

---

## Notes on File Uploads

Vercel's serverless functions use an **ephemeral filesystem** — uploaded files saved to `/tmp` are lost between requests. For production, you should store uploads in an external service like:

- **Supabase Storage** (free tier available)
- **Cloudinary**
- **AWS S3**

For now, uploads work fine locally and will work on Vercel within a single request, but files won't persist between deployments. This is a known limitation of serverless backends.
