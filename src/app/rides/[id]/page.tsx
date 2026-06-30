export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import {
  getRequestsForRide,
  getRideById,
  getSavings,
  getSplitFare,
} from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import JoinRequestForm from "./JoinRequestForm";
import RequestActions from "./RequestActions";
import Navbar from "../../Navbar";
import MapView from "./MapView";

type RideDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RideDetailsPage({ params }: RideDetailsPageProps) {
  const { id } = await params;
  const [ride, user] = await Promise.all([getRideById(id), getCurrentUser()]);

  if (!ride) {
    notFound();
  }

  const requests = await getRequestsForRide(ride.id);
  const isPoster = user?.id === ride.posterId;

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 lg:px-12">
        <Navbar />
      </div>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-4 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Ride info card */}
          <div className="rounded-3xl bg-[#fbf7ef] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b52]">Ride post</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  {ride.posterName}&apos;s rickshaw
                </h1>
              </div>
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#1f6b52] shadow-sm">
                {ride.seatsOpen} seat open
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">Pickup</p>
              <p className="mt-1 text-base font-semibold">{ride.pickup}</p>
              <div className="my-4 h-px bg-[#eadfce]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">Destination</p>
              <p className="mt-1 text-xl font-bold">{ride.destination}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                <p className="text-[10px] font-bold uppercase text-[#9a8c77]">Start</p>
                <p className="mt-1 text-lg font-bold">{ride.startTime}</p>
              </div>
              <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                <p className="text-[10px] font-bold uppercase text-[#9a8c77]">Full fare</p>
                <p className="mt-1 text-lg font-bold">{ride.totalFare} taka</p>
              </div>
              <div className="rounded-2xl bg-[#123c2f] p-4 text-white">
                <p className="text-[10px] font-bold uppercase text-[#f6c15b]">Your split</p>
                <p className="mt-1 text-lg font-bold">{getSplitFare(ride.totalFare)} taka</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#e6f3ec] p-4">
              <p className="text-sm font-semibold text-[#123c2f]">{ride.routeMatch}</p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[#426555]">{ride.notes}</p>
            </div>
          </div>

          {/* Join request sidebar */}
          <aside className="rounded-3xl bg-[#123c2f] p-5 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f6c15b]">Request to join</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Save {getSavings(ride.totalFare)} taka</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
              {isPoster
                ? "You posted this ride. Manage requests below."
                : `Send a request to ${ride.posterName}. The poster manually accepts before pickup coordination.`}
            </p>
            {!isPoster && <JoinRequestForm rideId={ride.id} />}
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-xs font-semibold text-white/60">Trust signal</p>
              <p className="mt-1 text-sm font-bold">{ride.safetyTag}</p>
              <p className="mt-1 text-xs text-white/60">Poster rating {ride.posterRating} / 5</p>
            </div>
          </aside>
        </div>

        {/* Map */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Route</h2>
          <div className="mt-3">
            <MapView
              pickup={ride.pickup}
              destination={ride.destination}
              pickupLat={ride.pickupLat}
              pickupLng={ride.pickupLng}
              destLat={ride.destLat}
              destLng={ride.destLng}
            />
          </div>
        </section>

        {/* Join requests for poster */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">Join requests</h2>
          <div className="mt-4 grid gap-3">
            {requests.length === 0 ? (
              <p className="rounded-2xl bg-[#fbf7ef] p-5 text-sm font-semibold text-[#6d6254]">No requests yet.</p>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="rounded-2xl bg-[#fbf7ef] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-bold">{request.requesterName}</p>
                      <p className="text-xs text-[#6d6254]">Rating {request.requesterRating} / 5</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8a5b00] shadow-sm">
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#6d6254]">{request.message}</p>
                  {isPoster && request.status === "pending" && (
                    <RequestActions requestId={request.id} />
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
