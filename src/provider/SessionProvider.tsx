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

  // During hydration/first render on client, match server exactly
  const session =
    !mounted || clientPending
      ? initialSession
      : (clientSession as SessionData | null);
  const isPending = !mounted
    ? false
    : clientPending && (initialSession === undefined || initialSession === null);

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
