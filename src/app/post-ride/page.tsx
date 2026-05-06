import Link from "next/link";

export default function PostRidePage() {
  return (
    <main className="min-h-screen bg-[#f7f2e8] px-5 py-6 text-[#1e1a14] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between rounded-full bg-white/85 px-5 py-3 shadow-sm">
          <Link href="/" className="text-lg font-black">Rickshare</Link>
          <Link href="/rides" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-black text-white">
            Browse rides
          </Link>
        </nav>

        <section className="grid gap-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#1f6b52]">User 1 flow</p>
            <h1 className="mt-3 text-5xl font-black tracking-[-0.06em] sm:text-6xl">
              Post the rickshaw you want to share.
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-[#6d6254]">
              This form supports both cases: the rickshaw is already hired, or
              the poster is planning to hire if another rider joins soon.
            </p>
            <div className="mt-6 rounded-[2rem] bg-[#123c2f] p-5 text-white">
              <p className="font-black text-[#f6c15b]">MVP rule</p>
              <p className="mt-2 font-medium leading-7 text-white/75">
                Maximum 2 riders total. The poster manually accepts the joiner.
                Fare split is guidance only; cash is handled between riders or
                directly with the rickshaw puller.
              </p>
            </div>
          </div>

          <form className="rounded-[2.5rem] bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 font-black">
                Your name
                <input className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none" placeholder="Rahim" />
              </label>
              <label className="grid gap-2 font-black">
                Start time
                <input className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none" placeholder="8:45 AM" />
              </label>
              <label className="grid gap-2 font-black sm:col-span-2">
                Pickup point
                <input className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none" placeholder="Dhanmondi 27, cafe gate" />
              </label>
              <label className="grid gap-2 font-black sm:col-span-2">
                Destination
                <input className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none" placeholder="University main gate" />
              </label>
              <label className="grid gap-2 font-black">
                Total fare
                <input className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none" placeholder="120 taka" />
              </label>
              <label className="grid gap-2 font-black">
                Ride state
                <select className="rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none">
                  <option>Rickshaw already hired</option>
                  <option>Planning to hire soon</option>
                </select>
              </label>
              <label className="grid gap-2 font-black sm:col-span-2">
                Note for joiner
                <textarea className="min-h-28 rounded-2xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 font-bold outline-none" placeholder="Can pick up from nearby roads." />
              </label>
            </div>
            <button className="mt-5 w-full rounded-2xl bg-[#f6c15b] py-4 text-lg font-black text-[#123c2f]" type="button">
              Publish Ride Post
            </button>
            <p className="mt-4 text-center text-sm font-bold text-[#6d6254]">
              Backend endpoint ready: POST /api/rides
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
