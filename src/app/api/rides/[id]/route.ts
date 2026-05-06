import { NextResponse } from "next/server";
import { getRequestsForRide, getRideById } from "@/lib/rickshare-data";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const ride = getRideById(id);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  return NextResponse.json({ ride, joinRequests: getRequestsForRide(id) });
}

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const ride = getRideById(id);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  return NextResponse.json({
    ride: { ...ride, status: body.status ?? ride.status },
    message: "Ride status updated in mock backend.",
  });
}
