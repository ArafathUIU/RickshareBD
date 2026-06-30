"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PostRideForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      startTime: String(formData.get("startTime") || ""),
      pickup: String(formData.get("pickup") || ""),
      destination: String(formData.get("destination") || ""),
      totalFare: Number(formData.get("totalFare") || 0),
      notes: String(formData.get("notes") || ""),
      routeMatch: String(formData.get("routeMatch") || ""),
    };

    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to post ride. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Ride posted successfully!");
      router.push(`/rides/${data.ride.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#eadfce]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">
          Start time
          <input name="startTime" required className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="8:45 AM" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Total fare (taka)
          <input name="totalFare" type="number" required min={1} className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="120" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Pickup point
          <input name="pickup" required className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Dhanmondi 27, cafe gate" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Destination
          <input name="destination" required className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="University main gate" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Route match hint
          <input name="routeMatch" className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Same direction via New Market" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">
          Note for joiner
          <textarea name="notes" rows={3} className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]" placeholder="Can pick up from nearby roads." />
        </label>
      </div>
      <button
        className="mt-5 w-full rounded-full bg-[#f6c15b] py-3.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Publishing..." : "Publish Ride Post"}
      </button>
    </form>
  );
}
