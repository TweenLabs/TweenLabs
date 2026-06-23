"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/provider/AuthModalProvider";

export default function AuthModal() {
  const { isOpen, isClosable, callbackUrl, closeModal } = useAuthModal();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (isClosable) {
      // Modal was opened as a popup over the current page — just dismiss it
      closeModal();
    } else {
      // User is on a protected route (e.g. /code/...) — navigate away
      closeModal(true);
      if (callbackUrl?.startsWith("/code/")) {
        router.push(callbackUrl.replace("/code/", "/components/"));
      } else {
        router.push("/");
      }
    }
  }, [callbackUrl, router, closeModal, isClosable]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 350);
  };

  // Keyboard navigation & scroll trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isClosable) {
          closeModal();
        } else {
          handleBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isClosable, closeModal, handleBack]);

  if (!isOpen) return null;

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(provider);
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch {
      // Never expose raw auth errors to users — generic safe message only
      setError("Sign-in failed. Please try again or use a different provider.");
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        onClick={() => triggerShake()}
      />

      {/* Auth Card Modal Container */}
      <div
        className={`w-full max-w-[90vw] sm:max-w-md lg:max-w-lg brutalist-card bg-white relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col gap-4 sm:gap-6 select-none animate-in fade-in zoom-in-95 duration-200 ${
          isShaking ? "animate-brutalist-shake" : ""
        }`}
      >
        {/* Close Button (if closable) / Back Button (if not closable) */}
        {isClosable ? (
          <button
            onClick={() => closeModal()}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#2a2a2a] bg-[#fafaf9] hover:bg-wtf-red hover:text-white transition-colors duration-150 flex items-center justify-center font-mono font-bold text-sm cursor-pointer shadow-[2px_2px_0px_#2a2a2a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2a2a2a]"
            aria-label="Close modal"
          >
            ✕
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="absolute top-4 right-4 px-3 py-1 rounded border-2 border-[#2a2a2a] bg-[#fafaf9] hover:bg-wtf-yellow transition-colors duration-150 flex items-center gap-1 font-mono font-bold text-xs cursor-pointer shadow-[2px_2px_0px_#2a2a2a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2a2a2a]"
            aria-label="Go back"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        )}

        <div className="flex flex-col gap-2 border-b-3 border-[#2a2a2a] pb-6">
          <span className="text-[10px] font-mono font-bold text-wtf-orange uppercase tracking-wider">
            TweenLabs Authentication
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
            Join the Lab
          </h2>
          <p className="text-xs lg:text-sm font-sans font-medium text-zinc-500 mt-1 leading-relaxed">
            Please sign in to your developer account using Google or GitHub to
            view source codes and integration instructions.
          </p>
        </div>

        {error && (
          <div className="border-3 border-wtf-red bg-[#fef2f2] p-4 rounded-lg flex flex-col gap-1 shadow-[2px_2px_0px_#c53b3a]">
            <span className="text-[10px] font-mono font-bold text-wtf-red uppercase">
              Error
            </span>
            <p className="text-xs font-medium text-zinc-700">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSocialAuth("google")}
            disabled={isLoading !== null}
            className="w-full brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-[10px] sm:text-xs py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg uppercase tracking-wider cursor-pointer flex items-center justify-center gap-3 transition-colors duration-150"
          >
            {isLoading === "google" ? (
              <span className="w-4 h-4 border-2 border-t-transparent border-[#2a2a2a] rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.543 0 2.955.55 4.07 1.458l3.107-3.107C19.29 1.942 16.02 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.93 0 10.938-4.25 10.938-11 0-.68-.08-1.347-.238-1.715H12.24z" />
              </svg>
            )}
            <span>Sign In with Google</span>
          </button>

          <button
            onClick={() => handleSocialAuth("github")}
            disabled={isLoading !== null}
            className="w-full brutalist-btn bg-white hover:bg-zinc-100 text-[#2a2a2a] font-mono font-bold text-[10px] sm:text-xs py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg uppercase tracking-wider cursor-pointer flex items-center justify-center gap-3 transition-colors duration-150"
          >
            {isLoading === "github" ? (
              <span className="w-4 h-4 border-2 border-t-transparent border-[#2a2a2a] rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            )}
            <span>Sign In with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
