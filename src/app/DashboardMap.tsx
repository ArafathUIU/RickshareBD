"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Ride {
  id: string;
  posterName: string;
  posterRating: number;
  pickup: string;
  destination: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destLat?: number | null;
  destLng?: number | null;
  totalFare: number;
  status: string;
  startTime: string;
  seatsOpen: number;
}

export default function DashboardMap({ rides }: { rides: Ride[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const locationSet = useRef(false);

  // Wait for Leaflet
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

  // Get user location
  useEffect(() => {
    if (locationSet.current) return;

    const updateLocation = (loc: [number, number]) => {
      locationSet.current = true;
      setUserLocation(loc);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => updateLocation([pos.coords.latitude, pos.coords.longitude]),
        () => updateLocation([23.8103, 90.4125])
      );
    } else {
      updateLocation([23.8103, 90.4125]);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapRef.current || !userLocation) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(userLocation, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Add user location marker (blue dot)
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker(userLocation, { icon: userIcon }).addTo(map).bindPopup("You are here");

    // Add ride markers
    rides.forEach((ride) => {
      if (ride.pickupLat && ride.pickupLng) {
        const rideIcon = L.divIcon({
          className: "ride-marker",
          html: `
            <div style="
              width: 44px;
              height: 44px;
              background: #f6c15b;
              border: 3px solid #123c2f;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              color: #123c2f;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${ride.totalFare}৳
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const marker = L.marker([ride.pickupLat, ride.pickupLng], { icon: rideIcon }).addTo(map);
        marker.on("click", () => {
          setSelectedRide(ride);
        });
      }
    });

    return () => {
      map.remove();
    };
  }, [leafletReady, userLocation, rides]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a1a2e]">
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-[#123c2f]/90 px-4 py-2.5 backdrop-blur-md">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#f6c15b] text-sm font-bold text-[#123c2f]">
              R
            </div>
            <span className="text-sm font-bold text-white">Rickshare</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile" className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-bold text-[#123c2f] backdrop-blur-md transition hover:bg-white">
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom sheet with ride cards */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="rounded-t-3xl bg-[#123c2f]/95 p-4 backdrop-blur-md">
          {/* Drag handle */}
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/30" />

          {/* Stats row */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div>
              <p className="text-xs font-bold text-[#f6c15b] uppercase tracking-wide">{rides.length} rides nearby</p>
              <p className="text-xs text-white/60">Tap a marker to view details</p>
            </div>
            <Link href="/rides" className="rounded-full bg-[#f6c15b] px-4 py-2 text-xs font-bold text-[#123c2f] transition hover:brightness-105">
              List view
            </Link>
          </div>

          {/* Horizontal scroll ride cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {rides.map((ride) => (
              <button
                key={ride.id}
                onClick={() => setSelectedRide(ride)}
                className={`flex-shrink-0 w-64 rounded-2xl p-4 text-left transition ${
                  selectedRide?.id === ride.id ? "bg-[#f6c15b] text-[#123c2f]" : "bg-white/10 text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{ride.posterName}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    selectedRide?.id === ride.id ? "bg-[#123c2f] text-[#f6c15b]" : "bg-[#f6c15b] text-[#123c2f]"
                  }`}>
                    {ride.totalFare}৳
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/70">{ride.pickup} → {ride.destination}</p>
                <p className="mt-1 text-[10px] text-white/50">{ride.startTime} • {ride.status}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected ride detail overlay */}
      {selectedRide && (
        <div className="absolute inset-0 z-20 flex items-end justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#123c2f]">{selectedRide.posterName}&apos;s Ride</h3>
              <button
                onClick={() => setSelectedRide(null)}
                className="rounded-full bg-[#fbf7ef] p-2 text-sm font-bold text-[#123c2f]"
              >
                ✕
              </button>
            </div>
            <div className="rounded-2xl bg-[#fbf7ef] p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#123c2f] text-sm font-bold text-[#f6c15b]">
                  {selectedRide.posterName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{selectedRide.posterName}</p>
                  <p className="text-xs text-[#6d6254]">Rating {selectedRide.posterRating}/5</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#123c2f]" />
                  <p className="text-sm">{selectedRide.pickup}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#f6c15b]" />
                  <p className="text-sm font-bold">{selectedRide.destination}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-3">
                <div className="flex-1 rounded-xl bg-white p-3 text-center">
                  <p className="text-xs text-[#6d6254]">Fare</p>
                  <p className="text-lg font-bold text-[#123c2f]">{selectedRide.totalFare}৳</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#123c2f] p-3 text-center text-white">
                  <p className="text-xs text-[#f6c15b]">Split</p>
                  <p className="text-lg font-bold">{Math.ceil(selectedRide.totalFare / 2)}৳</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href={`/rides/${selectedRide.id}`}
                className="flex-1 rounded-full bg-[#f6c15b] py-3 text-center text-sm font-bold text-[#123c2f] transition hover:brightness-105"
              >
                View Details
              </Link>
              <button
                onClick={() => setSelectedRide(null)}
                className="rounded-full border border-[#eadfce] px-5 py-3 text-sm font-bold text-[#6d6254]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Post Ride button */}
      <div className="absolute bottom-48 right-4 z-10">
        <Link
          href="/post-ride"
          className="flex size-14 items-center justify-center rounded-full bg-[#f6c15b] shadow-lg shadow-black/30 transition hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-[#123c2f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
