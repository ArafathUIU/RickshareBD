import { NextResponse } from "next/server";
import { ridePosts } from "@/lib/rickshare-data";

export async function GET() {
  return NextResponse.json({ rides: ridePosts });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json(
    {
      ride: {
        id: "ride-new",
        posterName: body.posterName ?? "Current user",
        pickup: body.pickup ?? "Current location",
        destination: body.destination ?? "Destination pending",
        startTime: body.startTime ?? "Now",
        totalFare: Number(body.totalFare ?? 100),
        seatsOpen: 1,
        status: "open",
      },
      message: "Ride post created in mock backend.",
    },
    { status: 201 },
  );
}
