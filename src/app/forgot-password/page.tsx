"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(formData.get("email") || "") }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#123c2f] text-lg font-bold text-[#f6c15b]">
            R
          </div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-1 text-sm text-[#6d6254]">We&apos;ll send you a link to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fbf7ef] p-6">
          {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-xl bg-[#e6f3ec] px-4 py-3 text-sm font-semibold text-[#123c2f]">{success}</div>}
          <label className="grid gap-1.5 text-sm font-semibold">
            Email
            <input name="email" type="email" required className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="rahim@example.com" />
          </label>
          <button className="mt-5 w-full rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6d6254]">
          Remember your password? <Link href="/login" className="font-semibold text-[#123c2f] underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
