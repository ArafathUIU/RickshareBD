"use client";

import { useEffect, useRef, useState } from "react";

export default function MapView({
  pickup,
  destination,
  pickupLat,
  pickupLng,
  destLat,
  destLng,
}: {
  pickup: string;
  destination: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destLat?: number | null;
  destLng?: number | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const check = () => {
      const L = (window as unknown as Record<string, unknown>).L as unknown;
      if (L) {
        setLeafletReady(true);
        clearInterval(interval);
      }
    };
    interval = setInterval(check, 200);
    check();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;

    const L = (window as unknown as Record<string, unknown>).L as unknown;
    if (!L) return;

    const map = L.map(mapRef.current).setView([23.8103, 90.4125], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds: [number, number][] = [];

    if (pickupLat && pickupLng) {
      const p = [pickupLat, pickupLng] as [number, number];
      L.marker(p).addTo(map).bindPopup(`Pickup: ${pickup}`);
      bounds.push(p);
    }

    if (destLat && destLng) {
      const d = [destLat, destLng] as [number, number];
      L.marker(d).addTo(map).bindPopup(`Destination: ${destination}`);
      bounds.push(d);
    }

    if (bounds.length === 2) {
      L.polyline(bounds, { color: "#123c2f", weight: 4, opacity: 0.8 }).addTo(map);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    }

    return () => {
      map.remove();
    };
  }, [leafletReady, pickup, destination, pickupLat, pickupLng, destLat, destLng]);

  if (!pickupLat && !destLat) {
    return (
      <div className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] p-6 text-center">
        <p className="text-sm font-medium text-[#6d6254]">Map location not available for this ride.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fbf7ef]">
      <div ref={mapRef} className="h-64 w-full sm:h-80" />
    </div>
  );
}
