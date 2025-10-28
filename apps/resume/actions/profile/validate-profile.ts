"use server";

import { profileSchema } from "../../schemas/profile-schema";
import type { ProfileFormData } from "../../types/profile";
import type { ActionResult } from "../../types/resume";

/**
 * Validate profile data without saving
 */
export async function validateProfileAction(
  formData: ProfileFormData
): Promise<ActionResult<boolean>> {
  try {
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

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to validate profile",
    };
  }
}
