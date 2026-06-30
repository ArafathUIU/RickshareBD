"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Ride {
  id: string;
  pickup: string;
  destination: string;
  startTime: string;
  totalFare: number;
  status: string;
  createdAt: string;
  joinRequests?: { id: string; status: string }[];
}

export default function MyRidesPage() {
  const router = useRouter();
  const [postedRides, setPostedRides] = useState<Ride[]>([]);
  const [joinedRides, setJoinedRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/my-rides")
      .then((res) => res.json())
      .then((data) => {
        if (data.postedRides) setPostedRides(data.postedRides);
        if (data.joinedRides) setJoinedRides(data.joinedRides);
        else router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDelete(rideId: string) {
    if (!confirm("Are you sure you want to delete this ride?")) return;
    setDeletingId(rideId);

    const res = await fetch(`/api/rides/${rideId}`, { method: "DELETE" });
    if (res.ok) {
      setPostedRides((prev) => prev.filter((r) => r.id !== rideId));
    } else {
      alert("Failed to delete ride.");
    }
    setDeletingId(null);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-[#123c2f] border-t-transparent" />
          <p className="text-sm text-[#6d6254]">Loading your rides...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Rides</h1>
          <p className="mt-1 text-sm text-[#6d6254]">Manage rides you posted and joined</p>
        </div>

        {/* Posted Rides */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Posted Rides</h2>
          {postedRides.length === 0 ? (
            <div className="rounded-2xl bg-[#fbf7ef] p-6 text-center">
              <p className="text-sm text-[#6d6254]">You haven&apos;t posted any rides yet.</p>
              <Link href="/post-ride" className="mt-3 inline-block rounded-full bg-[#123c2f] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110">
                Post a ride
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {postedRides.map((ride) => (
                <div key={ride.id} className="rounded-2xl bg-[#fbf7ef] p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{ride.pickup} → {ride.destination}</p>
                    <p className="text-xs text-[#6d6254] mt-1">{ride.startTime} • {ride.totalFare}৳ • {ride.status}</p>
                    {ride.joinRequests && ride.joinRequests.length > 0 && (
                      <p className="text-xs text-[#1f6b52] mt-1 font-medium">{ride.joinRequests.length} request(s)</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/rides/${ride.id}`} className="rounded-full bg-[#f6c15b] px-4 py-2 text-xs font-bold text-[#123c2f] transition hover:brightness-105">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(ride.id)}
                      disabled={deletingId === ride.id}
                      className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      {deletingId === ride.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Joined Rides */}
        <section>
          <h2 className="text-xl font-bold mb-4">Joined Rides</h2>
          {joinedRides.length === 0 ? (
            <div className="rounded-2xl bg-[#fbf7ef] p-6 text-center">
              <p className="text-sm text-[#6d6254]">You haven&apos;t joined any rides yet.</p>
              <Link href="/rides" className="mt-3 inline-block rounded-full bg-[#123c2f] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110">
                Browse rides
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {joinedRides.map((ride) => (
                <div key={ride.id} className="rounded-2xl bg-[#fbf7ef] p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{ride.pickup} → {ride.destination}</p>
                    <p className="text-xs text-[#6d6254] mt-1">{ride.startTime} • {ride.totalFare}৳</p>
                    <p className="text-xs text-[#1f6b52] mt-1 font-medium">
                      Request status: {ride.joinRequests?.[0]?.status ?? "unknown"}
                    </p>
                  </div>
                  <Link href={`/rides/${ride.id}`} className="rounded-full bg-[#f6c15b] px-4 py-2 text-xs font-bold text-[#123c2f] transition hover:brightness-105">
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
