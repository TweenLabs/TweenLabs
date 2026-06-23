"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Tracks page views on route changes.
 *
 * Production hardening:
 * - sessionStorage / crypto.randomUUID() wrapped in try-catch
 *   (can fail in incognito, restricted iframes, older browsers)
 * - All tracking errors silently swallowed — analytics must never crash the app
 * - Debounced (300ms) to avoid rapid-fire on navigation
 * - Deduplicates same path within one session
 */
export function useAnalytics() {
  const pathname = usePathname();

  // useMutation will crash without ConvexProvider (preview/embed pages).
  // We can't conditionally call hooks, so we use a try-catch wrapper.
  let trackPageView: ((args: {
    path: string;
    componentName?: string;
    sessionId?: string;
    referrer?: string;
  }) => Promise<unknown>) | null = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    trackPageView = useMutation(api.analytics.trackPageView);
  } catch {
    // No Convex provider (preview/embed pages) — analytics disabled
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Skip tracking for preview/embed, API, and internal routes
    if (
      pathname.startsWith("/preview/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/admin")
    ) {
      return;
    }

    // Avoid tracking the same path twice in a row
    if (pathname === lastTrackedRef.current) return;

    // Debounce rapid navigations
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      lastTrackedRef.current = pathname;

      // Get or create anonymous session ID (safe for restricted contexts)
      let sessionId: string | undefined;
      try {
        sessionId = sessionStorage.getItem("tl-session-id") ?? undefined;
        if (!sessionId) {
          sessionId =
            typeof crypto?.randomUUID === "function"
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          sessionStorage.setItem("tl-session-id", sessionId);
        }
      } catch {
        // sessionStorage blocked (incognito/iframe) — use ephemeral ID
        sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }

      // Extract component name from path
      let componentName: string | undefined;
      const componentMatch = pathname.match(
        /^\/(?:components|code)\/([A-Za-z0-9]+)/,
      );
      if (componentMatch) {
        componentName = componentMatch[1];
      }

      // Referrer — safe access
      let referrer: string | undefined;
      try {
        referrer = document.referrer || undefined;
      } catch {
        // SSR or restricted context
      }

      trackPageView?.({
        path: pathname,
        componentName,
        sessionId,
        referrer,
      })?.catch(() => {
        // Silently ignore — analytics must never break the app
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, trackPageView]);
}
