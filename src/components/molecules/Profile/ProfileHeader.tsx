"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@components/atoms/avatar";
import { Button } from "@components/atoms/button";
import { useAuth } from "@hooks/useAuth";
import { Icon } from "@iconify/react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export default function ProfileHeader() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login">
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    );
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <h1 className="text-font-primary text-sm font-bold">{user.name}</h1>
        <p className="text-font-hilight text-xs">{user.email}</p>
      </div>

      <Avatar className="h-10 w-10">
        <AvatarImage src={user.image || ""} />
        <AvatarFallback className="text-xs">
          {user.name ? getUserInitials(user.name) : "U"}
        </AvatarFallback>
      </Avatar>

      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        className="flex items-center gap-2"
      >
        <Icon icon="tabler:door-exit" className="h-4 w-4" />
      </Button>
    </div>
  );
}
