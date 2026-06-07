"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; rating: number; safetyTag: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      name: String(formData.get("name") || ""),
      safetyTag: String(formData.get("safetyTag") || ""),
    };

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setMessage("Profile updated successfully.");
    } else {
      setMessage(data.message || "Failed to update profile.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-[#6d6254]">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#123c2f] text-lg font-bold text-[#f6c15b]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">Your profile</h1>
          <p className="mt-1 text-sm text-[#6d6254]">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fbf7ef] p-6">
          {message && (
            <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${message.includes("success") ? "bg-[#e6f3ec] text-[#123c2f]" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">
              Name
              <input name="name" defaultValue={user.name} required className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Trust signal
              <input name="safetyTag" defaultValue={user.safetyTag} className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="e.g. Phone verified" />
            </label>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold text-[#9a8c77]">Rating</p>
              <p className="mt-1 text-lg font-bold">{user.rating} / 5</p>
            </div>
          </div>
          <button
            className="mt-5 w-full rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-semibold text-[#123c2f] underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
