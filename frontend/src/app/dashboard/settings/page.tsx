"use client";

import { FormEvent, useEffect, useState } from "react";

import { getCurrentUser, updateCurrentUser } from "@/lib/api";
import { loadSession, saveSession } from "@/lib/session";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    skills: "",
    profile_image: "",
    linkedin: "",
    github: "",
    portfolio_password: "",
  });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const session = loadSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(session.token);
        const user = response.user;
        setForm({
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          skills: user.skills.join(", "),
          profile_image: user.profile_image,
          linkedin: user.social_links.linkedin,
          github: user.social_links.github,
          portfolio_password: "",
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = loadSession();
    if (!session) {
      setError("You need to sign in again.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await updateCurrentUser(session.token, {
        name: form.name,
        username: form.username,
        email: form.email,
        bio: form.bio,
        skills: form.skills.split(",").map((skill) => skill.trim()),
        profile_image: form.profile_image,
        social_links: {
          linkedin: form.linkedin,
          github: form.github,
        },
        portfolio_password: form.portfolio_password,
      });

      saveSession({
        token: session.token,
        user: response.user,
      });
      setMessage("Profile updated successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update profile");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-white/60 bg-white/56 px-6 py-10 text-center text-slate">
        Loading profile settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#18242b,#365464)] px-6 py-7 text-cloud">
        <p className="eyebrow !text-cloud/70">Settings</p>
        <h1 className="mt-4 text-4xl font-semibold">Profile and sharing controls</h1>
        <p className="mt-3 max-w-2xl text-cloud/78">
          Update your public bio, attach social links, and optionally password-protect the entire
          portfolio page.
        </p>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/44 p-6">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="profileImage">
              Profile image URL
            </label>
            <input
              id="profileImage"
              className="input"
              value={form.profile_image}
              onChange={(event) => setForm({ ...form, profile_image: event.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="textarea"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              placeholder="Tell visitors what you specialize in."
            />
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="skills">
              Skills
            </label>
            <input
              id="skills"
              className="input"
              value={form.skills}
              onChange={(event) => setForm({ ...form, skills: event.target.value })}
              placeholder="React, Python, Data Analysis"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="linkedin">
              LinkedIn
            </label>
            <input
              id="linkedin"
              className="input"
              value={form.linkedin}
              onChange={(event) => setForm({ ...form, linkedin: event.target.value })}
              placeholder="linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="github">
              GitHub
            </label>
            <input
              id="github"
              className="input"
              value={form.github}
              onChange={(event) => setForm({ ...form, github: event.target.value })}
              placeholder="github.com/username"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="password">
              Portfolio password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={form.portfolio_password}
              onChange={(event) => setForm({ ...form, portfolio_password: event.target.value })}
              placeholder="Leave blank to keep portfolio open"
            />
          </div>

          {message ? <p className="lg:col-span-2 text-sm font-medium text-emerald-700">{message}</p> : null}
          {error ? <p className="lg:col-span-2 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="lg:col-span-2">
            <button type="submit" disabled={busy} className="button-primary">
              {busy ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
