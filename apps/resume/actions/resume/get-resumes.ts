"use server";

import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import type { ActionResult, Resume } from "../../types/resume";

async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

/**
 * Get all resumes for the current user
 */
export async function getResumesAction(): Promise<ActionResult<Resume[]>> {
  try {
    const userId = await getCurrentUserId();

    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        jobId: true,
        isBaseResume: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        resumeTitle: true,
        targetRole: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      data: resumes,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch resumes",
    };
  }
}
