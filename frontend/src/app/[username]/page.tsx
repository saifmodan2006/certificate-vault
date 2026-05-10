"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { CertificateCard } from "@/components/certificate-card";
import { EmptyState } from "@/components/empty-state";
import { getPublicPortfolio, unlockPublicPortfolio } from "@/lib/api";
import { PublicPortfolio } from "@/lib/types";

export default function PublicPortfolioPage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [requiresPassword, setRequiresPassword] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const response = await getPublicPortfolio(username);
        setPortfolio(response);
        setRequiresPassword(false);
      } catch (loadError) {
        const publicError = loadError as Error & { requiresPassword?: boolean };
        if (publicError.requiresPassword) {
          setRequiresPassword(true);
          setError("");
        } else {
          setError(loadError instanceof Error ? loadError.message : "Unable to load portfolio");
        }
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [username]);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await unlockPublicPortfolio(username, password);
      setPortfolio(response);
      setRequiresPassword(false);
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "Unable to unlock portfolio");
    } finally {
      setLoading(false);
    }
  }

  const categories =
    portfolio === null
      ? ["All"]
      : ["All", ...new Set(portfolio.certificates.map((c) => c.category))];

  const visibleCertificates =
    activeCategory === "All"
      ? portfolio?.certificates ?? []
      : (portfolio?.certificates ?? []).filter((c) => c.category === activeCategory);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading && !portfolio && !requiresPassword) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="panel max-w-sm w-full text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cloud">CV</span>
          </div>
          <p className="eyebrow">Loading portfolio</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink">Fetching public profile…</h1>
        </div>
      </main>
    );
  }

  /* ── Password gate ───────────────────────────────────────── */
  if (requiresPassword && !portfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="panel w-full max-w-md">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="eyebrow">Protected portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">@{username}</h1>
          <p className="mt-2 text-sm text-slate">
            This certificate portfolio is password-protected. Enter the access password to continue.
          </p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter portfolio password"
              required
            />
            {error ? (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            ) : null}
            <button type="submit" disabled={loading} className="button-primary w-full">
              {loading ? "Unlocking…" : "Unlock portfolio"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ── Not found ───────────────────────────────────────────── */
  if (!portfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="panel max-w-md w-full text-center">
          <p className="eyebrow">Portfolio unavailable</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink">
            {error || "This profile could not be found."}
          </h1>
          <Link href="/" className="button-primary mt-6 inline-flex">
            Go to CertiVault
          </Link>
        </div>
      </main>
    );
  }

  /* ── Portfolio ───────────────────────────────────────────── */
  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* ── Profile header ─────────────────────────────── */}
        <section className="panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left – profile info */}
            <div className="flex-1 space-y-5">
              <p className="eyebrow">Public portfolio</p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {portfolio.profile.profile_image ? (
                    <Image
                      src={portfolio.profile.profile_image}
                      alt={portfolio.profile.name}
                      width={88}
                      height={88}
                      sizes="88px"
                      className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-2xl bg-gradient-to-br from-ink to-blue-900 text-2xl font-bold text-cloud shadow-md">
                      {portfolio.profile.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name + bio */}
                <div className="min-w-0">
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-ink">
                    {portfolio.profile.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate">@{portfolio.profile.username}</p>
                  {portfolio.profile.bio ? (
                    <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-slate">
                      {portfolio.profile.bio}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Skills */}
              {portfolio.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {portfolio.profile.skills.map((skill) => (
                    <span key={skill} className="badge">{skill}</span>
                  ))}
                </div>
              )}

              {/* Social links */}
              <div className="flex flex-wrap gap-3">
                {portfolio.profile.social_links.linkedin ? (
                  <a
                    href={portfolio.profile.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary text-sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                  </a>
                ) : null}
                {portfolio.profile.social_links.github ? (
                  <a
                    href={portfolio.profile.social_links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary text-sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>

            {/* Right – QR code */}
            <aside className="w-full sm:w-auto lg:w-56 flex-shrink-0">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-cloud">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cloud/60">Share</p>
                <div className="mt-4 rounded-xl bg-white p-3">
                  {shareUrl ? (
                    <QRCodeSVG value={shareUrl} size={160} className="mx-auto block" />
                  ) : null}
                </div>
                <p className="mt-3 text-[11px] text-cloud/60 leading-5">
                  Scan to open this portfolio directly on any device.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Certificates ───────────────────────────────── */}
        <section className="rounded-2xl border border-white/60 bg-white/50 p-5 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Certificates</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-ink">
                Verified accomplishments
              </h2>
            </div>

            {/* Category filter */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                      activeCategory === category
                        ? "bg-ink text-cloud shadow-sm"
                        : "bg-white/80 text-ink hover:bg-white border border-border-light"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {visibleCertificates.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No public certificates in this category"
                description="Switch categories or come back later after more credentials are published."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 xl:grid-cols-2 card-container">
              {visibleCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  showVisibility={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="flex items-center justify-center gap-2 py-4 text-center">
          <Link href="/" className="flex items-center gap-2 text-xs text-slate hover:text-sun transition-colors">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-ink text-[7px] font-bold uppercase tracking-[0.2em] text-cloud">
              CV
            </span>
            Powered by CertiVault
          </Link>
        </footer>

      </div>
    </main>
  );
}
