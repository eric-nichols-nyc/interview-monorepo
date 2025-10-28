import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileAction } from "../../actions/profile/get-profile";
import { updateProfileAction } from "../../actions/profile/update-profile";
import type { Profile, ProfileFormData } from "../../types/profile";
import type { ActionResult } from "../../types/resume";

// Query Keys - centralized for consistency
export const profileKeys = {
  all: ["profile"] as const,
  current: () => [...profileKeys.all, "current"] as const,
  user: (userId: string) => [...profileKeys.all, userId] as const,
};

/**
 * Hook to fetch current user's profile
 * Use this on any page where you need to display profile data
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: getProfileAction,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes after unused
    retry: 2, // Retry failed requests twice

    // Transform the server action result to just the data
    select: (data: ActionResult<Profile | null>) => {
      if (data.success) {
        return data.data;
      }
      throw new Error(data.error || "Failed to fetch profile");
    },
  });
}

/**
 * Hook to update profile with optimistic updates and cache management
 * Use this in your form components
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileAction,

    // Optimistic update: immediately update the UI
    onMutate: async (newProfile: ProfileFormData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: profileKeys.current() });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(profileKeys.current());

      // Optimistically update to the new value
      queryClient.setQueryData(
        profileKeys.current(),
        (old: ActionResult<Profile | null> | undefined) => {
          if (!old?.success) {
            return old;
          }

          return {
            ...old,
            data: old.data
              ? {
                  ...old.data,
                  ...newProfile,
                  updatedAt: new Date(),
                }
              : null,
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousProfile };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          profileKeys.current(),
          context.previousProfile
        );
      }
    },

    // Always refetch after error or success to ensure consistency
    onSettled: (data) => {
      // If successful, update the cache with the server response
      if (data?.success) {
        queryClient.setQueryData(profileKeys.current(), data);
      }

      // Invalidate to trigger a refetch (ensures we have latest server data)
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

/**
 * Hook to prefetch profile data (useful for navigation optimization)
 */
export function usePrefetchProfile() {
  const queryClient = useQueryClient();

  const prefetchProfile = () => {
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getProfileAction,
      staleTime: 5 * 60 * 1000,
    });
  };

  return prefetchProfile;
}

/**
 * Hook to get cached profile data without triggering a fetch
 * Useful for displaying profile info in headers, sidebars, etc.
 */
export function useCachedProfile() {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData(profileKeys.current()) as
    | ActionResult<Profile | null>
    | undefined;

  return {
    profile: cachedData?.success ? cachedData.data : null,
    hasCache: !!cachedData,
    isStale: queryClient.getQueryState(profileKeys.current())?.isStale ?? true,
  };
}

/**
 * Hook to invalidate profile cache (useful after external updates)
 */
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: profileKeys.current() });
  };
}

/**
 * Helper to manually update profile cache from external sources
 */
export function useSetProfileCache() {
  const queryClient = useQueryClient();

  return (profile: Profile) => {
    queryClient.setQueryData(profileKeys.current(), {
      success: true,
      data: profile,
    } as ActionResult<Profile>);
  };
}
