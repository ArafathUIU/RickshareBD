import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";

// Store tokens in memory (use Redis/DB in production)
const resetTokens = new Map<string, { email: string; expires: number }>();

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if email exists
    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  resetTokens.set(token, { email, expires: Date.now() + 1000 * 60 * 30 }); // 30 min

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // In production, send email here. For demo, we log to console.
  console.log(`🔐 Password reset link for ${email}: ${resetUrl}`);

  return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { token, password } = body;

  if (!token || !password || password.length < 6) {
    return NextResponse.json({ message: "Valid token and password (min 6 chars) required." }, { status: 400 });
  }

  const reset = resetTokens.get(token);
  if (!reset || reset.expires < Date.now()) {
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { email: reset.email },
    data: { passwordHash },
  });

  resetTokens.delete(token);
  return NextResponse.json({ message: "Password reset successfully." });
}
