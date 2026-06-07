import { prisma } from "../src/lib/prisma";

async function main() {
  // Create a demo user first
  const user = await prisma.user.create({
    data: {
      name: "Rahim",
      email: "rahim@example.com",
      passwordHash: "demo-hash-not-used",
      rating: 4.8,
      safetyTag: "Verified student email",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Ayesha",
      email: "ayesha@example.com",
      passwordHash: "demo-hash-not-used",
      rating: 4.9,
      safetyTag: "Phone verified",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Nabila",
      email: "nabila@example.com",
      passwordHash: "demo-hash-not-used",
      rating: 4.7,
      safetyTag: "3 completed shares",
    },
  });

  // Seed RidePosts
  const ride1 = await prisma.ridePost.create({
    data: {
      posterId: user.id,
      posterName: user.name,
      posterRating: user.rating,
      pickup: "Dhanmondi 27, cafe gate",
      destination: "University main gate",
      startTime: "8:45 AM",
      totalFare: 120,
      seatsOpen: 1,
      status: "open" as const,
      notes: "Rickshaw already hired. Can pick up from nearby roads.",
      routeMatch: "Same direction as New Market and campus area",
      safetyTag: user.safetyTag,
    },
  });

  await prisma.ridePost.create({
    data: {
      posterId: user2.id,
      posterName: user2.name,
      posterRating: user2.rating,
      pickup: "Kalabagan bus stand",
      destination: "Science Lab",
      startTime: "9:05 AM",
      totalFare: 90,
      seatsOpen: 1,
      status: "requested" as const,
      notes: "Planning to hire within 10 minutes if someone joins.",
      routeMatch: "Short detour from Dhanmondi Road 8",
      safetyTag: user2.safetyTag,
    },
  });

  await prisma.ridePost.create({
    data: {
      posterId: user3.id,
      posterName: user3.name,
      posterRating: user3.rating,
      pickup: "Mohammadpur town hall",
      destination: "Asad Gate",
      startTime: "9:20 AM",
      totalFare: 80,
      seatsOpen: 1,
      status: "open" as const,
      notes: "Prefer pickup near the main road to avoid delay.",
      routeMatch: "Direct route, less than 5 min pickup adjustment",
      safetyTag: user3.safetyTag,
    },
  });

  // Seed a join request on ride1
  await prisma.joinRequest.create({
    data: {
      rideId: ride1.id,
      requesterId: user2.id,
      requesterName: user2.name,
      requesterRating: user2.rating,
      status: "pending" as const,
      message: "I am two streets away and going to the same university gate.",
    },
  });

  console.log("✅ Seed completed:");
  console.log(`   - Users: 3`);
  console.log(`   - RidePosts: 3`);
  console.log(`   - JoinRequests: 1`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
