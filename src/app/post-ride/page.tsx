import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PostRideForm from "./PostRideForm";
import Navbar from "../Navbar";

export default async function PostRidePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/post-ride");
  }

  return (
    <main className="min-h-screen bg-white text-[#1e1a14]">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 lg:px-12">
        <Navbar />
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
