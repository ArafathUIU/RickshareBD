import { NextResponse } from "next/server";
import { createRating } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ratingSchema = z.object({
  rideId: z.string().min(1),
  ratedUserId: z.string().min(1),
  score: z.number().int().min(1).max(5),
  note: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid rating data", errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Users cannot rate themselves
  if (data.ratedUserId === user.id) {
    return NextResponse.json({ message: "You cannot rate yourself" }, { status: 400 });
  }

  // Verify the ride exists and both users are involved
  const ride = await prisma.ridePost.findUnique({
    where: { id: data.rideId },
    include: {
      joinRequests: {
        where: { status: "accepted" },
      },
    },
  });

  if (!ride) {
    return NextResponse.json({ message: "Ride not found" }, { status: 404 });
  }

  // Check if rater is the poster or has an accepted join request
  const isPoster = ride.posterId === user.id;
  const hasJoined = ride.joinRequests.some((r) => r.requesterId === user.id);
  if (!isPoster && !hasJoined) {
    return NextResponse.json({ message: "You can only rate rides you participated in" }, { status: 403 });
  }

  // Check if rated user is also involved
  const isRatedPoster = ride.posterId === data.ratedUserId;
  const isRatedPassenger = ride.joinRequests.some((r) => r.requesterId === data.ratedUserId);
  if (!isRatedPoster && !isRatedPassenger) {
    return NextResponse.json({ message: "You can only rate participants of this ride" }, { status: 403 });
  }

  // Check for duplicate rating
  const existing = await prisma.rating.findUnique({
    where: {
      rideId_ratedById: {
        rideId: data.rideId,
        ratedById: user.id,
      },
    },
  });
  if (existing) {
    return NextResponse.json({ message: "You already rated this ride" }, { status: 409 });
  }

  const rating = await createRating({
    rideId: data.rideId,
    ratedById: user.id,
    ratedUserId: data.ratedUserId,
    score: data.score,
    note: data.note ?? "Safe co-passenger.",
  });

  return NextResponse.json(
    { rating, message: "Co-passenger rating saved." },
    { status: 201 },
  );
}
