export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(address + ", Dhaka, Bangladesh");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      { headers: { "User-Agent": "RickshareBD/1.0" } }
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return {
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getRouteInfo(
  pickup: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{
  geometry: [number, number][];
  distanceKm: number;
  durationMin: number;
} | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coords = route.geometry.coordinates as [number, number][];
      // OSRM returns [lng, lat], we need [lat, lng] for Leaflet
      const geometry = coords.map(([lng, lat]) => [lat, lng]) as [number, number][];
      // distance in meters, duration in seconds
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMin = Math.round(route.duration / 60);
      return { geometry, distanceKm, durationMin };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getRouteGeometry(
  pickup: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<[number, number][] | null> {
  const info = await getRouteInfo(pickup, destination);
  return info?.geometry ?? null;
}
