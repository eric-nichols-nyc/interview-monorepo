import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createResumeAction } from "../../actions/resume/create-resume";
import { deleteResumeAction } from "../../actions/resume/delete-resume";
import { getResumesAction } from "../../actions/resume/get-resumes";
import type { Profile } from "../../types/profile";
import type { ActionResult, Resume } from "../../types/resume";

export const resumeKeys = {
  all: ["resumes"] as const,
  lists: () => [...resumeKeys.all, "list"] as const,
  list: (userId?: string) => [...resumeKeys.lists(), { userId }] as const,
  details: () => [...resumeKeys.all, "detail"] as const,
  detail: (id: string) => [...resumeKeys.details(), id] as const,
};

/**
 * Hook to fetch all resumes for the current user
 */
const STALE_TIME_MS = 120_000; // 2 minutes
const GC_TIME_MS = 600_000; // 10 minutes

export function useResumes() {
  return useQuery({
    queryKey: resumeKeys.lists(),
    queryFn: getResumesAction,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    select: (data: ActionResult<Resume[]>) => {
      if (data.success) {
        return data.data || [];
      }
      throw new Error(data.error || "Failed to fetch resumes");
    },
  });
}

type CreateResumeInput = {
  jobTitle: string;
  profile?: Profile | null;
};

/**
 * Hook to create a new resume with job title and profile data
 */
export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeInput) => createResumeAction(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      }
    },
  });
}

/**
 * Hook to delete a resume
 */
export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResumeAction(id),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      }
    },
  });
}
