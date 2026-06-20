"use client";

import React, { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date | string;
  };
}

interface SessionContextType {
  session: SessionData | null;
  isPending: boolean;
  error: Error | null;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isPending: true,
  error: null,
});

export function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: SessionData | null;
}) {
  const {
    data: clientSession,
    isPending: clientPending,
    error,
  } = authClient.useSession();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Trust server-provided session until client explicitly resolves.
  // This prevents a flash of loading state and avoids downstream
  // re-renders that trigger duplicate Convex token fetches.
  const session = React.useMemo(() => {
    // During SSR / hydration: use server data
    if (!mounted) return initialSession;
    // Client has resolved: use client data
    if (!clientPending) return clientSession as SessionData | null;
    // Client is still loading: keep showing server data (no flash)
    return initialSession;
  }, [mounted, clientPending, clientSession, initialSession]);

  // Only show "pending" if we have NO data at all (no server session, client still loading)
  const isPending = !mounted ? false : clientPending && !initialSession;

  return (
    <SessionContext.Provider
      value={{ session, isPending, error: error as Error | null }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
