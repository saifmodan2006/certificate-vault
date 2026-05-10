import { Certificate } from "@/lib/types";
import { formatDate } from "@/lib/formatters";

type CertificateCardProps = {
  certificate: Certificate;
  onDelete?: (id: number) => void;
  busy?: boolean;
  showVisibility?: boolean;
};

export function CertificateCard({
  certificate,
  onDelete,
  busy = false,
  showVisibility = true,
}: CertificateCardProps) {
  return (
    <article className="panel flex h-full flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-100 cursor-pointer">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="space-y-2 min-w-0">
          <span className="badge">{certificate.category}</span>
          <h3 className="text-lg sm:text-xl font-semibold text-ink line-clamp-2">{certificate.title}</h3>
          <p className="text-xs sm:text-sm text-slate line-clamp-1">{certificate.issuer}</p>
        </div>
        {showVisibility ? (
          <span
            className={`rounded-lg px-2 sm:px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] transition-all whitespace-nowrap flex-shrink-0 ${
              certificate.visibility === "public"
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {certificate.visibility}
          </span>
        ) : null}
      </div>

      <dl className="grid gap-2 sm:gap-3 text-xs sm:text-sm text-slate sm:grid-cols-2">
        <div>
          <dt className="eyebrow text-xs">Issued</dt>
          <dd className="mt-1 text-sm sm:text-base text-ink font-medium">{formatDate(certificate.issue_date)}</dd>
        </div>
        <div className="overflow-hidden">
          <dt className="eyebrow text-xs">Credential ID</dt>
          <dd className="mt-1 text-sm sm:text-base text-ink font-medium truncate">
            {certificate.credential_id || "Not provided"}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2 sm:gap-3">
        <a
          href={certificate.file_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold leading-none transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#6366f1", color: "#ffffff" }}
        >
          View
        </a>
        <a
          href={certificate.file_url}
          download
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold leading-none border transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#eef2ff", color: "#4338ca", borderColor: "#c7d2fe" }}
        >
          Download
        </a>
        {certificate.credential_url ? (
          <a
            href={certificate.credential_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold leading-none border transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#f8fafc", color: "#334155", borderColor: "#cbd5e1" }}
          >
            Verify
          </a>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(certificate.id)}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold leading-none border transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#fff1f2", color: "#dc2626", borderColor: "#fecaca" }}
          >
            {busy ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
