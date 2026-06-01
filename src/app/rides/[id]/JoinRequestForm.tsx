"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRequestForm({ rideId }: { rideId: string }) {
  const router = useRouter();
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

    const body = {
      requesterName: String(formData.get("requesterName") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch(`/api/rides/${rideId}/join-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Failed to send request.");
        setLoading(false);
        return;
      }

      setSuccess("Join request sent! The poster will review it.");
      form.reset();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-2.5">
      {error && (
        <div className="rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-white">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-[#f6c15b]/20 px-4 py-2.5 text-sm font-semibold text-[#f6c15b]">
          {success}
        </div>
      )}
      <input
        name="requesterName"
        required
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-white/40 focus:border-white/30 focus:ring-1 focus:ring-white/20"
        placeholder="Your name"
      />
      <textarea
        name="message"
        required
        rows={3}
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-white/40 focus:border-white/30 focus:ring-1 focus:ring-white/20"
        placeholder="Message to poster"
      />
      <button
        className="rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Join Request"}
      </button>
    </form>
  );
}
