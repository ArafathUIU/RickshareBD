import { NextResponse } from "next/server";
import { getRideById, getRequestsForRide, updateRideStatus } from "@/lib/rickshare-data";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const ride = await getRideById(id);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  const joinRequests = await getRequestsForRide(id);
  return NextResponse.json({ ride, joinRequests });
}

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const ride = await getRideById(id);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  const updated = await updateRideStatus(id, body.status ?? ride.status);
  return NextResponse.json({
    ride: updated,
    message: "Ride status updated.",
  });
}
