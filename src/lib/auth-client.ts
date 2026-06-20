import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL || "http://localhost:3000"),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  sessionOptions: {
    // Don't re-fetch session when user switches tabs.
    // The server already validates the session during SSR on each navigation.
    // Session has 7-day expiry with 1-day updateAge — server-side checks suffice.
    refetchOnWindowFocus: false,
  },
  plugins: [convexClient()],
});
