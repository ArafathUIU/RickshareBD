export type RideStatus = "open" | "requested" | "confirmed" | "completed";

export type RidePost = {
  id: string;
  posterName: string;
  posterRating: number;
  pickup: string;
  destination: string;
  startTime: string;
  totalFare: number;
  seatsOpen: number;
  status: RideStatus;
  notes: string;
  routeMatch: string;
  safetyTag: string;
};

export type JoinRequest = {
  id: string;
  rideId: string;
  requesterName: string;
  requesterRating: number;
  status: "pending" | "accepted" | "rejected";
  message: string;
};

export const ridePosts: RidePost[] = [
  {
    id: "ride-101",
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
  {
    id: "ride-102",
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
  {
    id: "ride-103",
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
];

export const joinRequests: JoinRequest[] = [
  {
    id: "join-501",
    rideId: "ride-101",
    requesterName: "Ayesha",
    requesterRating: 4.9,
    status: "pending",
    message: "I am two streets away and going to the same university gate.",
  },
];

export function getRideById(id: string) {
  return ridePosts.find((ride) => ride.id === id);
}

export function getRequestsForRide(rideId: string) {
  return joinRequests.filter((request) => request.rideId === rideId);
}

export function getSplitFare(totalFare: number, riders = 2) {
  return Math.ceil(totalFare / riders);
}

export function getSavings(totalFare: number) {
  return totalFare - getSplitFare(totalFare);
}

export function getAdminStats() {
  return {
    openRides: ridePosts.filter((ride) => ride.status === "open").length,
    joinRequests: joinRequests.filter((request) => request.status === "pending").length,
    averageSplitFare: Math.round(
      ridePosts.reduce((sum, ride) => sum + getSplitFare(ride.totalFare), 0) /
        ridePosts.length,
    ),
    completedShares: 24,
  };
}
