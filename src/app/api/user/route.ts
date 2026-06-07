import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, rating: true, safetyTag: true },
  });

  return NextResponse.json({ user: fullUser });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name ?? undefined,
      safetyTag: body.safetyTag ?? undefined,
    },
    select: { id: true, name: true, email: true, rating: true, safetyTag: true },
  });

  return NextResponse.json({ user: updated, message: "Profile updated." });
}
