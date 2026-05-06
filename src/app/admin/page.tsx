import Link from "next/link";
import { getAdminStats, joinRequests, ridePosts } from "@/lib/rickshare-data";

export default function AdminPage() {
  const stats = getAdminStats();
  const statCards = [
    ["Open ride posts", stats.openRides],
    ["Pending join requests", stats.joinRequests],
    ["Avg. split fare", `${stats.averageSplitFare} taka`],
    ["Completed shares", stats.completedShares],
  ];

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-5 py-6 text-[#1e1a14] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-full bg-white/85 px-5 py-3 shadow-sm">
          <Link href="/" className="text-lg font-black">Rickshare Admin</Link>
          <Link href="/rides" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-black text-white">
            Browse app
          </Link>
        </nav>

        <section className="py-12">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">Rider-to-rider pilot</p>
          <h1 className="mt-3 text-5xl font-black tracking-[-0.06em] sm:text-6xl">
            Monitor ride posts, requests, and trust signals.
          </h1>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(([label, value]) => (
            <div key={label} className="rounded-[2rem] bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9a8c77]">{label}</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.04em]">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 py-10 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black tracking-[-0.03em]">Recent ride posts</h2>
            <div className="mt-5 grid gap-4">
              {ridePosts.map((ride) => (
                <div key={ride.id} className="rounded-3xl bg-[#f7f2e8] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black">{ride.posterName}: {ride.pickup} to {ride.destination}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#1f6b52]">{ride.status}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-[#6d6254]">{ride.safetyTag}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#123c2f] p-6 text-white shadow-sm">
            <h2 className="text-3xl font-black tracking-[-0.03em]">Join queue</h2>
            <div className="mt-5 grid gap-4">
              {joinRequests.map((request) => (
                <div key={request.id} className="rounded-3xl bg-white/10 p-4">
                  <p className="font-black text-[#f6c15b]">{request.requesterName}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/75">{request.message}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/50">{request.status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
