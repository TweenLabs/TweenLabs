"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";

import { AuthModalProvider } from "./AuthModalProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: React.ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authClient={authClient as any}
      initialToken={initialToken}
    >
      <AuthModalProvider>
        {children}
      </AuthModalProvider>
    </ConvexBetterAuthProvider>
  );
}
