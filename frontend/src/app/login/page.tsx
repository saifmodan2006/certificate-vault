"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { loginUser } from "@/lib/api";
import { saveSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      saveSession({
        token: response.access_token,
        user: response.user,
      });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-3 py-4 sm:px-6 sm:py-6">
      <div className="grid w-full max-w-4xl gap-3 sm:gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel hidden lg:block">
          <p className="eyebrow text-xs">Back inside the vault</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl leading-tight text-ink">
            Sign in and continue curating your credentials.
          </h1>
          <p className="mt-5 max-w-lg text-base sm:text-lg leading-7 sm:leading-8 text-slate">
            Update certificates, switch visibility, and keep your public portfolio ready for the next resume or interview share.
          </p>
        </section>

        <section className="panel transition-all duration-500 hover:shadow-lg">
          <p className="eyebrow text-xs sm:text-sm">Sign in</p>
          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-semibold text-ink">Welcome back</h2>
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
            <div className="animate-[fadeIn_0.5s_ease-out_0.1s_both]">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="animate-[fadeIn_0.5s_ease-out_0.2s_both]">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            {error ? <p className="text-sm font-medium text-red-600 animate-[slideInUp_0.3s_ease-out] rounded-lg bg-red-50 px-3 py-2">{error}</p> : null}

            <button type="submit" disabled={busy} className="button-primary w-full">
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-slate">
            Need an account?
            <Link href="/register" className="ml-2 font-semibold text-sun transition-colors hover:text-accent-dark">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
