"use server";

import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import type { ActionResult } from "../../types/resume";

async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

/**
 * Delete a resume
 */
export async function deleteResumeAction(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();

    // First check if the resume exists and belongs to the user
    const existingResume = await prisma.resume.findFirst({
      where: { id, userId },
      select: { id: true, name: true },
    });

    if (!existingResume) {
      return {
        success: false,
        error: "Resume not found or you don't have permission to delete it",
      };
    }

    // Delete the resume
    await prisma.resume.delete({
      where: { id },
    });

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete resume",
    };
  }
}