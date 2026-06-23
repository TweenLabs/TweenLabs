"use client";

import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Lazy-load: only needed when user clicks Sign In
const AuthModal = dynamic(() => import("../components/AuthModal"), {
  loading: () => null,
});

interface AuthModalContextType {
  isOpen: boolean;
  isClosable: boolean;
  callbackUrl: string;
  openModal: (callbackUrl?: string, isClosable?: boolean) => void;
  closeModal: (force?: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosable, setIsClosable] = useState(true);
  const [callbackUrl, setCallbackUrl] = useState("/");
  const dismissedRef = useRef(false);

  // Auto-open the auth modal when proxy redirects with ?login=true
  useEffect(() => {
    if (searchParams?.get("login") === "true") {
      setCallbackUrl(pathname || "/");
      setIsClosable(true);
      setIsOpen(true);
      // Clean up the URL param without a full navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, pathname]);

  const openModal = useCallback((url = "/", closable = true) => {
    if (dismissedRef.current) return;
    setCallbackUrl(url);
    setIsClosable(closable);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((force = false) => {
    if (force) {
      dismissedRef.current = true;
      setTimeout(() => {
        dismissedRef.current = false;
      }, 1500);
      setIsOpen(false);
      return;
    }
    setIsClosable((current) => {
      if (current) setIsOpen(false);
      return current;
    });
  }, []);

  // Synchronous render-time check: if we navigated away from /code/
  // and the modal was opened as non-closable (by CodePageClient), suppress it instantly.
  const isOnCodePage = pathname?.startsWith("/code/");
  const shouldShow = isOpen && (isClosable || isOnCodePage);

  // Sync state: if the modal is stale, clear it so future openModal calls work
  if (isOpen && !shouldShow) {
    // Schedule state cleanup (can't call setState during render synchronously in strict mode)
    queueMicrotask(() => {
      setIsOpen(false);
      setIsClosable(true);
    });
  }

  return (
    <AuthModalContext.Provider
      value={{
        isOpen: shouldShow,
        isClosable,
        callbackUrl,
        openModal,
        closeModal,
      }}
    >
      {children}
      {shouldShow && <AuthModal />}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
