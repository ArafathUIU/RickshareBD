export const dynamic = "force-dynamic";

import { getAllRides } from "@/lib/rickshare-data";
import DashboardMap from "./DashboardMap";

export default async function Home() {
  const rides = await getAllRides();

  // Serialize rides for client component
  const serializedRides = rides.map((ride) => ({
    id: ride.id,
    posterName: ride.posterName,
    posterRating: ride.posterRating,
    pickup: ride.pickup,
    destination: ride.destination,
    pickupLat: ride.pickupLat,
    pickupLng: ride.pickupLng,
    destLat: ride.destLat,
    destLng: ride.destLng,
    totalFare: ride.totalFare,
    status: ride.status,
    startTime: ride.startTime,
    seatsOpen: ride.seatsOpen,
  }));

  return <DashboardMap rides={serializedRides} />;
}
