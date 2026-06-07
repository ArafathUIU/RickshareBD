import { NextResponse } from "next/server";
import { getAllRides, createRide } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";

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

  const ride = await createRide({
    posterId: user.id,
    posterName: user.name,
    posterRating: user.rating,
    pickup: body.pickup ?? "Current location",
    pickupLat: body.pickupLat ? Number(body.pickupLat) : undefined,
    pickupLng: body.pickupLng ? Number(body.pickupLng) : undefined,
    destination: body.destination ?? "Destination pending",
    destLat: body.destLat ? Number(body.destLat) : undefined,
    destLng: body.destLng ? Number(body.destLng) : undefined,
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
