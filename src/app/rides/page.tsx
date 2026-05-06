import Link from "next/link";
import { getSavings, getSplitFare, ridePosts } from "@/lib/rickshare-data";

export default function RidesPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e8] px-5 py-6 text-[#1e1a14] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-full bg-white/85 px-5 py-3 shadow-sm">
          <Link href="/" className="text-lg font-black">Rickshare</Link>
          <Link href="/post-ride" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-black text-white">
            Post ride
          </Link>
        </nav>

        <section className="py-12">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">Find a co-passenger ride</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-[-0.06em] sm:text-6xl">
            Browse rickshaws posted by nearby riders.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#6d6254]">
            These are mock ride posts from User 1 style posters. User 2 can review
            route, trust signals, and fare split before requesting to join.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {ridePosts.map((ride) => (
            <article key={ride.id} className="rounded-[2rem] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black">{ride.posterName}</p>
                  <p className="text-sm font-semibold text-[#6d6254]">Rating {ride.posterRating} / 5</p>
                </div>
                <span className="rounded-full bg-[#e6f3ec] px-3 py-1 text-xs font-black text-[#1f6b52]">
                  {ride.status}
                </span>
              </div>
              <div className="mt-6 rounded-3xl bg-[#f7f2e8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a8c77]">From</p>
                <p className="mt-1 font-black">{ride.pickup}</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#9a8c77]">To</p>
                <p className="mt-1 text-xl font-black">{ride.destination}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#eadfce] p-4">
                  <p className="text-xs font-black uppercase text-[#9a8c77]">Split fare</p>
                  <p className="mt-1 text-2xl font-black">{getSplitFare(ride.totalFare)}</p>
                </div>
                <div className="rounded-2xl bg-[#123c2f] p-4 text-white">
                  <p className="text-xs font-black uppercase text-[#f6c15b]">Savings</p>
                  <p className="mt-1 text-2xl font-black">{getSavings(ride.totalFare)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold leading-6 text-[#6d6254]">{ride.routeMatch}</p>
              <Link href={`/rides/${ride.id}`} className="mt-5 block rounded-2xl bg-[#f6c15b] py-3 text-center font-black text-[#123c2f]">
                View and request
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
