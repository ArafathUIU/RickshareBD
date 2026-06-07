import { NextResponse } from "next/server";
import { getAllRides, createRide } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geo";
import { z } from "zod";

const rideSchema = z.object({
  pickup: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  startTime: z.string().min(1).max(50),
  totalFare: z.number().int().min(1).max(100000),
  seatsOpen: z.number().int().min(1).max(10),
  notes: z.string().max(1000).optional(),
  routeMatch: z.string().max(500).optional(),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  destLat: z.number().optional(),
  destLng: z.number().optional(),
});

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
  const parsed = rideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid ride data", errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  let pickupLat = data.pickupLat;
  let pickupLng = data.pickupLng;
  let destLat = data.destLat;
  let destLng = data.destLng;

  // Auto-geocode if coordinates not provided
  if (pickupLat == null || pickupLng == null) {
    const geo = await geocodeAddress(data.pickup);
    if (geo) {
      pickupLat = geo.lat;
      pickupLng = geo.lng;
    }
  }

  if (destLat == null || destLng == null) {
    const geo = await geocodeAddress(data.destination);
    if (geo) {
      destLat = geo.lat;
      destLng = geo.lng;
    }
  }

  const ride = await createRide({
    posterId: user.id,
    posterName: user.name,
    posterRating: user.rating,
    pickup: data.pickup,
    pickupLat,
    pickupLng,
    destination: data.destination,
    destLat,
    destLng,
    startTime: data.startTime,
    totalFare: data.totalFare,
    seatsOpen: data.seatsOpen,
    status: "open" as const,
    notes: data.notes ?? "",
    routeMatch: data.routeMatch ?? "",
    safetyTag: user.safetyTag ?? "",
  });

  return NextResponse.json(
    { ride, message: "Ride post created." },
    { status: 201 },
  );
}
