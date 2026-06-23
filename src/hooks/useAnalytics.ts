"use client";

import { useMutation } from "convex/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { api } from "../../convex/_generated/api";

/**
 * Safely wraps `useMutation` — returns `null` when no ConvexProvider is in the
 * tree (e.g. preview/embed iframes that skip Convex entirely).
 *
 * React hooks must be called unconditionally, so we always call `useMutation`
 * but catch the invariant error thrown when the provider is absent.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function useSafeMutation<T extends (...args: any[]) => any>(
  mutation: any,
): T | null {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  try {
    // biome-ignore lint/correctness/useHookAtTopLevel: Intentional — always called, provider may be absent
    return useMutation(mutation) as unknown as T;
  } catch {
    return null;
  }
}

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
  const trackPageView = useSafeMutation<
    (args: {
      path: string;
      componentName?: string;
      sessionId?: string;
      referrer?: string;
    }) => Promise<unknown>
  >(api.analytics.trackPageView);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    if (!pathname || !trackPageView) return;

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

      trackPageView({
        path: pathname,
        componentName,
        sessionId,
        referrer,
      }).catch(() => {
        // Silently ignore — analytics must never break the app
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, trackPageView]);
}
