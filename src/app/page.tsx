import Link from "next/link";
import { getAdminStats, getSavings, getSplitFare, ridePosts } from "@/lib/rickshare-data";

const journey = [
  "User 1 posts a rickshaw route and fare",
  "User 2 browses nearby compatible ride posts",
  "User 2 sends a join request",
  "User 1 accepts the co-passenger",
  "Both riders split the fare in cash",
];

export default function Home() {
  const featuredRide = ridePosts[0];
  const stats = getAdminStats();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f2e8] text-[#1e1a14]">
      <section className="relative px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_30%_20%,#f6c15b_0,#f6c15b_23%,transparent_24%),linear-gradient(135deg,#123c2f,#1f6b52_58%,#f7f2e8_59%)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/30 bg-white/85 px-5 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#123c2f] text-lg font-black text-[#f6c15b]">
              R
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">Rickshare</p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f6b52]">
                Rider-to-rider sharing
              </p>
            </div>
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <Link className="rounded-full px-4 py-2 text-sm font-black text-[#123c2f]" href="/rides">
              Browse rides
            </Link>
            <Link className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-black text-white" href="/post-ride">
              Post ride
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/50 bg-white/85 px-4 py-2 text-sm font-bold text-[#123c2f] shadow-sm">
              Corrected MVP: no driver account
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Post your rickshaw. Let another rider join.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/85">
              Rickshare is a rider-to-rider coordination app. One rider posts an
              existing or planned rickshaw trip, another nearby rider requests to
              join, and both split the fare as co-passengers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/post-ride" className="rounded-full bg-[#f6c15b] px-6 py-3 text-center font-black text-[#123c2f] shadow-lg shadow-black/10 transition hover:-translate-y-0.5">
                Post a ride
              </Link>
              <Link href="/rides" className="rounded-full border border-white/45 px-6 py-3 text-center font-black text-white transition hover:bg-white/10">
                Find a co-ride
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#1e1a14] p-3 shadow-2xl shadow-black/30">
            <div className="rounded-[2rem] bg-[#fbf7ef] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-[#1f6b52]">Posted by {featuredRide.posterName}</p>
                  <p className="text-xs font-semibold text-[#6d6254]">Rating {featuredRide.posterRating} / 5</p>
                </div>
                <div className="rounded-full bg-[#e6f3ec] px-3 py-1 text-xs font-black text-[#1f6b52]">
                  1 seat open
                </div>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a8c77]">Pickup</p>
                <p className="mt-1 font-bold">{featuredRide.pickup}</p>
                <div className="my-4 h-px bg-[#eee4d6]" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a8c77]">Destination</p>
                <p className="mt-1 text-2xl font-black">{featuredRide.destination}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-[#eadfce] bg-white p-4">
                  <p className="text-xs font-black uppercase text-[#9a8c77]">Full fare</p>
                  <p className="mt-2 text-3xl font-black">{featuredRide.totalFare}</p>
                  <p className="text-sm font-bold text-[#6d6254]">taka</p>
                </div>
                <div className="rounded-3xl bg-[#123c2f] p-4 text-white ring-4 ring-[#f6c15b]">
                  <p className="text-xs font-black uppercase text-[#f6c15b]">Your split</p>
                  <p className="mt-2 text-3xl font-black">{getSplitFare(featuredRide.totalFare)}</p>
                  <p className="text-sm font-bold text-white/70">save {getSavings(featuredRide.totalFare)} taka</p>
                </div>
              </div>
              <Link href={`/rides/${featuredRide.id}`} className="mt-4 block w-full rounded-2xl bg-[#f6c15b] py-4 text-center text-lg font-black text-[#123c2f] shadow-sm">
                Request to Join
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">How Rickshare works</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Two riders coordinate. The app does not manage drivers.
            </h2>
            <p className="mt-4 text-lg font-medium leading-8 text-[#6d6254]">
              The MVP focuses on the real user behavior: people already wave down
              rickshaws. Rickshare helps them publish the route and split the cost
              with someone nearby.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {journey.map((step, index) => (
              <article key={step} className="rounded-[2rem] bg-white p-5 shadow-sm">
                <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-[#123c2f] text-lg font-black text-[#f6c15b]">
                  {index + 1}
                </div>
                <h3 className="text-xl font-black">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-[#123c2f] p-6 text-white lg:col-span-2">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c15b]">Backend running in mock mode</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">APIs now model ride posts and join requests.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "POST /api/rides",
                "GET /api/rides",
                "POST /api/rides/:id/join-requests",
                "PATCH /api/join-requests/:id",
              ].map((endpoint) => (
                <div key={endpoint} className="rounded-2xl bg-white/10 p-4 font-bold backdrop-blur">
                  {endpoint}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9a8c77]">Pilot snapshot</p>
            <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">{stats.openRides} open rides</h3>
            <p className="mt-4 font-medium leading-7 text-[#6d6254]">
              {stats.joinRequests} pending join request and {stats.averageSplitFare} taka average split fare in mock data.
            </p>
            <Link href="/admin" className="mt-6 inline-flex rounded-full bg-[#123c2f] px-5 py-3 font-black text-white">
              View admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
