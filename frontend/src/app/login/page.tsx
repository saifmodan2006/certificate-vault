"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { googleAuth, loginUser } from "@/lib/api";
import { saveSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      saveSession({ token: response.access_token, user: response.user });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleBusy(true);
      setError("");
      try {
        // Exchange the access token for user info, then send to backend
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json() as {
          sub: string;
          email: string;
          name: string;
          picture: string;
        };

        const response = await googleAuth({ credential: tokenResponse.access_token });
        saveSession({ token: response.access_token, user: response.user });
        router.replace("/dashboard");
      } catch (googleError) {
        setError(googleError instanceof Error ? googleError.message : "Google sign-in failed");
      } finally {
        setGoogleBusy(false);
      }
    },
    onError: () => {
      setError("Google sign-in was cancelled or failed. Please try again.");
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-xs font-bold uppercase tracking-[0.25em] text-cloud shadow-lg group-hover:shadow-xl transition-shadow">
              CV
            </span>
            <span className="text-xl font-semibold text-ink">CertiVault</span>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          {/* Left panel – hero */}
          <section className="panel hidden lg:flex flex-col justify-between">
            <div>
              <p className="eyebrow">Back inside the vault</p>
              <h1 className="mt-5 font-serif text-4xl xl:text-5xl leading-tight text-ink">
                Sign in and continue curating your credentials.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate">
                Update certificates, switch visibility, and keep your public portfolio ready for the
                next resume or interview share.
              </p>
            </div>

            {/* Decorative card */}
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Your public profile
              </p>
              <p className="mt-2 text-lg font-semibold">certivault.app/your-username</p>
              <p className="mt-1 text-sm text-white/70">
                Share this link in your resume, LinkedIn, or anywhere.
              </p>
            </div>
          </section>

          {/* Right panel – form */}
          <section className="panel">
            <p className="eyebrow">Sign in</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-ink">Welcome back</h2>
            <p className="mt-1 text-sm text-slate">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-sun hover:text-accent-dark transition-colors">
                Create one free
              </Link>
            </p>

            {/* Google Sign-In */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={googleBusy || busy}
                className="google-btn w-full"
                aria-label="Continue with Google"
              >
                {googleBusy ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in with Google...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <GoogleIcon />
                    Continue with Google
                  </span>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-light" />
              <span className="text-xs font-medium text-slate">or sign in with email</span>
              <div className="h-px flex-1 bg-border-light" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={busy || googleBusy}
                className="w-full mt-2 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold leading-none transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#6366f1", color: "#ffffff" }}
              >
                {busy ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
