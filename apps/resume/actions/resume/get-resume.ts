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
 * Get a single resume by ID
 */
export async function getResumeAction(id: string): Promise<ActionResult<Resume | null>> {
  try {
    const userId = await getCurrentUserId();

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own resumes
      },
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
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        location: true,
        website: true,
        linkedinUrl: true,
        githubUrl: true,
        professionalSummary: true,
        workExperience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        sectionOrder: true,
        sectionConfigs: true,
        documentSettings: true,
        hasCoverLetter: true,
        coverLetter: true,
      },
    });

    return {
      success: true,
      data: resume,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get resume",
    };
  }
}