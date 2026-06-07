import { prisma } from "./prisma";

// ─── Mock data fallback for local development without a real database ───

const mockRidePosts = [
  {
    id: "ride-101",
    posterId: "user-1",
    posterName: "Rahim",
    posterRating: 4.8,
    pickup: "Dhanmondi 27, cafe gate",
    pickupLat: 23.7465,
    pickupLng: 90.3760,
    destination: "University main gate",
    destLat: 23.7333,
    destLng: 90.3925,
    startTime: "8:45 AM",
    totalFare: 120,
    seatsOpen: 1,
    status: "open",
    notes: "Rickshaw already hired. Can pick up from nearby roads.",
    routeMatch: "Same direction as New Market and campus area",
    safetyTag: "Verified student email",
    createdAt: new Date("2026-06-01T08:00:00Z"),
    updatedAt: new Date("2026-06-01T08:00:00Z"),
    joinRequests: [
      {
        id: "join-501",
        rideId: "ride-101",
        requesterId: null,
        requesterName: "Ayesha",
        requesterRating: 4.9,
        status: "pending",
        message: "I am two streets away and going to the same university gate.",
        createdAt: new Date("2026-06-01T08:05:00Z"),
        updatedAt: new Date("2026-06-01T08:05:00Z"),
      },
    ],
  },
  {
    id: "ride-102",
    posterId: "user-2",
    posterName: "Ayesha",
    posterRating: 4.9,
    pickup: "Kalabagan bus stand",
    pickupLat: 23.7489,
    pickupLng: 90.3835,
    destination: "Science Lab",
    destLat: 23.7390,
    destLng: 90.3900,
    startTime: "9:05 AM",
    totalFare: 90,
    seatsOpen: 1,
    status: "requested",
    notes: "Planning to hire within 10 minutes if someone joins.",
    routeMatch: "Short detour from Dhanmondi Road 8",
    safetyTag: "Phone verified",
    createdAt: new Date("2026-06-01T08:10:00Z"),
    updatedAt: new Date("2026-06-01T08:10:00Z"),
    joinRequests: [],
  },
  {
    id: "ride-103",
    posterId: "user-3",
    posterName: "Nabila",
    posterRating: 4.7,
    pickup: "Mohammadpur town hall",
    pickupLat: 23.7580,
    pickupLng: 90.3650,
    destination: "Asad Gate",
    destLat: 23.7680,
    destLng: 90.3710,
    startTime: "9:20 AM",
    totalFare: 80,
    seatsOpen: 1,
    status: "open",
    notes: "Prefer pickup near the main road to avoid delay.",
    routeMatch: "Direct route, less than 5 min pickup adjustment",
    safetyTag: "3 completed shares",
    createdAt: new Date("2026-06-01T08:15:00Z"),
    updatedAt: new Date("2026-06-01T08:15:00Z"),
    joinRequests: [],
  },
];

let dbAvailable = true;

function isDbError(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    const code = e.errorCode ?? e.code ?? "";
    const msg = String(e.message ?? "").toLowerCase();
    return (
      code === "P1001" ||
      code === "P1002" ||
      code === "P1003" ||
      code === "P2002" ||
      msg.includes("authentication failed") ||
      msg.includes("not valid") ||
      msg.includes("database server") ||
      msg.includes("connect") ||
      msg.includes("prismaclientinitialization")
    );
  }
  return false;
}

async function dbOrFallback<T>(dbCall: () => Promise<T>, fallback: T): Promise<T> {
  if (!dbAvailable) return fallback;
  try {
    return await dbCall();
  } catch (err) {
    if (isDbError(err)) {
      dbAvailable = false;
      console.warn("⚠️ Database unavailable — falling back to mock data. Set DATABASE_URL to connect a real DB.");
      return fallback;
    }
    throw err;
  }
}

export type RideStatus = "open" | "requested" | "confirmed" | "completed";

export async function getAllRides() {
  return dbOrFallback(
    () =>
      prisma.ridePost.findMany({
        orderBy: { createdAt: "desc" },
        include: { joinRequests: true },
      }),
    mockRidePosts,
  );
}

export async function getRideById(id: string) {
  return dbOrFallback(
    () =>
      prisma.ridePost.findUnique({
        where: { id },
        include: { joinRequests: true },
      }),
    mockRidePosts.find((r) => r.id === id) ?? null,
  );
}

export async function getRequestsForRide(rideId: string) {
  return dbOrFallback(
    () =>
      prisma.joinRequest.findMany({
        where: { rideId },
        orderBy: { createdAt: "desc" },
      }),
    mockRidePosts.find((r) => r.id === rideId)?.joinRequests ?? [],
  );
}

