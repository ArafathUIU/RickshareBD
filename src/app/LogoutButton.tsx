"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-[#eadfce] px-4 py-2 text-sm font-semibold text-[#6d6254] transition hover:bg-[#fbf7ef]"
    >
      Log out
    </button>
  );
}
