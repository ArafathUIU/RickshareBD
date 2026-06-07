export const dynamic = "force-dynamic";

import { getAllRides, getAdminStats } from "@/lib/rickshare-data";
import DashboardMap from "./DashboardMap";

export default async function Home() {
  const rides = await getAllRides();
  const stats = await getAdminStats();

  return <DashboardMap rides={rides} stats={stats} />;
}
