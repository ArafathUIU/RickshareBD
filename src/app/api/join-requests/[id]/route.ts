import { NextResponse } from "next/server";
import { updateJoinRequest } from "@/lib/rickshare-data";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  // Find the join request to verify ownership
  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id },
    include: { ride: true },
  });

  if (!joinRequest) {
    return NextResponse.json({ message: "Join request not found" }, { status: 404 });
  }

  // Only the ride poster can accept/reject requests
  if (joinRequest.ride.posterId !== user.id) {
    return NextResponse.json({ message: "Forbidden: only the ride poster can manage requests" }, { status: 403 });
  }

  const updated = await updateJoinRequest(id, parsed.data.status);

  return NextResponse.json({
    joinRequest: updated,
    message: "Join request decision saved.",
  });
}
