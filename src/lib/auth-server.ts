import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

/**
 * Server-side auth utilities — used in Server Components and Route Handlers.
 *
 * Security:
 * - Convex URLs from env vars only — no hardcoded placeholders in production
 * - All exports are server-only — never import this in client components
 * - getToken / fetchAuthQuery catch errors at the call site (layout.tsx)
 */

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

if (!convexUrl && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is required in production. Set it in your environment variables.",
  );
}

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: convexUrl || "https://placeholder.convex.cloud",
  convexSiteUrl: convexSiteUrl || "https://placeholder.convex.site",
});
