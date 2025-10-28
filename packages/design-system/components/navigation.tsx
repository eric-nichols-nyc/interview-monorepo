"use client";

import { useAuth } from "@repo/auth/provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

type NavigationProps = {
  className?: string;
};

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Redirect will be handled by middleware
  };

  const navLinks = [
    {
      name: "Resume App",
      href: "http://localhost:3000",
      active: pathname === "/" && window.location.port === "3000",
    },
    {
      name: "Interview App",
      href: "http://localhost:3001",
      active: pathname === "/" && window.location.port === "3001",
    },
    {
      name: "Search App",
      href: "http://localhost:3002",
      active: pathname === "/" && window.location.port === "3002",
    },
  ];

  return (
    <nav
      className={`flex items-center justify-between border-b p-4 ${className}`}
    >
      <div className="flex items-center space-x-6">
        <div className="font-bold text-lg">Interview Platform</div>
        <div className="flex space-x-4">
          {navLinks.map((link) => (
            <Link
              className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                link.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              href={link.href}
              key={link.name}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground text-sm">{user.email}</span>
          <Button onClick={handleSignOut} size="sm" variant="outline">
            Sign Out
          </Button>
        </div>
      )}
    </nav>
  );
}
