"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#123c2f] text-lg font-bold text-[#f6c15b]">
            R
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-[#6d6254]">Join Rickshare to share rides</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fbf7ef] p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">
              Name
              <input name="name" required className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Rahim" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Email
              <input name="email" type="email" required className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="rahim@example.com" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Password
              <input name="password" type="password" required minLength={6} className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Min 6 characters" />
            </label>
          </div>
          <button
            className="mt-5 w-full rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6d6254]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#123c2f] underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
