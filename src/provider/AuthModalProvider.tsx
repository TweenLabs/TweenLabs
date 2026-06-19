"use client";

import React, { createContext, useContext, useState } from "react";
import AuthModal from "../components/AuthModal";

interface AuthModalContextType {
  isOpen: boolean;
  isClosable: boolean;
  callbackUrl: string;
  openModal: (callbackUrl?: string, isClosable?: boolean) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosable, setIsClosable] = useState(true);
  const [callbackUrl, setCallbackUrl] = useState("/");

  const openModal = (url = "/", closable = true) => {
    setCallbackUrl(url);
    setIsClosable(closable);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (!isClosable) return; // Cannot close if isClosable is false
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{ isOpen, isClosable, callbackUrl, openModal, closeModal }}
    >
      {children}
      <AuthModal />
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
