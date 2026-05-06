const riderSteps = [
  {
    title: "Open app",
    detail: "Auto-detects pickup near Dhanmondi 27 and asks for destination.",
  },
  {
    title: "Compare fare",
    detail: "Shows solo 100 taka beside shared 60 taka before requesting.",
  },
  {
    title: "Find shared ride",
    detail: "Looks for nearby riders and drivers heading in the same direction.",
  },
  {
    title: "Ride confirmed",
    detail: "Displays driver identity, pickup order, live route, and savings.",
  },
];

const driverSteps = [
  "Go online",
  "Review 2-passenger request",
  "Accept higher earning trip",
  "Follow pickup sequence",
  "Complete ride and view earnings",
];

const adminMetrics = [
  ["Active rides", "18"],
  ["Match rate", "72%"],
  ["Avg. savings", "40 taka"],
  ["Online drivers", "46"],
];

const statusItems = [
  "Nearby rider found",
  "Driver accepts shared route",
  "Pickup order optimized",
  "Cash payment summary ready",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f2e8] text-[#1e1a14]">
      <section className="relative px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_30%_20%,#f6c15b_0,#f6c15b_24%,transparent_25%),linear-gradient(135deg,#123c2f,#1f6b52_55%,#f7f2e8_56%)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/30 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#123c2f] text-lg font-black text-[#f6c15b]">
              R
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">Rickshare</p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f6b52]">
                Dhaka shared rickshaw
              </p>
            </div>
          </div>
          <a
            className="hidden rounded-full bg-[#123c2f] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f6b52] sm:inline-flex"
            href="#prototype"
          >
            View prototype
          </a>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/50 bg-white/80 px-4 py-2 text-sm font-bold text-[#123c2f] shadow-sm">
              Phase 1 clickable-style UI concept
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              One rickshaw. Two riders. Better Dhaka mornings.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/85">
              Rickshare shows the money saved before the ride starts, matches
              nearby passengers going the same way, and gives drivers a higher
              earning shared trip.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#rider"
                className="rounded-full bg-[#f6c15b] px-6 py-3 text-center font-black text-[#123c2f] shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
              >
                Explore rider flow
              </a>
              <a
                href="#driver"
                className="rounded-full border border-white/45 px-6 py-3 text-center font-black text-white transition hover:bg-white/10"
              >
                See driver flow
              </a>
            </div>
          </div>

          <div id="prototype" className="rounded-[2.5rem] bg-[#1e1a14] p-3 shadow-2xl shadow-black/30">
            <div className="rounded-[2rem] bg-[#fbf7ef] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-[#1f6b52]">Good morning, Rahim</p>
                  <p className="text-xs font-semibold text-[#6d6254]">8:30 AM, Dhaka</p>
                </div>
                <div className="rounded-full bg-[#e6f3ec] px-3 py-1 text-xs font-black text-[#1f6b52]">
                  GPS on
                </div>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a8c77]">Pickup</p>
                <p className="mt-1 font-bold">Dhanmondi 27, near cafe gate</p>
                <div className="my-4 h-px bg-[#eee4d6]" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a8c77]">Destination</p>
                <p className="mt-1 text-2xl font-black">University</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-[#eadfce] bg-white p-4">
                  <p className="text-xs font-black uppercase text-[#9a8c77]">Solo ride</p>
                  <p className="mt-2 text-3xl font-black">100</p>
                  <p className="text-sm font-bold text-[#6d6254]">taka</p>
                </div>
                <div className="rounded-3xl bg-[#123c2f] p-4 text-white ring-4 ring-[#f6c15b]">
                  <p className="text-xs font-black uppercase text-[#f6c15b]">Shared ride</p>
                  <p className="mt-2 text-3xl font-black">60</p>
                  <p className="text-sm font-bold text-white/70">save 40 taka</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-2xl bg-[#f6c15b] py-4 text-lg font-black text-[#123c2f] shadow-sm">
                Find Shared Ride
              </button>
              <div className="mt-4 rounded-3xl bg-[#e6f3ec] p-4">
                <p className="font-black text-[#123c2f]">Matched with Ayesha</p>
                <p className="mt-1 text-sm font-semibold text-[#426555]">
                  Pickup is 2 streets away. Same direction confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rider" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">Rider journey</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              The fare comparison sells the share.
            </h2>
            <p className="mt-4 text-lg font-medium leading-8 text-[#6d6254]">
              The first prototype keeps the rider decision simple: destination,
              solo cost, shared cost, match progress, confirmed pickup, and a
              clear saved amount after drop-off.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {riderSteps.map((step, index) => (
              <article key={step.title} className="rounded-[2rem] bg-white p-5 shadow-sm">
                <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-[#123c2f] text-lg font-black text-[#f6c15b]">
                  {index + 1}
                </div>
                <h3 className="text-xl font-black">{step.title}</h3>
                <p className="mt-2 font-medium leading-7 text-[#6d6254]">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-[#123c2f] p-6 text-white lg:col-span-2">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c15b]">Matching phase</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">Looking for nearby riders...</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {statusItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 font-bold backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9a8c77]">Fallback</p>
            <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">No match?</h3>
            <p className="mt-4 font-medium leading-7 text-[#6d6254]">
              The rider gets a quick solo option instead of being stuck. Phase 1
              shows this as a mock state to validate the UX.
            </p>
          </div>
        </div>
      </section>

      <section id="driver" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="rounded-[2.5rem] bg-[#efe2cf] p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">Driver journey</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Shared rides must feel like higher income.
              </h2>
              <div className="mt-6 grid gap-3">
                {driverSteps.map((step) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-black shadow-sm">
                    <span className="size-3 rounded-full bg-[#1f6b52]" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-[#1e1a14] p-5 text-white shadow-xl">
              <p className="text-sm font-black text-[#f6c15b]">Incoming shared ride</p>
              <h3 className="mt-2 text-3xl font-black">2 passengers</h3>
              <div className="mt-5 rounded-3xl bg-white/10 p-4">
                <p className="text-sm font-bold text-white/60">Total earning</p>
                <p className="text-5xl font-black text-[#f6c15b]">120 taka</p>
              </div>
              <div className="mt-4 grid gap-3 text-sm font-bold text-white/80">
                <p>Pickup A: Dhanmondi 27</p>
                <p>Pickup B: Road 2, 3 min detour</p>
                <p>Drop: University gate</p>
              </div>
              <button className="mt-5 w-full rounded-2xl bg-[#1f6b52] py-4 font-black text-white">
                Accept Ride
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">Payment summary</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">You paid 60 taka.</h2>
            <p className="mt-4 text-lg font-medium text-[#6d6254]">Saved 40 taka compared with a solo ride.</p>
            <div className="mt-6 rounded-3xl bg-[#f7f2e8] p-5">
              <div className="flex justify-between font-bold"><span>Payment method</span><span>Cash</span></div>
              <div className="mt-3 flex justify-between font-bold"><span>Shared fare</span><span>60 taka</span></div>
              <div className="mt-3 flex justify-between font-bold text-[#1f6b52]"><span>Savings</span><span>40 taka</span></div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-[#123c2f] p-6 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c15b]">Admin snapshot</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">Pilot dashboard</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {adminMetrics.map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm font-bold text-white/60">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12">
        <div className="rounded-[2.5rem] bg-[#1e1a14] p-6 text-white sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c15b]">Phase 1 scope</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-2xl font-black">Included now</h3>
              <p className="mt-3 font-medium leading-7 text-white/70">
                Rider UI, driver UI, admin metrics, mock matching, fare comparison,
                cash summary, and trust cues.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black">Mocked now</h3>
              <p className="mt-3 font-medium leading-7 text-white/70">
                GPS, route map, real-time events, payments, and smart matching are
                represented visually only.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black">Next phase</h3>
              <p className="mt-3 font-medium leading-7 text-white/70">
                Add backend models, ride request APIs, persistent trips, and simple
                rule-based matching.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
