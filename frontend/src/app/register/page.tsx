"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { googleAuth, registerUser } from "@/lib/api";
import { saveSession } from "@/lib/session";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await registerUser(form);
      saveSession({ token: response.access_token, user: response.user });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account");
    } finally {
      setBusy(false);
    }
  }

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleBusy(true);
      setError("");
      try {
        const response = await googleAuth({ credential: tokenResponse.access_token });
        saveSession({ token: response.access_token, user: response.user });
        router.replace("/dashboard");
      } catch (googleError) {
        setError(googleError instanceof Error ? googleError.message : "Google sign-up failed");
      } finally {
        setGoogleBusy(false);
      }
    },
    onError: () => {
      setError("Google sign-up was cancelled or failed. Please try again.");
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

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          {/* Left panel – hero */}
          <section className="panel hidden lg:flex flex-col justify-between">
            <div>
              <p className="eyebrow">Create your public vault</p>
              <h1 className="mt-5 font-serif text-4xl xl:text-5xl leading-tight text-ink">
                Build a portfolio link that proves what you&apos;ve already learned.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate">
                Start with your profile, add certificates, and publish a clean page that recruiters
                can scan in minutes.
              </p>
            </div>

            {/* Steps */}
            <div className="mt-8 space-y-3">
              {[
                { step: "01", text: "Create your free account" },
                { step: "02", text: "Upload your certificates" },
                { step: "03", text: "Share your portfolio link" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 rounded-xl bg-accent-light/30 px-4 py-3">
                  <span className="font-mono text-sm font-bold text-sun">{item.step}</span>
                  <span className="text-sm font-medium text-ink">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Right panel – form */}
          <section className="panel">
            <p className="eyebrow">Get started</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-ink">Create account</h2>
            <p className="mt-1 text-sm text-slate">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-sun hover:text-accent-dark transition-colors">
                Sign in
              </Link>
            </p>

            {/* Google Sign-Up */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleGoogleSignUp()}
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
                    Signing up with Google...
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
              <span className="text-xs font-medium text-slate">or register with email</span>
              <div className="h-px flex-1 bg-border-light" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="name">Full name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    placeholder="Alex Johnson"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="username">Username</label>
                  <input
                    id="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="input"
                    placeholder="alex-johnson"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="alex@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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
                {busy ? "Creating account..." : "Create account"}
              </button>

              <p className="text-xs text-slate text-center">
                By creating an account you agree to our{" "}
                <span className="font-medium text-ink">Terms of Service</span> and{" "}
                <span className="font-medium text-ink">Privacy Policy</span>.
              </p>
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
