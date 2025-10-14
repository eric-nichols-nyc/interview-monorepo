"use server";

import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import type { ActionResult, Resume } from "../../types/resume";
import type { Profile } from "../../types/profile";

async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

type CreateResumeData = {
  jobTitle: string;
  profile?: Profile | null;
};

/**
 * Create a new resume with job title and profile data
 */
export async function createResumeAction(
  data: CreateResumeData
): Promise<ActionResult<Resume>> {
  try {
    const userId = await getCurrentUserId();
    const { jobTitle, profile } = data;

    // Create resume with job title and profile data if available
    const resumeData: any = {
      userId,
      name: `Resume for ${jobTitle}`,
      targetRole: jobTitle,
      isBaseResume: false,
    };

    // Copy profile data to resume if available
    if (profile) {
      resumeData.firstName = profile.firstName;
      resumeData.lastName = profile.lastName;
      resumeData.email = profile.email;
      resumeData.phoneNumber = profile.phoneNumber;
      resumeData.location = profile.location;
      resumeData.website = profile.website;
      resumeData.linkedinUrl = profile.linkedinUrl;
      resumeData.githubUrl = profile.githubUrl;
      resumeData.workExperience = profile.workExperience || [];
      resumeData.education = profile.education || [];
      resumeData.skills = profile.skills || [];
      resumeData.projects = profile.projects || [];
      resumeData.certifications = profile.certifications || [];
    }

    const resume = await prisma.resume.create({
      data: resumeData,
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
    });

    return {
      success: true,
      data: resume,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create resume",
    };
  }
}
