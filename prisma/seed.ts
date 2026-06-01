import { prisma } from "../src/lib/prisma";

async function main() {
  // Seed RidePosts
  const ride1 = await prisma.ridePost.create({
    data: {
      posterName: "Rahim",
      posterRating: 4.8,
      pickup: "Dhanmondi 27, cafe gate",
      destination: "University main gate",
      startTime: "8:45 AM",
      totalFare: 120,
      seatsOpen: 1,
      status: "open",
      notes: "Rickshaw already hired. Can pick up from nearby roads.",
      routeMatch: "Same direction as New Market and campus area",
      safetyTag: "Verified student email",
    },
  });

  await prisma.ridePost.create({
    data: {
      posterName: "Ayesha",
      posterRating: 4.9,
      pickup: "Kalabagan bus stand",
      destination: "Science Lab",
      startTime: "9:05 AM",
      totalFare: 90,
      seatsOpen: 1,
      status: "requested",
      notes: "Planning to hire within 10 minutes if someone joins.",
      routeMatch: "Short detour from Dhanmondi Road 8",
      safetyTag: "Phone verified",
    },
  });

  await prisma.ridePost.create({
    data: {
      posterName: "Nabila",
      posterRating: 4.7,
      pickup: "Mohammadpur town hall",
      destination: "Asad Gate",
      startTime: "9:20 AM",
      totalFare: 80,
      seatsOpen: 1,
      status: "open",
      notes: "Prefer pickup near the main road to avoid delay.",
      routeMatch: "Direct route, less than 5 min pickup adjustment",
      safetyTag: "3 completed shares",
    },
  });

  // Seed a join request on ride1
  await prisma.joinRequest.create({
    data: {
      rideId: ride1.id,
      requesterName: "Ayesha",
      requesterRating: 4.9,
      status: "pending",
      message: "I am two streets away and going to the same university gate.",
    },
  });

  console.log("✅ Seed completed:");
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
