"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CertificateCard } from "@/components/certificate-card";
import { EmptyState } from "@/components/empty-state";
import { deleteCertificate, getCertificates } from "@/lib/api";
import { loadSession } from "@/lib/session";
import { Certificate } from "@/lib/types";

export default function DashboardPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [publicPath, setPublicPath] = useState("");

  useEffect(() => {
    async function loadCertificates() {
      const currentSession = loadSession();
      if (!currentSession) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCertificates(currentSession.token);
        setCertificates(response.certificates);
        setPublicPath(`/${currentSession.user.username}`);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load certificates");
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  async function handleDelete(certificateId: number) {
    const currentSession = loadSession();
    if (!currentSession) {
      return;
    }

    setBusyId(certificateId);
    setError("");

    try {
      await deleteCertificate(currentSession.token, certificateId);
      setCertificates((currentItems) =>
        currentItems.filter((certificate) => certificate.id !== certificateId),
      );
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete certificate");
    } finally {
      setBusyId(null);
    }
  }

  const publicCount = certificates.filter((certificate) => certificate.visibility === "public").length;
  const privateCount = certificates.length - publicCount;
  const categoryCount = new Set(certificates.map((certificate) => certificate.category)).size;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#18242b,#335063)] px-6 py-7 text-cloud">
        <p className="eyebrow !text-cloud/70">Dashboard</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Your certificate vault</h1>
            <p className="mt-3 max-w-2xl text-cloud/78">
              Upload credentials, keep private items hidden, and maintain a public portfolio that
              stays ready for applications.
            </p>
          </div>
          <Link href="/dashboard/add" className="button-primary bg-cloud text-ink hover:bg-[#fff2d8]">
            Add new certificate
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total certificates", value: certificates.length.toString().padStart(2, "0") },
          { label: "Public", value: publicCount.toString().padStart(2, "0") },
          { label: "Categories", value: categoryCount.toString().padStart(2, "0") },
        ].map((item) => (
          <div key={item.label} className="rounded-[28px] border border-white/60 bg-white/56 p-5">
            <p className="eyebrow">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-ink">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/42 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Certificates</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Uploaded credentials</h2>
          </div>
          {publicPath ? (
            <a
              href={publicPath}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              Preview public page
            </a>
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-rose-700">{error}</p> : null}

        {loading ? (
          <div className="mt-8 rounded-[28px] border border-white/60 bg-white/56 px-6 py-10 text-center text-slate">
            Loading certificates...
          </div>
        ) : certificates.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Start with your first upload"
              description="Add a course, workshop, or certification file to begin building your public portfolio."
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 xl:grid-cols-2 card-container">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDelete={handleDelete}
                busy={busyId === certificate.id}
              />
            ))}
          </div>
        )}

        {certificates.length > 0 ? (
          <p className="mt-5 text-sm text-slate">
            Private certificates stay visible in your dashboard but are hidden from the public
            profile. Current private count: {privateCount}.
          </p>
        ) : null}
      </section>
    </div>
  );
}
