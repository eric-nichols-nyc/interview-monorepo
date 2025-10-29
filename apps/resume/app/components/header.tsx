"use client";

import { UserAvatarDropdown } from "@repo/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useResumeData } from "../../stores/resume-editor-store";
import { Logo } from "./logo";

export function Header() {
	const pathname = usePathname();
	const resume = useResumeData();

	// Check if we're on a resume route
	const isResumeRoute = pathname?.startsWith("/resume/");
	const displayTitle = isResumeRoute && resume?.name ? resume.name : "Resume Platform";

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4">
				<div className="flex items-center space-x-4">
					<Logo size={32} />
					<div className="h-8 w-px bg-border" />
				<div className="rounded-md bg-muted/90 px-3 py-1.5">
  <h1 className="font-semibold text-lg tracking-tight text-foreground">
    {displayTitle}
  </h1>
</div>
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
