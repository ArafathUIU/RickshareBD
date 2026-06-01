import Link from "next/link";
import PostRideForm from "./PostRideForm";

export default function PostRidePage() {
  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between rounded-full bg-[#fbf7ef] px-5 py-2.5">
          <Link href="/" className="text-base font-bold">Rickshare</Link>
          <Link href="/rides" className="rounded-full bg-[#123c2f] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110">
            Browse rides
          </Link>
        </nav>
      </div>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-4 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b52]">User 1 flow</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Post the rickshaw you want to share.
            </h1>
            <p className="mt-4 text-sm font-medium leading-relaxed text-[#6d6254]">
              Works whether the rickshaw is already hired or you are planning to hire if another rider joins soon.
            </p>
            <div className="mt-5 rounded-2xl bg-[#123c2f] p-5 text-white">
              <p className="text-sm font-bold text-[#f6c15b]">MVP rule</p>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-white/75">
                Maximum 2 riders total. The poster manually accepts the joiner.
                Fare split is guidance only; cash is handled between riders.
              </p>
            </div>
          </div>

          <PostRideForm />
        </div>
      </section>
    </main>
  );
}
