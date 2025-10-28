"use server";

import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import type { ActionResult } from "../../types/resume";

// Get current user's ID
async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

/**
 * Delete user's profile
 */
export async function deleteProfileAction(): Promise<ActionResult<boolean>> {
  try {
    const userId = await getCurrentUserId();

    await prisma.profile.delete({
      where: { userId },
    });

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete profile",
    };
  }
}