export async function createRide(data: {
  posterId: string;
  posterName: string;
  posterRating?: number;
  pickup: string;
  pickupLat?: number;
  pickupLng?: number;
  destination: string;
  destLat?: number;
  destLng?: number;
  startTime: string;
  totalFare: number;
  seatsOpen?: number;
  status?: string;
  notes?: string;
  routeMatch?: string;
  safetyTag?: string;
}) {
  return dbOrFallback(
    () =>
      prisma.ridePost.create({
        data: {
          posterId: data.posterId,
          posterName: data.posterName,
          posterRating: data.posterRating ?? 4.5,
          pickup: data.pickup,
          pickupLat: data.pickupLat ?? null,
          pickupLng: data.pickupLng ?? null,
          destination: data.destination,
          destLat: data.destLat ?? null,
          destLng: data.destLng ?? null,
          startTime: data.startTime,
          totalFare: data.totalFare,
          seatsOpen: data.seatsOpen ?? 1,
          status: data.status ?? "open",
          notes: data.notes ?? "",
          routeMatch: data.routeMatch ?? "",
          safetyTag: data.safetyTag ?? "",
        },
      }),
    {
      id: `ride-mock-${Date.now()}`,
      posterId: data.posterId,
      posterName: data.posterName,
      posterRating: data.posterRating ?? 4.5,
      pickup: data.pickup,
      pickupLat: data.pickupLat ?? null,
      pickupLng: data.pickupLng ?? null,
      destination: data.destination,
      destLat: data.destLat ?? null,
      destLng: data.destLng ?? null,
      startTime: data.startTime,
      totalFare: data.totalFare,
      seatsOpen: data.seatsOpen ?? 1,
      status: data.status ?? "open",
      notes: data.notes ?? "",
      routeMatch: data.routeMatch ?? "",
      safetyTag: data.safetyTag ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );
}

export async function createJoinRequest(data: {
  rideId: string;
  requesterId?: string;
  requesterName: string;
  requesterRating?: number;
  message?: string;
}) {
  return dbOrFallback(
    async () => {
      const request = await prisma.joinRequest.create({
        data: {
          rideId: data.rideId,
          requesterId: data.requesterId ?? null,
          requesterName: data.requesterName,
          requesterRating: data.requesterRating ?? 4.5,
          message: data.message ?? "",
          status: "pending",
        },
      });
      await prisma.ridePost.update({
        where: { id: data.rideId },
        data: { status: "requested" },
      });
      return request;
    },
    {
      id: `join-mock-${Date.now()}`,
      rideId: data.rideId,
      requesterId: data.requesterId ?? null,
      requesterName: data.requesterName,
      requesterRating: data.requesterRating ?? 4.5,
      status: "pending",
      message: data.message ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );
}

export async function updateJoinRequest(id: string, status: "accepted" | "rejected") {
  return dbOrFallback(
    async () => {
      const request = await prisma.joinRequest.update({
        where: { id },
        data: { status },
      });
      if (status === "accepted") {
        await prisma.ridePost.update({
          where: { id: request.rideId },
          data: { status: "confirmed", seatsOpen: 0 },
        });
      }
      return request;
    },
    {
      id,
      rideId: "ride-101",
      requesterId: null,
      requesterName: "Ayesha",
      requesterRating: 4.9,
      status,
      message: "I am two streets away and going to the same university gate.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );
}

export async function updateRideStatus(id: string, status: string) {
  return dbOrFallback(
    () => prisma.ridePost.update({ where: { id }, data: { status } }),
    mockRidePosts.find((r) => r.id === id) ?? null,
  );
}

export async function createRating(data: {
  rideId: string;
  score?: number;
  note?: string;
}) {
  return dbOrFallback(
    () =>
      prisma.rating.create({
        data: {
          rideId: data.rideId,
          score: data.score ?? 5,
          note: data.note ?? "",
        },
      }),
    {
      id: `rating-mock-${Date.now()}`,
      rideId: data.rideId,
      score: data.score ?? 5,
      note: data.note ?? "",
      createdAt: new Date(),
    },
  );
}

export function getSplitFare(totalFare: number, riders = 2) {
  return Math.ceil(totalFare / riders);
}

export function getSavings(totalFare: number) {
  return totalFare - getSplitFare(totalFare);
}

export async function getAdminStats() {
  return dbOrFallback(
    async () => {
      const [openRides, pendingRequests, allRides] = await Promise.all([
        prisma.ridePost.count({ where: { status: "open" } }),
        prisma.joinRequest.count({ where: { status: "pending" } }),
        prisma.ridePost.findMany(),
      ]);

      const averageSplitFare =
        allRides.length > 0
          ? Math.round(
              allRides.reduce((sum, ride) => sum + getSplitFare(ride.totalFare), 0) /
                allRides.length,
            )
          : 0;

      return {
        openRides,
        joinRequests: pendingRequests,
        averageSplitFare,
        completedShares: 24,
      };
    },
    {
      openRides: mockRidePosts.filter((r) => r.status === "open").length,
      joinRequests: mockRidePosts.reduce(
        (sum, r) => sum + r.joinRequests.filter((j) => j.status === "pending").length,
        0,
      ),
      averageSplitFare: Math.round(
        mockRidePosts.reduce((sum, r) => sum + getSplitFare(r.totalFare), 0) /
          mockRidePosts.length,
      ),
      completedShares: 24,
    },
  );
}
