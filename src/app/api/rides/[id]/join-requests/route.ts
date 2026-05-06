import { NextResponse } from "next/server";
import { getRideById } from "@/lib/rickshare-data";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  const ride = getRideById(id);
  const body = await request.json().catch(() => ({}));

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      joinRequest: {
        id: "join-new",
        rideId: id,
        requesterName: body.requesterName ?? "Current user",
        status: "pending",
        message: body.message ?? "I want to join this rickshaw share.",
      },
      message: "Join request sent to the ride poster.",
    },
    { status: 201 },
  );
}
