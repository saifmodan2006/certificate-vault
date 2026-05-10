# Supabase + Vercel Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project** and fill in the details
3. Wait for the project to be provisioned (~2 minutes)

## 2. Get Your Supabase Credentials

In your Supabase dashboard → **Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

In **Settings → Database**:

- **Connection string (URI)** → use this as `DATABASE_URL` in your backend
  - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
  - For serverless/Vercel backend: use the **Session pooler** URL instead

## 3. Configure Frontend Environment Variables

Create `frontend/.env.local` from the example:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=122819830627-dst4jjn14nc2noqen0561mmvk4144336.apps.googleusercontent.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Configure Backend Environment Variables

Create `backend/.env` from the example:

```bash
SECRET_KEY=your-strong-secret-key
JWT_SECRET_KEY=your-strong-jwt-secret
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
GOOGLE_CLIENT_ID=122819830627-dst4jjn14nc2noqen0561mmvk4144336.apps.googleusercontent.com
```

## 5. Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Set the **Root Directory** to `frontend`
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` → your backend URL
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → already set in `vercel.json`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

## 6. Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo, set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn run:app`
5. Add environment variables (from step 4 above)
6. Deploy

## 7. Configure Google OAuth

In [Google Cloud Console](https://console.cloud.google.com):

1. Go to **APIs & Services → Credentials**
2. Find your OAuth 2.0 Client ID: `122819830627-dst4jjn14nc2noqen0561mmvk4144336`
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (development)
   - `https://your-frontend.vercel.app` (production)
4. Under **Authorized redirect URIs**, add the same URLs
5. Save

## 8. Initialize the Database

The backend auto-creates tables on first run via SQLAlchemy. For Supabase, the tables will be created automatically when the backend starts.

To verify, check your Supabase dashboard → **Table Editor** — you should see `users` and `certificates` tables.
