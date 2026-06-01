export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminStats, getAllRides } from "@/lib/rickshare-data";

export default async function AdminPage() {
  const stats = await getAdminStats();
  const ridePosts = await getAllRides();

  const statCards = [
    { label: "Open rides", value: stats.openRides },
    { label: "Pending requests", value: stats.joinRequests },
    { label: "Avg split fare", value: `${stats.averageSplitFare} taka` },
    { label: "Completed shares", value: stats.completedShares },
  ];

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between rounded-full bg-[#fbf7ef] px-5 py-2.5">
          <Link href="/" className="text-base font-bold">Rickshare Admin</Link>
          <Link href="/rides" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110">
            Browse app
          </Link>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-6 pt-4 sm:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b52]">Rider-to-rider pilot</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Monitor ride posts, requests, and trust signals.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-6 sm:px-8 lg:px-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl bg-[#fbf7ef] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">{card.label}</p>
              <p className="mt-2 text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl grid gap-5 px-5 pb-16 lg:grid-cols-[1fr_0.85fr] sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-[#fbf7ef] p-6">
          <h2 className="text-xl font-bold tracking-tight">Recent ride posts</h2>
          <div className="mt-4 grid gap-3">
            {ridePosts.map((ride) => (
              <div key={ride.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{ride.posterName}: {ride.pickup} to {ride.destination}</p>
                  <span className="rounded-full bg-[#fbf7ef] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1f6b52]">{ride.status}</span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-[#6d6254]">{ride.safetyTag}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#123c2f] p-6 text-white">
          <h2 className="text-xl font-bold tracking-tight">Join queue</h2>
          <div className="mt-4 grid gap-3">
            {ridePosts.flatMap((ride) => ride.joinRequests).length === 0 ? (
              <p className="text-sm font-medium text-white/60">No join requests yet.</p>
            ) : (
              ridePosts.flatMap((ride) => ride.joinRequests).map((request) => (
                <div key={request.id} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-bold text-[#f6c15b]">{request.requesterName}</p>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/75">{request.message}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-white/50">{request.status}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
