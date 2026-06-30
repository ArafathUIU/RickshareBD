"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-[#6d6254]">Log in to your Rickshare account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fbf7ef] p-6">
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">
              Email
              <input name="email" type="email" required className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="rahim@example.com" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Password
              <input name="password" type="password" required className="rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Your password" />
            </label>
          </div>
          <button
            className="mt-5 w-full rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="font-semibold text-[#123c2f] underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-[#6d6254]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#123c2f] underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-[#6d6254]">Loading...</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
