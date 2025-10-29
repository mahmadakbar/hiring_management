"use client";

import HeaderBreadCrumb from "@components/molecules/BreadCrumb/HeaderBreadCrumb";
import ProfileHeader from "@components/molecules/Profile/ProfileHeader";
import { blacklistPaths } from "@utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Hide header on login and register pages
  if (blacklistPaths.includes(pathname)) {
    return null;
  }

  return (
    <header className="flex shrink-0 items-center justify-between rounded-lg bg-white px-4 py-5 text-black shadow-sm">
      <HeaderBreadCrumb />
      <div className="ml-auto">
        <ProfileHeader />
      </div>
    </header>
  );
}
