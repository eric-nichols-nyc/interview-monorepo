"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Hook to warn users about unsaved changes when they try to navigate away
 *
 * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
 * @param options - Optional configuration
 */
export function useUnsavedChanges(
  hasUnsavedChanges: boolean,
  options: {
    message?: string;
    enabled?: boolean;
  } = {}
) {
  const router = useRouter();
  const {
    message = "You have unsaved changes. Are you sure you want to leave?",
    enabled = true,
  } = options;

  // Track if we're in the middle of a programmatic navigation
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Handle browser refresh, close tab, etc.
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        // Modern browsers ignore custom messages and show their own
        e.preventDefault();
        e.returnValue = "";
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = (_e: PopStateEvent) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        const confirmed = window.confirm(message);
        if (confirmed) {
          isNavigatingRef.current = true;
        } else {
          // Push the current state back to prevent navigation
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, message, enabled]);

  // Override router methods to show confirmation
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;

    // Override router.push
    router.push = (href: string, options?: any) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        const confirmed = window.confirm(message);
        if (confirmed) {
          isNavigatingRef.current = true;
          return originalPush.call(router, href, options);
        }
        return Promise.resolve();
      }
      return originalPush.call(router, href, options);
    };

    // Override router.replace
    router.replace = (href: string, options?: any) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        const confirmed = window.confirm(message);
        if (confirmed) {
          isNavigatingRef.current = true;
          return originalReplace.call(router, href, options);
        }
        return Promise.resolve();
      }
      return originalReplace.call(router, href, options);
    };

    // Override router.back
    router.back = () => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        const confirmed = window.confirm(message);
        if (confirmed) {
          isNavigatingRef.current = true;
          return originalBack.call(router);
        }
        return;
      }
      return originalBack.call(router);
    };

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
    };
  }, [hasUnsavedChanges, message, enabled, router]);

  // Function to allow programmatic navigation without warning
  const navigateWithoutWarning = (navigateFn: () => void) => {
    isNavigatingRef.current = true;
    navigateFn();
    // Reset after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  };

  return {
    navigateWithoutWarning,
  };
}
