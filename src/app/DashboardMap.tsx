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
  notes: string;
  routeMatch: string;
  safetyTag: string;
  joinRequests?: JoinRequest[];
}

interface JoinRequest {
  id: string;
  requesterName: string;
  requesterRating: number;
  status: string;
  message: string;
}

interface Stats {
  openRides: number;
  joinRequests: number;
  averageSplitFare: number;
  completedShares: number;
}

export default function DashboardMap({ rides, stats }: { rides: Ride[]; stats: Stats }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [activeTab, setActiveTab] = useState<"rides" | "requests">("rides");
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

    const updateLocation = () => {
      locationSet.current = true;
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => updateLocation(),
        () => updateLocation()
      );
    } else {
      updateLocation();
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([23.7465, 90.3760], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Add ride markers
    rides.forEach((ride) => {
      if (ride.pickupLat && ride.pickupLng) {
        const rideIcon = L.divIcon({
          className: "ride-marker",
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background: #f6c15b;
              border: 3px solid #123c2f;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 11px;
              color: #123c2f;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${ride.totalFare}৳
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([ride.pickupLat, ride.pickupLng], { icon: rideIcon }).addTo(map);
        marker.on("click", () => {
          setSelectedRide(ride);
        });

        // Add destination marker too
        if (ride.destLat && ride.destLng) {
          const destIcon = L.divIcon({
            className: "dest-marker",
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: #123c2f;
                border: 2px solid #f6c15b;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          L.marker([ride.destLat, ride.destLng], { icon: destIcon }).addTo(map);
          
          // Draw route line
          L.polyline([[ride.pickupLat, ride.pickupLng], [ride.destLat, ride.destLng]], {
            color: "#123c2f",
            weight: 3,
            opacity: 0.6,
            dashArray: "6, 8",
          }).addTo(map);
        }
      }
    });

    return () => {
      map.remove();
    };
  }, [leafletReady, rides]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#123c2f]/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#f6c15b] text-lg font-bold text-[#123c2f]">
                R
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Rickshare Dashboard</h1>
                <p className="text-[10px] font-semibold text-[#f6c15b] uppercase tracking-wider">Live Ride Tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/rides" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                List View
              </Link>
              <Link href="/post-ride" className="rounded-full bg-[#f6c15b] px-4 py-2 text-sm font-bold text-[#123c2f] transition hover:brightness-105">
                + Post Ride
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-[#123c2f]/50 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-[#f6c15b]">{stats.openRides}</p>
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Open Rides</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-[#f6c15b]">{stats.joinRequests}</p>
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Pending Requests</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-[#f6c15b]">{stats.averageSplitFare}</p>
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Avg Split (৳)</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-[#f6c15b]">{stats.completedShares}</p>
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          {/* Map Section */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a2e] shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-bold text-[#f6c15b] uppercase tracking-wider">Live Map</h2>
                <span className="text-xs text-white/50">{rides.length} rides active</span>
              </div>
              <div ref={mapRef} className="h-[500px] w-full" />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setActiveTab("rides")}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  activeTab === "rides" ? "bg-[#f6c15b] text-[#123c2f]" : "text-white/50 hover:text-white"
                }`}
              >
                Rides ({rides.length})
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  activeTab === "requests" ? "bg-[#f6c15b] text-[#123c2f]" : "text-white/50 hover:text-white"
                }`}
              >
                Requests ({rides.reduce((acc, r) => acc + (r.joinRequests?.length || 0), 0)})
              </button>
            </div>

            {/* Rides Tab */}
            {activeTab === "rides" && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {rides.map((ride) => (
                  <div
                    key={ride.id}
                    onClick={() => setSelectedRide(ride)}
                    className={`rounded-xl border p-4 cursor-pointer transition ${
                      selectedRide?.id === ride.id
                        ? "border-[#f6c15b] bg-[#f6c15b]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#123c2f] text-sm font-bold text-[#f6c15b]">
                          {ride.posterName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{ride.posterName}</p>
                          <p className="text-xs text-white/50">{ride.pickup}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#f6c15b]">{ride.totalFare}৳</p>
                        <p className="text-[10px] text-white/50">{ride.status}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                      <span>→ {ride.destination}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-white/30">{ride.startTime}</span>
                      {ride.joinRequests && ride.joinRequests.length > 0 && (
                        <span className="rounded-full bg-[#f6c15b]/20 px-2 py-0.5 text-[10px] font-bold text-[#f6c15b]">
                          {ride.joinRequests.length} request{ride.joinRequests.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {rides.flatMap((r) => r.joinRequests?.map((req) => ({ ...req, ride: r })) || []).length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                    <p className="text-sm text-white/50">No join requests yet</p>
                  </div>
                ) : (
                  rides.flatMap((r) => r.joinRequests?.map((req) => ({ ...req, ride: r })) || []).map((req) => (
                    <div key={req.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-[#123c2f] text-xs font-bold text-[#f6c15b]">
                            {req.requesterName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{req.requesterName}</p>
                            <p className="text-xs text-white/50">wants to join {req.ride.posterName}&apos;s ride</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          req.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                          req.status === "accepted" ? "bg-green-500/20 text-green-500" :
                          "bg-red-500/20 text-red-500"
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-white/50">&ldquo;{req.message}&rdquo;</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-white/30">{req.ride.pickup} → {req.ride.destination}</span>
                        <Link href={`/rides/${req.ride.id}`} className="text-xs font-bold text-[#f6c15b] hover:underline">
                          View Ride →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Ride Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#1a1a2e] border border-white/10 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#f6c15b]">Ride Details</h3>
              <button
                onClick={() => setSelectedRide(null)}
                className="rounded-full bg-white/10 p-2 text-sm font-bold text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>
            
            <div className="rounded-2xl bg-[#123c2f]/50 p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#f6c15b] text-lg font-bold text-[#123c2f]">
                  {selectedRide.posterName.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold">{selectedRide.posterName}</p>
                  <p className="text-xs text-white/50">Rating {selectedRide.posterRating}/5 • {selectedRide.safetyTag}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-3 rounded-full bg-[#f6c15b]" />
                  <div>
                    <p className="text-xs text-white/50">Pickup</p>
                    <p className="text-sm font-semibold">{selectedRide.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-3 rounded-full bg-[#123c2f] border border-[#f6c15b]" />
                  <div>
                    <p className="text-xs text-white/50">Destination</p>
                    <p className="text-sm font-semibold">{selectedRide.destination}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-white/50">Fare</p>
                  <p className="text-lg font-bold text-white">{selectedRide.totalFare}৳</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-white/50">Split</p>
                  <p className="text-lg font-bold text-[#f6c15b]">{Math.ceil(selectedRide.totalFare / 2)}৳</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-white/50">Time</p>
                  <p className="text-lg font-bold text-white">{selectedRide.startTime}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/rides/${selectedRide.id}`}
                className="flex-1 rounded-full bg-[#f6c15b] py-3 text-center text-sm font-bold text-[#123c2f] transition hover:brightness-105"
              >
                Full Details
              </Link>
              <button
                onClick={() => setSelectedRide(null)}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white/50 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
