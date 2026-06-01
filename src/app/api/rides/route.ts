import { NextResponse } from "next/server";
import { getAllRides, createRide } from "@/lib/rickshare-data";

export async function GET() {
  const rides = await getAllRides();
  return NextResponse.json({ rides });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const ride = await createRide({
    posterName: body.posterName ?? "Current user",
    posterRating: Number(body.posterRating ?? 4.5),
    pickup: body.pickup ?? "Current location",
    destination: body.destination ?? "Destination pending",
    startTime: body.startTime ?? "Now",
    totalFare: Number(body.totalFare ?? 100),
    seatsOpen: Number(body.seatsOpen ?? 1),
    status: body.status ?? "open",
    notes: body.notes ?? "",
    routeMatch: body.routeMatch ?? "",
    safetyTag: body.safetyTag ?? "",
  });

  return NextResponse.json(
    { ride, message: "Ride post created." },
    { status: 201 },
  );
}
