import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json(
    {
      rating: {
        id: "rating-new",
        rideId: body.rideId ?? "unknown",
        score: Number(body.score ?? 5),
        note: body.note ?? "Safe co-passenger.",
      },
      message: "Co-passenger rating saved in mock backend.",
    },
    { status: 201 },
  );
}
