import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="flex items-center justify-between rounded-full bg-[#fbf7ef] px-5 py-2.5">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#123c2f] text-sm font-bold text-[#f6c15b]">
          R
        </div>
        <span className="text-base font-bold">Rickshare</span>
      </Link>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="hidden text-sm font-medium text-[#6d6254] sm:inline">
              {user.name}
            </span>
            <Link href="/post-ride" className="rounded-full bg-[#123c2f] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">
              Post ride
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-[#123c2f] transition hover:bg-[#fbf7ef]">
              Log in
            </Link>
            <Link href="/register" className="rounded-full bg-[#f6c15b] px-4 py-2 text-sm font-bold text-[#123c2f] transition hover:brightness-105">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
