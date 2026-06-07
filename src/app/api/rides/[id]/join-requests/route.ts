import { NextResponse } from "next/server";
import { createJoinRequest } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "You must be logged in to send a join request." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const joinRequest = await createJoinRequest({
    rideId: id,
    requesterId: user.id,
    requesterName: user.name,
    requesterRating: user.rating,
    message: body.message ?? "",
  });

  return NextResponse.json(
    { joinRequest, message: "Join request sent." },
    { status: 201 },
  );
}
