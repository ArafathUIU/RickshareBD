"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
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
    const password = String(formData.get("password") || "");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-700">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-[#123c2f] underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fbf7ef] p-6">
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-xl bg-[#e6f3ec] px-4 py-3 text-sm font-semibold text-[#123c2f]">{success}</div>}
      <label className="grid gap-1.5 text-sm font-semibold">
        New password
        <input name="password" type="password" required minLength={6} className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Min 6 characters" />
      </label>
      <button className="mt-5 w-full rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60" type="submit" disabled={loading}>
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#123c2f] text-lg font-bold text-[#f6c15b]">
            R
          </div>
          <h1 className="text-2xl font-bold">New password</h1>
        </div>
        <Suspense fallback={<p className="text-center text-sm text-[#6d6254]">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
