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
      : ["All", ...new Set(portfolio.certificates.map((certificate) => certificate.category))];
  const visibleCertificates =
    activeCategory === "All"
      ? portfolio?.certificates ?? []
      : (portfolio?.certificates ?? []).filter(
          (certificate) => certificate.category === activeCategory,
        );
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading && !portfolio && !requiresPassword) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="panel max-w-md text-center">
          <p className="eyebrow">Loading portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Fetching public profile...</h1>
        </div>
      </main>
    );
  }

  if (requiresPassword && !portfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="panel w-full max-w-lg">
          <p className="eyebrow">Protected portfolio</p>
          <h1 className="mt-4 text-4xl font-semibold text-ink">@{username}</h1>
          <p className="mt-3 text-slate">
            This certificate portfolio is password-protected. Enter the access password to continue.
          </p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input"
              placeholder="Enter portfolio password"
              required
            />
            {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
            <button type="submit" disabled={loading} className="button-primary w-full">
              {loading ? "Unlocking..." : "Unlock portfolio"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="panel max-w-lg text-center">
          <p className="eyebrow">Portfolio unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">
            {error || "This profile could not be found."}
          </h1>
          <Link href="/" className="button-primary mt-6">
            Go to CertiVault
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <section className="panel grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <p className="eyebrow">Public portfolio</p>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {portfolio.profile.profile_image ? (
                <Image
                  src={portfolio.profile.profile_image}
                  alt={portfolio.profile.name}
                  width={96}
                  height={96}
                  sizes="96px"
                  className="h-24 w-24 rounded-[28px] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-ink text-3xl font-semibold text-cloud">
                  {portfolio.profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <h1 className="font-serif text-5xl leading-none text-ink">
                  {portfolio.profile.name}
                </h1>
                <p className="mt-3 text-lg text-slate">@{portfolio.profile.username}</p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate">
                  {portfolio.profile.bio || "A curated showcase of verified learning and milestones."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {portfolio.profile.skills.map((skill) => (
                    <span key={skill} className="badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {portfolio.profile.social_links.linkedin ? (
                <a
                  href={portfolio.profile.social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                >
                  LinkedIn
                </a>
              ) : null}
              {portfolio.profile.social_links.github ? (
                <a
                  href={portfolio.profile.social_links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>

          <aside className="rounded-[28px] bg-[linear-gradient(180deg,#18242b,#29414f)] p-5 text-cloud">
            <p className="eyebrow !text-cloud/70">Share</p>
            <div className="mt-5 rounded-[24px] bg-white p-4">
              {shareUrl ? <QRCodeSVG value={shareUrl} size={200} className="mx-auto" /> : null}
            </div>
            <p className="mt-4 text-sm text-cloud/72">Scan to open the portfolio directly.</p>
          </aside>
        </section>

        <section className="rounded-[30px] border border-white/60 bg-white/44 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Certificates</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Verified accomplishments</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category
                      ? "bg-ink text-cloud"
                      : "bg-white/70 text-ink hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {visibleCertificates.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No public certificates in this category"
                description="Switch categories or come back later after more credentials are published."
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 xl:grid-cols-2">
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
      </div>
    </main>
  );
}
