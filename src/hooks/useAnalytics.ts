"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Tracks page views on route changes.
 *
 * - Generates a random anonymous session ID in sessionStorage
 *   (dies when the tab closes — not a persistent cookie).
 * - Sends userId automatically if the user is authenticated (handled server-side).
 * - Debounced: won't fire on rapid navigations (300ms debounce).
 * - Extracts componentName from /components/X or /code/X paths.
 */
export function useAnalytics() {
  const pathname = usePathname();
  const trackPageView = useMutation(api.analytics.trackPageView);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Skip tracking for preview/embed routes and API routes
    if (
      pathname.startsWith("/preview/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/")
    ) {
      return;
    }

    // Avoid tracking the same path twice in a row
    if (pathname === lastTrackedRef.current) return;

    // Debounce rapid navigations
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      lastTrackedRef.current = pathname;

      // Get or create anonymous session ID
      let sessionId = sessionStorage.getItem("tl-session-id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("tl-session-id", sessionId);
      }

      // Extract component name from path
      let componentName: string | undefined;
      const componentMatch = pathname.match(
        /^\/(?:components|code)\/([A-Za-z0-9]+)/,
      );
      if (componentMatch) {
        componentName = componentMatch[1];
      }

      trackPageView({
        path: pathname,
        componentName,
        sessionId,
        referrer: document.referrer || undefined,
      }).catch(() => {
        // Silently ignore tracking errors — analytics should never break the app
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, trackPageView]);
}
