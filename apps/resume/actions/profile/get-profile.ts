"use server";

import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import type { Profile } from "../../types/profile";
import type { ActionResult } from "../../types/resume";

// Get current user's ID
async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/**
 * Get user's profile data
 */
export async function getProfileAction(): Promise<
  ActionResult<Profile | null>
> {
  try {
    const userId = await getCurrentUserId();

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
}
