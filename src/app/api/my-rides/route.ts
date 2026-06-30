import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [postedRides, joinedRides] = await Promise.all([
    prisma.ridePost.findMany({
      where: { posterId: user.id },
      orderBy: { createdAt: "desc" },
      include: { joinRequests: true },
    }),
    prisma.ridePost.findMany({
      where: {
        joinRequests: {
          some: {
            requesterId: user.id,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        joinRequests: {
          where: { requesterId: user.id },
        },
      },
    }),
  ]);

  return NextResponse.json({ postedRides, joinedRides });
}
