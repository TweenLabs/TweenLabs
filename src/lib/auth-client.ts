import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Client-side auth — used in client components for session state and sign-in flows.
 *
 * Security:
 * - baseURL derived from env var → window.location.origin fallback (never hardcoded production URLs)
 * - Session config: 7-day expiry with daily refresh
 * - refetchOnWindowFocus disabled — server validates session on each SSR navigation
 */

function getBaseURL(): string {
  // 1. Explicit env var (set in .env.local)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // 2. Browser origin (client-side)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // 3. Server-side fallback (only during SSR/build)
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Refresh daily
  },
  sessionOptions: {
    // Server validates session on each SSR navigation — no need to refetch on tab focus.
    // This prevents unnecessary API calls and auth state flicker.
    refetchOnWindowFocus: false,
  },
  plugins: [convexClient()],
});
