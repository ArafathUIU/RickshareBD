import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";

// Simple in-memory rate limiting: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // 5 registrations per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  // Get client IP from headers
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  const rateLimit = getRateLimitInfo(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many registration attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid registration data", errors: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Email already registered." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: { id: true, name: true, email: true },
  });

  await createSession(user.id);

  return NextResponse.json({ user, message: "Registered successfully." }, { status: 201 });
}
