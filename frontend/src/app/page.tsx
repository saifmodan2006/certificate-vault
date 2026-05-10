import Link from "next/link";

const features = [
  {
    icon: "🗂️",
    title: "Profile-first showcase",
    description:
      "Curate your name, bio, skills, and social links in a single portfolio header that feels recruiter-ready.",
  },
  {
    icon: "🔒",
    title: "Certificate control",
    description:
      "Upload PDF or image certificates, tag them by category, and keep sensitive items private until you're ready to share.",
  },
  {
    icon: "🔗",
    title: "Resume-ready sharing",
    description:
      "Generate a clean public profile URL with QR code support so your achievements travel from LinkedIn to your CV.",
  },
];

const showcase = [
  { title: "Machine Learning Specialization", issuer: "Coursera", accent: "from-indigo-500 to-purple-600" },
  { title: "Full-Stack React Bootcamp", issuer: "Udemy", accent: "from-blue-500 to-indigo-500" },
  { title: "Data Visualization Workshop", issuer: "Google", accent: "from-violet-500 to-pink-500" },
];

const steps = [
  "Add certificate metadata, upload the file, and tag the category.",
  "Control visibility per certificate and optionally lock the full portfolio.",
  "Share a recruiter-friendly profile page with download and verification links.",
];

export default function Home() {
  return (
    <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="panel relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          {/* Gradient accent */}
          <div className="absolute inset-y-0 right-0 hidden w-[40%] rounded-l-[48px] bg-gradient-to-br from-indigo-600 to-blue-700 lg:block" />

          <header className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left copy */}
            <div className="max-w-2xl space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-accent-light/60 px-4 py-2 text-xs font-semibold text-sun border border-sun/20">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sun text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  CV
                </span>
                Certificate portfolio platform
              </div>

              <div className="space-y-4">
                <p className="eyebrow">Own every credential</p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-ink">
                  A polished certificate vault you can share in one link.
                </h1>
                <p className="text-base sm:text-lg leading-8 text-slate">
                  CertiVault turns scattered PDFs, course completions, and workshop badges into a
                  clean public portfolio built for resumes, interviews, and personal branding.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold leading-none transition-all hover:opacity-90 active:scale-95 text-center"
                  style={{ backgroundColor: "#6366f1", color: "#ffffff" }}
                >
                  Create your vault — it&apos;s free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold leading-none border transition-all hover:opacity-90 active:scale-95 text-center"
                  style={{ backgroundColor: "#eef2ff", color: "#4338ca", borderColor: "#c7d2fe" }}
                >
                  Sign in
                </Link>
              </div>

              {/* Feature cards */}
              <div className="grid gap-3 sm:grid-cols-3 card-container pt-2">
                {features.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-sun/10 bg-accent-light/20 hover:bg-accent-light/35 p-4 transition-all duration-300 hover:scale-[1.02] cursor-default"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <p className="mt-2 text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1.5 text-xs leading-6 text-slate">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – mock portfolio card */}
            <div className="relative z-10 w-full lg:w-[38%] lg:pt-2">
              <div className="rounded-3xl bg-gradient-to-br from-white to-accent-light/30 p-4 sm:p-5 shadow-2xl border border-white/70">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div>
                    <p className="eyebrow text-[10px]">Public profile</p>
                    <p className="mt-1 text-sm font-semibold text-ink">certivault.app/your-name</p>
                  </div>
                  <span className="badge text-[10px]">Live</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {showcase.map((item) => (
                    <div key={item.title} className="rounded-2xl bg-white p-3 shadow-sm">
                      <div className={`rounded-xl bg-gradient-to-br ${item.accent} p-4 text-white`}>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                          Featured credential
                        </p>
                        <h2 className="mt-2 text-base sm:text-lg font-semibold leading-snug line-clamp-2">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-xs text-white/75">{item.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>
        </section>

        {/* ── How it works + CTA ───────────────────────────── */}
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-ink">
              From upload to public portfolio in three clean steps.
            </h2>
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className="rounded-2xl border border-sun/10 bg-accent-light/10 hover:bg-accent-light/20 p-4 sm:p-5 transition-all"
                >
                  <p className="font-mono text-sm font-bold text-sun">0{i + 1}</p>
                  <p className="mt-3 text-sm leading-7 text-ink">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
            <p className="eyebrow !text-white/70">Built for interviews</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl leading-snug">
              Replace scattered attachments with one memorable proof-of-work hub.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-7 text-white/80">
              Highlight technical courses, workshops, hackathon wins, and verified credentials in a
              single place that stays easy to update.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["PDFs + Images", "Private toggle", "QR sharing", "Resume link", "Google sign-in"].map(
                (tag) => (
                  <span
                    key={tag}
                    style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 transition-all"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
            <Link
              href="/register"
              style={{ color: "#4338ca" }}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold shadow-lg hover:bg-indigo-50 transition-all hover:-translate-y-0.5"
            >
              Get started free →
            </Link>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="flex flex-col items-center gap-2 py-6 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[9px] font-bold uppercase tracking-[0.2em] text-cloud">
              CV
            </span>
            <span className="text-sm font-semibold text-ink">CertiVault</span>
          </div>
          <p className="text-xs text-slate">
            © {new Date().getFullYear()} CertiVault. Built for learners everywhere.
          </p>
          <div className="flex gap-4 text-xs text-slate">
            <Link href="/register" className="hover:text-sun transition-colors">Sign up</Link>
            <Link href="/login" className="hover:text-sun transition-colors">Sign in</Link>
          </div>
        </footer>

      </div>
    </main>
  );
}
