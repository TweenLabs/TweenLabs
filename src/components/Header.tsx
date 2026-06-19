"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { animations } from "@/data/animations";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/provider/AuthModalProvider";
import { useSession } from "@/provider/SessionProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isPending } = useSession();
  const { openModal } = useAuthModal();

  const handleGetCode = (animRoute: string) => {
    const codeUrl = `/code/${animRoute.slice(1)}`;
    if (session) {
      router.push(codeUrl);
    } else {
      openModal(animRoute, true);
    }
  };
  const [avatarError, setAvatarError] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasEverOpened, setHasEverOpened] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Sync state when user session changes
  if (session?.user.id !== lastUserId) {
    setLastUserId(session?.user.id);
    setAvatarError(false);
  }

  // Normalize pathname to handle trailing slashes
  const normalizedPath = pathname ? pathname.replace(/\/$/, "") : "";

  // Check if current page matches an animation route (e.g. /17-showup-cards)
  const currentAnim = animations.find((anim) => anim.route === normalizedPath);

  // Check if current page is a code page (e.g. /code/17-showup-cards)
  const isCodePage = normalizedPath.startsWith("/code/");
  const codeSlug = isCodePage ? normalizedPath.split("/").pop() || null : null;
  const codeAnim = codeSlug
    ? animations.find((anim) => anim.route.slice(1) === codeSlug)
    : null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fafaf9] border-b-3 border-[#2a2a2a]">
      <div className="w-full px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          {currentAnim && (
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = "/";
                  }
                }
              }}
              className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-[10px] md:text-xs py-1 px-2.5 md:py-1.5 md:px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
            >
              ← Back
            </button>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            aria-label="TweenLabs Home"
          >
            <Image
              src="/logo.svg"
              alt="TweenLabs Logo"
              width={28}
              height={28}
              priority
              className="object-contain transition-transform duration-200 group-hover:scale-105 w-7 h-7 md:w-8 md:h-8"
            />
            <span className="font-serif font-black text-lg md:text-2xl tracking-tight text-[#2a2a2a] group-hover:text-wtf-orange transition-colors duration-150">
              TweenLabs
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          {currentAnim && (
            <button
              onClick={() => handleGetCode(currentAnim.route)}
              className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
              aria-label={`Get source code for ${currentAnim.name}`}
            >
              Get Code
            </button>
          )}

          {codeAnim && (
            <Link
              href={codeAnim.route}
              className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
              aria-label={`View live sandbox demo for ${codeAnim.name}`}
            >
              View Demo
            </Link>
          )}

          <a
            href="https://github.com/TweenLabs/TweenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
            aria-label="Star TweenLabs repository on GitHub"
          >
            Star us on GitHub ↗
          </a>

          {!mounted || isPending ? (
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Loading...
            </span>
          ) : session ? (
            <div className="flex items-center gap-2.5">
              {session.user.image && !avatarError ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={28}
                  height={28}
                  onError={() => setAvatarError(true)}
                  className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-wtf-purple text-white flex items-center justify-center font-mono font-bold text-[10px]">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <button
                onClick={async () => {
                  await authClient.signOut();
                  window.location.reload();
                }}
                className="brutalist-btn bg-wtf-red hover:bg-[#a82a29] text-white font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => openModal()}
              className="brutalist-btn bg-wtf-green hover:bg-[#09734f] text-white font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => {
            if (!mobileMenuOpen) setHasEverOpened(true);
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] cursor-pointer z-[60]"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-5 h-[2.5px] bg-[#2a2a2a] rounded-full transition-all duration-300 origin-center ${
              mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2.5px] bg-[#2a2a2a] rounded-full transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2.5px] bg-[#2a2a2a] rounded-full transition-all duration-300 origin-center ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Lazy-mounted mobile menu: zero DOM cost until first open, stays mounted after */}
      {hasEverOpened && (
        <>
          {/* Backdrop overlay — toggled via opacity + pointer-events for zero layout cost */}
          <div
            className={`md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide panel — toggled via transform, always in DOM after first open */}
          <div
            className={`md:hidden fixed top-[53px] right-0 w-[280px] max-w-[85vw] h-[calc(100dvh-53px)] bg-[#fafaf9] border-l-3 border-[#2a2a2a] z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-hidden={!mobileMenuOpen}
          >
        <div className="flex flex-col gap-3 p-5">
          {currentAnim && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleGetCode(currentAnim.route);
              }}
              className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 text-center w-full"
              aria-label={`Get source code for ${currentAnim.name}`}
            >
              Get Code
            </button>
          )}

          {codeAnim && (
            <Link
              href={codeAnim.route}
              className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 text-center"
              aria-label={`View live sandbox demo for ${codeAnim.name}`}
            >
              View Demo
            </Link>
          )}

          <a
            href="https://github.com/TweenLabs/TweenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 text-center"
            aria-label="Star TweenLabs repository on GitHub"
          >
            Star us on GitHub ↗
          </a>

          <div className="border-t-2 border-[#2a2a2a]/15 my-2" />

          {!mounted || isPending ? (
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider text-center py-2">
              Loading...
            </span>
          ) : session ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-1">
                {session.user.image && !avatarError ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={32}
                    height={32}
                    onError={() => setAvatarError(true)}
                    className="w-8 h-8 rounded-full border-2 border-[#2a2a2a] object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-[#2a2a2a] bg-wtf-purple text-white flex items-center justify-center font-mono font-bold text-xs">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="font-mono font-bold text-xs text-[#2a2a2a] truncate">
                  {session.user.name || "User"}
                </span>
              </div>
              <button
                onClick={async () => {
                  await authClient.signOut();
                  window.location.reload();
                }}
                className="brutalist-btn bg-wtf-red hover:bg-[#a82a29] text-white font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 w-full text-center"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal();
              }}
              className="brutalist-btn bg-wtf-green hover:bg-[#09734f] text-white font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 w-full text-center"
            >
              Sign In
            </button>
          )}
        </div>
          </div>
        </>
      )}
    </header>
  );
}
