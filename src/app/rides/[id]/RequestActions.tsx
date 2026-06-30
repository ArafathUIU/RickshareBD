"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RequestActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDecision(status: "accepted" | "rejected") {
    setLoading(true);
    try {
      const res = await fetch(`/api/join-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(status === "accepted" ? "Request accepted!" : "Request rejected.");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update request.");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 flex gap-2.5">
      <button
        onClick={() => handleDecision("accepted")}
        disabled={loading}
        className="rounded-full bg-[#123c2f] px-5 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        type="button"
      >
        {loading ? "..." : "Accept"}
      </button>
      <button
        onClick={() => handleDecision("rejected")}
        disabled={loading}
        className="rounded-full border border-[#eadfce] bg-white px-5 py-2 text-xs font-bold text-[#6d6254] transition hover:bg-[#fbf7ef] disabled:opacity-60"
        type="button"
      >
        {loading ? "..." : "Reject"}
      </button>
    </div>
  );
}
