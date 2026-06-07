import { NextResponse } from "next/server";
import { getAllRides, createRide } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geo";

export async function GET() {
  const rides = await getAllRides();
  return NextResponse.json({ rides });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "You must be logged in to post a ride." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  let pickupLat = body.pickupLat ? Number(body.pickupLat) : undefined;
  let pickupLng = body.pickupLng ? Number(body.pickupLng) : undefined;
  let destLat = body.destLat ? Number(body.destLat) : undefined;
  let destLng = body.destLng ? Number(body.destLng) : undefined;

  // Auto-geocode if coordinates not provided
  if (!pickupLat || !pickupLng) {
    const geo = await geocodeAddress(body.pickup ?? "");
    if (geo) {
      pickupLat = geo.lat;
      pickupLng = geo.lng;
    }
  }

  if (!destLat || !destLng) {
    const geo = await geocodeAddress(body.destination ?? "");
    if (geo) {
      destLat = geo.lat;
      destLng = geo.lng;
    }
  }

  const ride = await createRide({
    posterId: user.id,
    posterName: user.name,
    posterRating: user.rating,
    pickup: body.pickup ?? "Current location",
    pickupLat,
    pickupLng,
    destination: body.destination ?? "Destination pending",
    destLat,
    destLng,
    startTime: body.startTime ?? "Now",
    totalFare: Number(body.totalFare ?? 100),
    seatsOpen: Number(body.seatsOpen ?? 1),
    status: body.status ?? "open",
    notes: body.notes ?? "",
    routeMatch: body.routeMatch ?? "",
    safetyTag: user.safetyTag ?? "",
  });

  return NextResponse.json(
    { ride, message: "Ride post created." },
    { status: 201 },
  );
}
