"use client";

import { UserAvatarDropdown } from "@repo/design-system";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="font-bold text-xl">Resume Platform</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            className="font-medium text-sm hover:underline"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link className="font-medium text-sm hover:underline" href="/profile">
            Profile
          </Link>
          <UserAvatarDropdown size="md" />
        </div>
      </div>
    </header>
  );
}
