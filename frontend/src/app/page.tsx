import Link from "next/link";

const featureRows = [
  {
    title: "Profile-first showcase",
    description:
      "Curate your name, bio, skills, and social links in a single portfolio header that feels recruiter-ready.",
  },
  {
    title: "Certificate control",
    description:
      "Upload PDF or image certificates, tag them by category, and keep sensitive items private until you are ready to share.",
  },
  {
    title: "Resume-ready sharing",
    description:
      "Generate a clean public profile URL with QR code support so your achievements travel from LinkedIn to your CV.",
  },
];

const showcase = [
  {
    title: "Machine Learning Specialization",
    issuer: "Coursera",
    accent: "from-indigo-500 to-purple-500",
  },
  {
    title: "Full-Stack React Bootcamp",
    issuer: "Udemy",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    title: "Data Visualization Workshop",
    issuer: "Google",
    accent: "from-purple-400 to-pink-500",
  },
];

export default function Home() {
  return (
    <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <section className="panel relative overflow-hidden px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] rounded-l-[40px] bg-gradient-to-br from-indigo-600 to-blue-700 lg:block opacity-90" />
          <header className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-full bg-accent-light/50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-sun border border-sun/20">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-sun text-xs uppercase tracking-[0.2em] font-bold text-white">
                  CV
                </span>
                <span className="hidden sm:inline">Certificate portfolio platform</span>
                <span className="sm:hidden">Cert portfolio</span>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <p className="eyebrow text-xs sm:text-sm">Own every credential</p>
                <h1 className="max-w-3xl font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight sm:leading-[1.08] lg:leading-[1.02] text-ink">
                  A polished certificate vault you can share in one link.
                </h1>
                <p className="max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-slate">
                  CertiVault turns scattered PDFs, course completions, and workshop badges into a clean public portfolio built for resumes, interviews, and personal branding.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Link href="/register" className="button-primary">
                  Create your vault
                </Link>
                <Link href="/login" className="button-secondary">
                  Sign in
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 card-container pt-4 sm:pt-6">
                {featureRows.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg sm:rounded-[26px] border border-sun/10 bg-accent-light/20 hover:bg-accent-light/30 p-4 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <p className="text-sm sm:text-base font-semibold text-ink">{item.title}</p>
                    <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 lg:w-[36%]">
              <div className="rounded-2xl sm:rounded-[34px] bg-gradient-to-br from-white to-accent-light/30 p-4 sm:p-5 shadow-lg sm:shadow-[0_28px_70px_rgba(15,23,42,0.1)] border border-white/60">
                <div className="flex items-center justify-between rounded-xl sm:rounded-[24px] bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                  <div>
                    <p className="eyebrow text-xs">Public profile</p>
                    <p className="mt-1 sm:mt-2 text-base sm:text-xl font-semibold text-ink truncate">certivault.com/saif-modan</p>
                  </div>
                  <span className="badge text-xs">Live</span>
                </div>

                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  {showcase.map((item) => (
                    <div key={item.title} className="rounded-lg sm:rounded-[28px] bg-white p-3 sm:p-4 shadow-sm">
                      <div
                        className={`rounded-lg sm:rounded-[22px] bg-gradient-to-br ${item.accent} p-4 text-white`}
                      >
                        <p className="eyebrow !text-white/80 text-xs">Featured credential</p>
                        <h2 className="mt-2 sm:mt-3 text-lg sm:text-2xl font-semibold line-clamp-2">{item.title}</h2>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80">{item.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>
        </section>

        <section className="grid gap-3 sm:gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel">
            <p className="eyebrow text-xs sm:text-sm">How it works</p>
            <h2 className="mt-3 sm:mt-4 max-w-xl font-serif text-3xl sm:text-4xl text-ink">
              From upload to public portfolio in three clean steps.
            </h2>
            <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
              {[
                "Add certificate metadata, upload the file, and tag the category.",
                "Control visibility per certificate and optionally lock the full portfolio.",
                "Share a recruiter-friendly profile page with download and verification links.",
              ].map((step, index) => (
                <div key={step} className="rounded-lg sm:rounded-[28px] border border-sun/10 bg-accent-light/10 hover:bg-accent-light/20 p-4 sm:p-5 transition-all">
                  <p className="font-mono text-xs sm:text-sm text-sun font-bold">0{index + 1}</p>
                  <p className="mt-3 text-sm sm:text-base leading-6 sm:leading-8 text-ink">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
            <p className="eyebrow !text-white/70 text-xs sm:text-sm">Built for interviews</p>
            <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-serif">
              Replace scattered attachments with one memorable proof-of-work hub.
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-6 sm:leading-8 text-white/85">
              Highlight technical courses, workshops, hackathon wins, and verified credentials in a single place that stays easy to update.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              <span className="rounded-full sm:rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all">
                PDFs + Images
              </span>
              <span className="rounded-full sm:rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all">
                Private toggle
              </span>
              <span className="rounded-full sm:rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all">
                QR sharing
              </span>
              <span className="rounded-full sm:rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all">
                Resume link
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
