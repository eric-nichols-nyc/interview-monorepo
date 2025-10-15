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

type UpdateResumeData = {
  id: string;
  data: Partial<Resume>;
  lastUpdated?: Date | null; // For optimistic concurrency control
};

/**
 * Update an existing resume
 */
export async function updateResumeAction({
  id,
  data,
  lastUpdated,
}: UpdateResumeData): Promise<ActionResult<Resume>> {
  try {
    const userId = await getCurrentUserId();

    // First check if the resume exists and belongs to the user
    const existingResume = await prisma.resume.findFirst({
      where: { id, userId },
      select: { updatedAt: true },
    });

    if (!existingResume) {
      return {
        success: false,
        error: "Resume not found or you don't have permission to edit it",
      };
    }

    // Optional: Check for concurrent edits if lastUpdated is provided
    if (lastUpdated && existingResume.updatedAt > lastUpdated) {
      return {
        success: false,
        error: "Resume has been modified by another session",
        // You could return the server data here for conflict resolution
      };
    }

    // Prepare data for update, removing fields that shouldn't be updated directly
    const { id: _, userId: __, createdAt: ___, ...updateData } = data;

    const updatedResume = await prisma.resume.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
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
      data: updatedResume,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update resume",
    };
  }
}