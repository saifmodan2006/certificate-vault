"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { clearSession, loadSession, Session, sessionEventName } from "@/lib/session";

type DashboardShellProps = {
  children: ReactNode;
};

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/add",
    label: "Add Certificate",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      const current = loadSession();
      setSession(current);
      if (!current) router.replace("/login");
    };
    syncSession();
    window.addEventListener(sessionEventName, syncSession);
    return () => window.removeEventListener(sessionEventName, syncSession);
  }, [router]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="panel max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cloud">CV</span>
          </div>
          <p className="eyebrow">Loading workspace</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink">Preparing your vault…</h1>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const publicLink =
    typeof window !== "undefined" ? `${window.location.origin}/${session.user.username}` : "";

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Mobile top bar ─────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur-sm shadow-sm lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-[9px] font-bold uppercase tracking-[0.25em] text-cloud">
              CV
            </span>
            <span className="text-sm font-semibold text-ink">CertiVault</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* User avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ink to-blue-900 text-xs font-semibold text-cloud overflow-hidden">
              {session.user.profile_image ? (
                <Image
                  src={session.user.profile_image}
                  alt={session.user.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(session.user.name)
              )}
            </div>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-white text-slate hover:bg-accent-light/30 transition-colors"
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile nav drawer ──────────────────────────── */}
        {mobileNavOpen && (
          <div className="mb-3 rounded-2xl border border-white/60 bg-white/90 backdrop-blur-sm shadow-lg p-4 space-y-2 lg:hidden animate-[slideInUp_0.2s_ease-out]">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-sun text-white shadow-sm"
                      : "text-slate hover:bg-accent-light/40 hover:text-sun"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border-light">
              <a
                href={publicLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate hover:bg-accent-light/40 hover:text-sun transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View public portfolio
              </a>
              <button
                type="button"
                onClick={() => { clearSession(); router.push("/"); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold leading-none transition-all hover:opacity-90"
                style={{ color: "#dc2626" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          </div>
        )}

        {/* ── Main grid ──────────────────────────────────── */}
        <div className="grid min-h-[calc(100vh-5rem)] gap-3 sm:gap-4 lg:grid-cols-[260px_1fr] lg:gap-5">

          {/* ── Sidebar ──────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-5 panel lg:sticky lg:top-4 lg:h-fit">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-[10px] font-bold uppercase tracking-[0.25em] text-cloud shadow-md group-hover:shadow-lg transition-shadow">
                CV
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate">CertiVault</p>
                <p className="text-[11px] text-slate/70">Certificate portfolio</p>
              </div>
            </Link>

            {/* User card */}
            <div className="rounded-2xl bg-gradient-to-br from-ink to-blue-900 p-4 text-cloud">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white/15 flex items-center justify-center text-sm font-semibold">
                  {session.user.profile_image ? (
                    <Image
                      src={session.user.profile_image}
                      alt={session.user.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(session.user.name)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight">{session.user.name}</p>
                  <p className="truncate text-xs text-cloud/65 mt-0.5">@{session.user.username}</p>
                </div>
              </div>
              <a
                href={publicLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cloud/20 px-3 py-2.5 text-xs font-semibold transition-all hover:bg-cloud hover:text-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open Public Portfolio
              </a>
            </div>

            {/* Nav */}
            <nav className="space-y-1" aria-label="Dashboard navigation">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      active
                        ? "bg-sun text-white shadow-sm"
                        : "text-slate hover:bg-accent-light/40 hover:text-sun"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-auto space-y-3 pt-2 border-t border-border-light">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate/60 mb-1">
                  Resume link
                </p>
                <p className="font-mono text-[11px] text-ink break-all leading-5">{publicLink}</p>
              </div>
              <button
                type="button"
                onClick={() => { clearSession(); router.push("/"); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold leading-none border transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#fff1f2", color: "#dc2626", borderColor: "#fecaca" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────── */}
          <main className="panel overflow-hidden min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
