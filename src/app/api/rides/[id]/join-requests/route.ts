import { NextResponse } from "next/server";
import { createJoinRequest } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type Context = {
  params: Promise<{ id: string }>;
};

const requestSchema = z.object({
  message: z.string().max(1000).optional(),
});

export async function POST(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "You must be logged in to send a join request." }, { status: 401 });
  }

  const { id } = await context.params;

  // Prevent poster from joining their own ride
  const ride = await prisma.ridePost.findUnique({
    where: { id },
    select: { posterId: true },
  });
  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }
  if (ride.posterId === user.id) {
    return NextResponse.json({ message: "You cannot join your own ride" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const joinRequest = await createJoinRequest({
    rideId: id,
    requesterId: user.id,
    requesterName: user.name,
    requesterRating: user.rating,
    message: parsed.data.message ?? "",
  });

  return NextResponse.json(
    { joinRequest, message: "Join request sent." },
    { status: 201 },
  );
}
