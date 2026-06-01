import { NextResponse } from "next/server";
import { updateJoinRequest } from "@/lib/rickshare-data";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const status = body.status === "rejected" ? "rejected" : "accepted";
  const joinRequest = await updateJoinRequest(id, status);

  return NextResponse.json({
    joinRequest,
    message: "Join request decision saved.",
  });
}
