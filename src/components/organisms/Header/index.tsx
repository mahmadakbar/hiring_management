"use client";

// import { RakaminLogo } from "@assets/icon";
import ProfileHeader from "@components/molecules/Profile/ProfileHeader";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const blacklistPaths = ["/login", "/register"];

  // Hide header on login and register pages
  if (blacklistPaths.includes(pathname)) {
    return null;
  }
  return (
    <header className="flex shrink-0 items-center justify-between rounded-lg bg-white px-4 py-5 text-black shadow-sm">
      <Link href="/">
        {/* <RakaminLogo /> */}
        <h1 className="text-lg font-bold">Job List</h1>
      </Link>
      <ProfileHeader />
    </header>
  );
}
