export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllRides, getSavings, getSplitFare } from "@/lib/rickshare-data";

export default async function RidesPage() {
  const rides = await getAllRides();

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between rounded-full bg-[#fbf7ef] px-5 py-2.5">
          <Link href="/" className="text-base font-bold">Rickshare</Link>
          <Link href="/post-ride" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110">
            Post ride
          </Link>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-6 pt-4 sm:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b52]">Find a co-passenger ride</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Browse rickshaws posted by nearby riders.
        </h1>
        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#6d6254]">
          Review route, trust signals, and fare split before requesting to join.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        {rides.length === 0 ? (
          <div className="rounded-3xl bg-[#fbf7ef] p-10 text-center">
            <p className="text-base font-semibold text-[#6d6254]">No rides posted yet.</p>
            <Link href="/post-ride" className="mt-4 inline-block rounded-full bg-[#123c2f] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
              Post the first ride
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rides.map((ride) => (
              <article key={ride.id} className="group rounded-3xl bg-[#fbf7ef] p-4 transition hover:shadow-lg hover:shadow-black/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{ride.posterName}</p>
                    <p className="text-xs text-[#6d6254]">Rating {ride.posterRating} / 5</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1f6b52] shadow-sm">
                    {ride.status}
                  </span>
                </div>
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">From</p>
                  <p className="mt-1 text-sm font-semibold">{ride.pickup}</p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">To</p>
                  <p className="mt-1 text-lg font-bold">{ride.destination}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl border border-[#eadfce] bg-white p-3.5">
                    <p className="text-[10px] font-bold uppercase text-[#9a8c77]">Split fare</p>
                    <p className="mt-1 text-xl font-bold">{getSplitFare(ride.totalFare)}</p>
                    <p className="text-[10px] font-medium text-[#6d6254]">taka</p>
                  </div>
                  <div className="rounded-2xl bg-[#123c2f] p-3.5 text-white">
                    <p className="text-[10px] font-bold uppercase text-[#f6c15b]">Savings</p>
                    <p className="mt-1 text-xl font-bold">{getSavings(ride.totalFare)}</p>
                    <p className="text-[10px] font-medium text-white/70">taka</p>
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium leading-relaxed text-[#6d6254]">{ride.routeMatch}</p>
                <Link href={`/rides/${ride.id}`} className="mt-3 block rounded-2xl bg-[#f6c15b] py-3 text-center text-sm font-bold text-[#123c2f] transition hover:brightness-105">
                  View and request
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
