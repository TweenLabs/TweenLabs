"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";

import { AuthModalProvider } from "./AuthModalProvider";
import { SessionProvider } from "./SessionProvider";
import type { SessionData } from "./SessionProvider";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud"
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
  return (
    <ConvexBetterAuthProvider
      client={convex}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authClient={authClient as any}
      initialToken={initialToken}
    >
      <SessionProvider initialSession={initialSession}>
        <AuthModalProvider>
          {children}
        </AuthModalProvider>
      </SessionProvider>
    </ConvexBetterAuthProvider>
  );
}

