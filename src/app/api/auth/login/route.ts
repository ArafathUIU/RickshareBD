import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { z } from "zod";

// Simple in-memory rate limiting: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // 10 attempts per 15 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetTime < now) {
    const newEntry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, newEntry);
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  // Get client IP from headers
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  const rateLimit = getRateLimitInfo(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
    message: "Logged in successfully.",
  });
}
