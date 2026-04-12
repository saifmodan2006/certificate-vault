"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { addCertificate } from "@/lib/api";
import { loadSession } from "@/lib/session";

const categories = [
  "Programming",
  "Data Science",
  "Workshop",
  "Cloud",
  "Design",
  "Others",
];

export default function AddCertificatePage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    credential_id: "",
    credential_url: "",
    category: "Programming",
    visibility: "public",
  });
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = loadSession();
    if (!session) {
      setError("You need to sign in again.");
      return;
    }

    if (!file) {
      setError("Please choose a certificate file.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("issuer", form.issuer);
      formData.append("issue_date", form.issue_date);
      formData.append("credential_id", form.credential_id);
      formData.append("credential_url", form.credential_url);
      formData.append("category", form.category);
      formData.append("visibility", form.visibility);
      formData.append("file", file);

      await addCertificate(session.token, formData);
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to upload certificate");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#f5a31b,#f3c56f)] px-6 py-7 text-ink">
        <p className="eyebrow !text-ink/70">New certificate</p>
        <h1 className="mt-4 text-4xl font-semibold">Add a credential to your vault</h1>
        <p className="mt-3 max-w-2xl text-ink/70">
          Upload a PDF or image, attach the issuing organization, and choose whether it should be
          visible on your public portfolio.
        </p>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/44 p-6">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="title">
              Certificate title
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="input"
              placeholder="Machine Learning Specialization"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="issuer">
              Issuing organization
            </label>
            <input
              id="issuer"
              value={form.issuer}
              onChange={(event) => setForm({ ...form, issuer: event.target.value })}
              className="input"
              placeholder="Coursera"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="issueDate">
              Issue date
            </label>
            <input
              id="issueDate"
              type="date"
              value={form.issue_date}
              onChange={(event) => setForm({ ...form, issue_date: event.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="credentialId">
              Credential ID
            </label>
            <input
              id="credentialId"
              value={form.credential_id}
              onChange={(event) => setForm({ ...form, credential_id: event.target.value })}
              className="input"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="credentialUrl">
              Credential URL
            </label>
            <input
              id="credentialUrl"
              value={form.credential_url}
              onChange={(event) => setForm({ ...form, credential_url: event.target.value })}
              className="input"
              placeholder="https://credential.example.com"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="visibility">
              Visibility
            </label>
            <select
              id="visibility"
              value={form.visibility}
              onChange={(event) => setForm({ ...form, visibility: event.target.value })}
              className="select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="file">
              Upload certificate
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="input"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              required
            />
          </div>

          {error ? <p className="lg:col-span-2 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={busy} className="button-primary">
              {busy ? "Uploading..." : "Upload certificate"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
