import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().or(z.literal("")),
  safetyTag: z.string().max(200).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, phone: true, rating: true, safetyTag: true, role: true },
  });

  return NextResponse.json({ user: fullUser });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid data", errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name ?? undefined,
      phone: data.phone === "" ? null : (data.phone ?? undefined),
      safetyTag: data.safetyTag ?? undefined,
    },
    select: { id: true, name: true, email: true, phone: true, rating: true, safetyTag: true, role: true },
  });

  return NextResponse.json({ user: updated, message: "Profile updated." });
}
