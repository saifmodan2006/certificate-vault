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
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/add", label: "Add Certificate" },
  { href: "/dashboard/settings", label: "Settings" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const syncSession = () => {
      const current = loadSession();
      setSession(current);
      if (!current) {
        router.replace("/login");
      }
    };

    syncSession();
    window.addEventListener(sessionEventName, syncSession);
    return () => window.removeEventListener(sessionEventName, syncSession);
  }, [router]);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="panel max-w-md text-center">
          <p className="eyebrow">Loading workspace</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Preparing your vault...</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const publicLink =
    typeof window !== "undefined" ? `${window.location.origin}/${session.user.username}` : "";

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl gap-3 sm:gap-4 lg:grid-cols-[280px_1fr] lg:gap-4">
        <aside className="panel flex flex-col gap-4 sm:gap-6 lg:sticky lg:top-4 lg:h-fit">
          <div className="space-y-3 sm:space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3">
              <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-2xl bg-ink text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cloud">
                CV
              </span>
              <div className="hidden sm:block">
                <p className="eyebrow text-xs">CertiVault</p>
                <p className="text-xs text-slate">Digital certificate portfolio</p>
              </div>
            </Link>

            <div className="rounded-xl sm:rounded-[28px] bg-gradient-to-br from-ink to-blue-900 p-3 sm:p-5 text-cloud">
              <div className="flex items-center gap-3 sm:gap-4">
                {session.user.profile_image ? (
                  <Image
                    src={session.user.profile_image}
                    alt={session.user.name}
                    width={56}
                    height={56}
                    sizes="(max-width: 640px) 48px, 56px"
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-2xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-2xl bg-[rgba(255,255,255,0.14)] text-sm sm:text-lg font-semibold flex-shrink-0">
                    {getInitials(session.user.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-semibold truncate">{session.user.name}</p>
                  <p className="text-xs sm:text-sm text-cloud/70 truncate">@{session.user.username}</p>
                </div>
              </div>

              <a
                href={publicLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 sm:mt-5 flex w-full items-center justify-center rounded-lg sm:rounded-full border border-cloud/20 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition hover:bg-cloud hover:text-ink"
              >
                Open Public Portfolio
              </a>
            </div>
          </div>

          <nav className="space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition ${
                    active
                      ? "bg-sun text-ink shadow-md"
                      : "text-slate hover:bg-accent-light/50 hover:text-sun"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-slate break-all">
              Resume link:
              <span className="mt-1 block font-mono text-[0.65rem] sm:text-xs text-ink">{publicLink}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                clearSession();
                router.push("/");
              }}
              className="button-secondary w-full text-xs sm:text-sm"
            >
              Log out
            </button>
          </div>
        </aside>

        <main className="panel overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
