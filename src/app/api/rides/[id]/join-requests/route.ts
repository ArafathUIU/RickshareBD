import { NextResponse } from "next/server";
import { createJoinRequest } from "@/lib/rickshare-data";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const joinRequest = await createJoinRequest({
    rideId: id,
    requesterName: body.requesterName ?? "Anonymous",
    requesterRating: Number(body.requesterRating ?? 4.5),
    message: body.message ?? "",
  });

  return NextResponse.json(
    { joinRequest, message: "Join request sent." },
    { status: 201 },
  );
}
