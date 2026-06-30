export const dynamic = "force-dynamic";

import { getAllRides } from "@/lib/rickshare-data";
import RidesClientPage from "./RidesClientPage";

export default async function RidesPage() {
  const rides = await getAllRides();
  return <RidesClientPage rides={rides} />;
}
