import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

// Rate limiting map: email -> last request time
const lastResetRequest = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 minute between requests

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ message: "Valid email is required." }, { status: 400 });
  }

  // Rate limiting
  const lastRequest = lastResetRequest.get(email);
  if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
    return NextResponse.json({ message: "Please wait before requesting another reset link." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if email exists
    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  }

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // Send email (falls back to warning in dev if SMTP not configured)
  await sendPasswordResetEmail(email, resetUrl);

  return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { token, password } = body;

  if (!token || !password || password.length < 6) {
    return NextResponse.json({ message: "Valid token and password (min 6 chars) required." }, { status: 400 });
  }

  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { email: reset.email },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });
  return NextResponse.json({ message: "Password reset successfully." });
}
