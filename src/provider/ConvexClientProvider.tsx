"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { AuthModalProvider } from "./AuthModalProvider";
import type { SessionData } from "./SessionProvider";
import { SessionProvider } from "./SessionProvider";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud",
);

export function ConvexClientProvider({
  children,
  initialToken,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialToken?: string | null;
  initialSession?: SessionData | null;
}) {
  const pathname = usePathname();

  // Preview/embed pages only render animations — skip Convex entirely
  // to avoid WebSocket connections and auth API calls from iframes.
  // SessionContext has a safe default value; AuthModalProvider is lightweight.
  if (pathname?.startsWith("/preview")) {
    return <AuthModalProvider>{children}</AuthModalProvider>;
  }

  return (
    <ConvexBetterAuthProvider
      client={convex}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authClient={authClient as any}
      initialToken={initialToken}
    >
      <SessionProvider initialSession={initialSession}>
        <AuthModalProvider>{children}</AuthModalProvider>
      </SessionProvider>
    </ConvexBetterAuthProvider>
  );
}
