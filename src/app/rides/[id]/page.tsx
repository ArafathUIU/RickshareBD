import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRequestsForRide,
  getRideById,
  getSavings,
  getSplitFare,
} from "@/lib/rickshare-data";

type RideDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RideDetailsPage({ params }: RideDetailsPageProps) {
  const { id } = await params;
  const ride = getRideById(id);

  if (!ride) {
    notFound();
  }

  const requests = getRequestsForRide(ride.id);

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-5 py-6 text-[#1e1a14] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between rounded-full bg-white/85 px-5 py-3 shadow-sm">
          <Link href="/rides" className="text-sm font-black text-[#123c2f]">Back to rides</Link>
          <Link href="/post-ride" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-black text-white">
            Post ride
          </Link>
        </nav>

        <section className="grid gap-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">Ride post</p>
                <h1 className="mt-3 text-5xl font-black tracking-[-0.06em]">
                  {ride.posterName}&apos;s rickshaw
                </h1>
              </div>
              <span className="rounded-full bg-[#e6f3ec] px-4 py-2 text-sm font-black text-[#1f6b52]">
                {ride.seatsOpen} seat open
              </span>
            </div>

            <div className="mt-8 rounded-3xl bg-[#f7f2e8] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a8c77]">Pickup</p>
              <p className="mt-1 text-xl font-black">{ride.pickup}</p>
              <div className="my-5 h-px bg-[#eadfce]" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a8c77]">Destination</p>
              <p className="mt-1 text-2xl font-black">{ride.destination}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#eadfce] p-5">
                <p className="text-xs font-black uppercase text-[#9a8c77]">Start</p>
                <p className="mt-2 text-2xl font-black">{ride.startTime}</p>
              </div>
              <div className="rounded-3xl border border-[#eadfce] p-5">
                <p className="text-xs font-black uppercase text-[#9a8c77]">Full fare</p>
                <p className="mt-2 text-2xl font-black">{ride.totalFare}</p>
              </div>
              <div className="rounded-3xl bg-[#123c2f] p-5 text-white">
                <p className="text-xs font-black uppercase text-[#f6c15b]">Your split</p>
                <p className="mt-2 text-2xl font-black">{getSplitFare(ride.totalFare)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-[#e6f3ec] p-5">
              <p className="font-black text-[#123c2f]">{ride.routeMatch}</p>
              <p className="mt-2 font-medium leading-7 text-[#426555]">{ride.notes}</p>
            </div>
          </div>

          <aside className="rounded-[2.5rem] bg-[#1e1a14] p-6 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c15b]">Request to join</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">Save {getSavings(ride.totalFare)} taka</h2>
            <p className="mt-4 font-medium leading-7 text-white/70">
              Send a request to {ride.posterName}. In the MVP, the poster manually
              accepts the co-passenger before pickup coordination.
            </p>
            <form className="mt-6 grid gap-3">
              <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold outline-none placeholder:text-white/40" placeholder="Your name" />
              <textarea className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold outline-none placeholder:text-white/40" placeholder="Message to poster" />
              <button className="rounded-2xl bg-[#f6c15b] py-4 font-black text-[#123c2f]" type="button">
                Send Join Request
              </button>
            </form>
            <div className="mt-6 rounded-3xl bg-white/10 p-4">
              <p className="text-sm font-bold text-white/60">Trust signal</p>
              <p className="mt-1 font-black">{ride.safetyTag}</p>
              <p className="mt-1 text-sm font-semibold text-white/60">Poster rating {ride.posterRating} / 5</p>
            </div>
          </aside>
        </section>

        <section className="pb-12">
          <h2 className="text-3xl font-black tracking-[-0.03em]">Join requests for poster</h2>
          <div className="mt-4 grid gap-4">
            {requests.length === 0 ? (
              <p className="rounded-3xl bg-white p-5 font-bold text-[#6d6254]">No requests yet.</p>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-black">{request.requesterName}</p>
                      <p className="text-sm font-semibold text-[#6d6254]">Rating {request.requesterRating} / 5</p>
                    </div>
                    <span className="rounded-full bg-[#fff3d4] px-3 py-1 text-xs font-black text-[#8a5b00]">
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-3 font-medium leading-7 text-[#6d6254]">{request.message}</p>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-full bg-[#123c2f] px-5 py-2 font-black text-white" type="button">Accept</button>
                    <button className="rounded-full border border-[#eadfce] px-5 py-2 font-black text-[#6d6254]" type="button">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
