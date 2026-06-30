"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getSavings, getSplitFare } from "@/lib/rickshare-data";

interface Ride {
  id: string;
  posterName: string;
  posterRating: number;
  pickup: string;
  destination: string;
  startTime: string;
  totalFare: number;
  status: string;
  routeMatch: string;
  safetyTag: string;
}

export default function RidesClientPage({ rides }: { rides: Ride[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const matchesSearch =
        search === "" ||
        ride.pickup.toLowerCase().includes(search.toLowerCase()) ||
        ride.destination.toLowerCase().includes(search.toLowerCase()) ||
        ride.posterName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || ride.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rides, search, statusFilter]);

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
        {/* Inline minimal navbar */}
        <div className="flex items-center justify-between rounded-full bg-[#fbf7ef] px-5 py-2.5 mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#123c2f] text-sm font-bold text-[#f6c15b]">R</div>
            <span className="text-base font-bold">Rickshare</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full px-4 py-2 text-sm font-semibold text-[#123c2f] transition hover:bg-white">Dashboard</Link>
            <Link href="/post-ride" className="rounded-full bg-[#123c2f] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">Post ride</Link>
          </div>
        </div>

        <section className="pb-6 pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b52]">Find a co-passenger ride</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Browse rickshaws posted by nearby riders.
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#6d6254]">
            Review route, trust signals, and fare split before requesting to join.
          </p>
        </section>

        {/* Filters */}
        <section className="pb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pickup, destination, or name..."
              className="flex-1 rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm outline-none focus:border-[#123c2f] focus:ring-1 focus:ring-[#123c2f]"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="requested">Requested</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
          <p className="mt-2 text-xs text-[#6d6254]">Showing {filteredRides.length} of {rides.length} rides</p>
        </section>

        <section className="pb-16">
          {filteredRides.length === 0 ? (
            <div className="rounded-3xl bg-[#fbf7ef] p-10 text-center">
              <p className="text-base font-semibold text-[#6d6254]">No rides match your search.</p>
              <button onClick={() => { setSearch(""); setStatusFilter("all"); }} className="mt-4 inline-block rounded-full bg-[#123c2f] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRides.map((ride) => (
                <article key={ride.id} className="group rounded-3xl bg-[#fbf7ef] p-4 transition hover:shadow-lg hover:shadow-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{ride.posterName}</p>
                      <p className="text-xs text-[#6d6254]">Rating {ride.posterRating} / 5</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1f6b52] shadow-sm">
                      {ride.status}
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">From</p>
                    <p className="mt-1 text-sm font-semibold">{ride.pickup}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8c77]">To</p>
                    <p className="mt-1 text-lg font-bold">{ride.destination}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-[#eadfce] bg-white p-3.5">
                      <p className="text-[10px] font-bold uppercase text-[#9a8c77]">Split fare</p>
                      <p className="mt-1 text-xl font-bold">{getSplitFare(ride.totalFare)}</p>
                      <p className="text-[10px] font-medium text-[#6d6254]">taka</p>
                    </div>
                    <div className="rounded-2xl bg-[#123c2f] p-3.5 text-white">
                      <p className="text-[10px] font-bold uppercase text-[#f6c15b]">Savings</p>
                      <p className="mt-1 text-xl font-bold">{getSavings(ride.totalFare)}</p>
                      <p className="text-[10px] font-medium text-white/70">taka</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-[#6d6254]">{ride.routeMatch}</p>
                  <Link href={`/rides/${ride.id}`} className="mt-3 block rounded-2xl bg-[#f6c15b] py-3 text-center text-sm font-bold text-[#123c2f] transition hover:brightness-105">
                    View and request
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
