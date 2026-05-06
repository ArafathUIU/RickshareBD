import { NextResponse } from "next/server";
import { joinRequests } from "@/lib/rickshare-data";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const joinRequest = joinRequests.find((requestItem) => requestItem.id === id);

  if (!joinRequest) {
    return NextResponse.json({ message: "Join request not found" }, { status: 404 });
  }

  return NextResponse.json({
    joinRequest: {
      ...joinRequest,
      status: body.status === "rejected" ? "rejected" : "accepted",
    },
    message: "Join request decision saved in mock backend.",
  });
}
