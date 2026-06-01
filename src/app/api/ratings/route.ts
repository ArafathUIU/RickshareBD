import { NextResponse } from "next/server";
import { createRating } from "@/lib/rickshare-data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const rating = await createRating({
    rideId: body.rideId ?? "unknown",
    score: Number(body.score ?? 5),
    note: body.note ?? "Safe co-passenger.",
  });

  return NextResponse.json(
    { rating, message: "Co-passenger rating saved." },
    { status: 201 },
  );
}
