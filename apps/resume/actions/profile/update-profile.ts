"use server";

import { auth } from "@repo/auth/server";
import { prisma } from "@repo/database";
import { profileSchema } from "../../schemas/profile-schema";
import type { Profile, ProfileFormData } from "../../types/profile";
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
 * Update or create user's profile
 */
export async function updateProfileAction(
  formData: ProfileFormData
): Promise<ActionResult<Profile>> {
  try {
    const userId = await getCurrentUserId();

    // Validate the form data
    const validationResult = profileSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const path = error.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(error.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    const validatedData = validationResult.data;

    // Transform the data for database storage (ensure JSON fields are properly formatted)
    const dbData = {
      firstName: validatedData.firstName || null,
      lastName: validatedData.lastName || null,
      email: validatedData.email || null,
      phoneNumber: validatedData.phoneNumber || null,
      location: validatedData.location || null,
      website: validatedData.website || null,
      linkedinUrl: validatedData.linkedinUrl || null,
      githubUrl: validatedData.githubUrl || null,
      workExperience: validatedData.workExperience,
      education: validatedData.education,
      skills: validatedData.skills,
      projects: validatedData.projects,
      certifications: validatedData.certifications,
    };

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...dbData,
      },
      update: dbData,
    });

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
