export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminStats, getAllRides, getSavings, getSplitFare } from "@/lib/rickshare-data";
import Navbar from "./Navbar";

const journey = [
  { title: "Post your route", desc: "Share where you're going and how much the rickshaw costs." },
  { title: "Browse nearby riders", desc: "See who's heading the same direction and split the fare." },
  { title: "Request to join", desc: "Send a quick message and wait for the poster to accept." },
  { title: "Meet and ride", desc: "Hop on together and split the fare in cash — simple." },
];

export default async function Home() {
  const rides = await getAllRides();
  const featuredRide = rides[0];
  const stats = await getAdminStats();

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#123c2f] px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-white">
            <Navbar />
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:mt-20">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#f6c15b] backdrop-blur-sm">
                Rider-to-rider rickshaw sharing
              </div>
              <h1 className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
                Post your rickshaw. Let another rider join.
              </h1>
              <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/70">
                One rider posts an existing or planned trip, another nearby rider requests to join, and both split the fare as co-passengers.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/post-ride" className="rounded-full bg-[#f6c15b] px-6 py-3 text-center text-sm font-bold text-[#123c2f] shadow-lg transition hover:brightness-105">
                  Post a ride
                </Link>
                <Link href="/rides" className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10">
                  Find a co-ride
                </Link>
              </div>
            </div>

            {featuredRide ? (
              <div className="rounded-3xl bg-[#1e1a14] p-2.5 shadow-2xl">
                <div className="rounded-[1.4rem] bg-[#fbf7ef] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1f6b52]">Posted by {featuredRide.posterName}</p>
                      <p className="text-xs text-[#6d6254]">Rating {featuredRide.posterRating} / 5</p>
                    </div>
                    <span className="rounded-full bg-[#e6f3ec] px-3 py-1 text-[11px] font-bold text-[#1f6b52]">
                      {featuredRide.seatsOpen} seat open
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">Pickup</p>
                    <p className="mt-1 text-sm font-semibold">{featuredRide.pickup}</p>
                    <div className="my-3 h-px bg-[#eee4d6]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">Destination</p>
                    <p className="mt-1 text-xl font-bold">{featuredRide.destination}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                      <p className="text-[10px] font-bold uppercase text-[#9a8c77]">Full fare</p>
                      <p className="mt-1 text-2xl font-bold">{featuredRide.totalFare}</p>
                      <p className="text-xs font-medium text-[#6d6254]">taka</p>
                    </div>
                    <div className="rounded-2xl bg-[#123c2f] p-4 text-white ring-2 ring-[#f6c15b]">
                      <p className="text-[10px] font-bold uppercase text-[#f6c15b]">Your split</p>
                      <p className="mt-1 text-2xl font-bold">{getSplitFare(featuredRide.totalFare)}</p>
                      <p className="text-xs font-medium text-white/70">save {getSavings(featuredRide.totalFare)} taka</p>
                    </div>
                  </div>
                  <Link href={`/rides/${featuredRide.id}`} className="mt-3 block w-full rounded-2xl bg-[#f6c15b] py-3.5 text-center text-sm font-bold text-[#123c2f] transition hover:brightness-105">
                    Request to Join
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#1e1a14] p-8 text-white">
                <p className="text-center text-sm font-medium text-white/60">No rides posted yet.</p>
                <Link href="/post-ride" className="mt-4 block w-full rounded-full bg-[#f6c15b] py-3 text-center text-sm font-bold text-[#123c2f]">
                  Post the first ride
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b52]">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Two riders coordinate. The app does not manage drivers.
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-[#6d6254]">
            Rickshare helps people already waving down rickshaws publish their route and split the cost with someone nearby.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((step, index) => (
            <article key={step.title} className="rounded-3xl bg-[#fbf7ef] p-5">
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[#123c2f] text-sm font-bold text-[#f6c15b]">
                {index + 1}
              </div>
              <h3 className="text-base font-bold">{step.title}</h3>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[#6d6254]">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Dark band - Backend/API info */}
      <section className="bg-[#123c2f] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f6c15b]">Live backend</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Real database. Real ride posts and join requests.</h2>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {[
                  "POST /api/rides",
                  "GET /api/rides",
                  "POST /api/rides/:id/join-requests",
                  "PATCH /api/join-requests/:id",
                ].map((endpoint) => (
                  <div key={endpoint} className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur-sm">
                    {endpoint}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f6c15b]">Pilot snapshot</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{stats.openRides}</p>
                  <p className="text-xs font-medium text-white/60">Open rides</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.joinRequests}</p>
                  <p className="text-xs font-medium text-white/60">Pending requests</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.averageSplitFare}</p>
                  <p className="text-xs font-medium text-white/60">Avg split fare (taka)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.completedShares}</p>
                  <p className="text-xs font-medium text-white/60">Completed shares</p>
                </div>
              </div>
              <Link href="/admin" className="mt-5 inline-flex rounded-full bg-[#f6c15b] px-5 py-2.5 text-sm font-bold text-[#123c2f] transition hover:brightness-105">
                View admin
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
