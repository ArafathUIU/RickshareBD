"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const check = () => {
      const w = window as any;
      if (w && w.L) {
        setLeafletReady(true);
        if (interval) clearInterval(interval);
      }
    };
    interval = setInterval(check, 200);
    check();
    return () => { if (interval) clearInterval(interval); };
  }, []);

  // Fetch OSRM route
  useEffect(() => {
    if (!pickupLat || !pickupLng || !destLat || !destLng) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoadingRoute(true);
    const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates as [number, number][];
          // OSRM returns [lng, lat], Leaflet needs [lat, lng]
          setRouteCoords(coords.map(([lng, lat]) => [lat, lng]));
        }
      })
      .catch(() => setRouteCoords(null))
      .finally(() => {
        loadingRef.current = false;
        setLoadingRoute(false);
      });
  }, [pickupLat, pickupLng, destLat, destLng]);

  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;

    const L = (window as any).L;
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

    if (routeCoords && routeCoords.length > 0) {
      L.polyline(routeCoords, { color: "#123c2f", weight: 4, opacity: 0.8 }).addTo(map);
      map.fitBounds(routeCoords, { padding: [40, 40] });
    } else if (bounds.length === 2) {
      L.polyline(bounds, { color: "#123c2f", weight: 4, opacity: 0.8, dashArray: "8, 8" }).addTo(map);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    }

    return () => {
      map.remove();
    };
  }, [leafletReady, pickup, destination, pickupLat, pickupLng, destLat, destLng, routeCoords]);

  if (!pickupLat && !destLat) {
    return (
      <div className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] p-6 text-center">
        <p className="text-sm font-medium text-[#6d6254]">Map location not available for this ride.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fbf7ef]">
      {loadingRoute && (
        <div className="px-4 py-2 text-center">
          <p className="text-xs font-medium text-[#6d6254]">Loading route...</p>
        </div>
      )}
      <div ref={mapRef} className="h-64 w-full sm:h-80" />
    </div>
  );
}
