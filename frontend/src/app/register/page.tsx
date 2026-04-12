"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { registerUser } from "@/lib/api";
import { saveSession } from "@/lib/session";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await registerUser(form);
      saveSession({
        token: response.access_token,
        user: response.user,
      });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <div className="grid w-full max-w-6xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel hidden lg:block">
          <p className="eyebrow">Create your public vault</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">
            Build a portfolio link that proves what you have already learned.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate">
            Start with your profile, add certificates, and publish a clean page that recruiters can
            scan in minutes.
          </p>
        </section>

        <section className="panel transition-all duration-500 hover:shadow-lg">
          <p className="eyebrow">Get started</p>
          <h2 className="mt-4 text-3xl font-semibold text-ink">Create account</h2>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="animate-[fadeIn_0.5s_ease-out_0.1s_both]">
              <label className="field-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="input"
                placeholder="Sahil Kumar"
                required
              />
            </div>
            <div className="animate-[fadeIn_0.5s_ease-out_0.15s_both]">
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                className="input"
                placeholder="sahil-kumar"
                required
              />
            </div>
            <div className="animate-[fadeIn_0.5s_ease-out_0.2s_both]">
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="input"
                placeholder="sahil@example.com"
                required
              />
            </div>
            <div className="animate-[fadeIn_0.5s_ease-out_0.25s_both]">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="input"
                placeholder="Create a strong password"
                required
              />
            </div>

            {error ? <p className="text-sm font-medium text-rose-700 animate-[slideInUp_0.3s_ease-out]">{error}</p> : null}

            <button type="submit" disabled={busy} className="button-primary w-full">
              {busy ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate">
            Already have an account?
            <Link href="/login" className="ml-2 font-semibold text-ink transition-colors hover:text-sun">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
