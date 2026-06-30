import { NextResponse } from "next/server";
import { getRideById, getRequestsForRide, updateRideStatus, deleteRide } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["open", "requested", "confirmed", "completed", "cancelled"]),
});

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
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ride = await getRideById(id);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  // Only the ride poster can update the ride
  if (ride.posterId !== user.id) {
    return NextResponse.json({ message: "Forbidden: only the ride poster can update this ride" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const updated = await updateRideStatus(id, parsed.data.status);
  return NextResponse.json({
    ride: updated,
    message: "Ride status updated.",
  });
}

export async function DELETE(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ride = await getRideById(id);

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  if (ride.posterId !== user.id) {
    return NextResponse.json({ message: "Forbidden: only the ride poster can delete this ride" }, { status: 403 });
  }

  await deleteRide(id);
  return NextResponse.json({ message: "Ride deleted successfully." });
}
