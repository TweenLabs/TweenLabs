"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { animations } from "@/data/animations";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/provider/AuthModalProvider";

export default function Header() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { openModal } = useAuthModal();
  const [avatarError, setAvatarError] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | undefined>(undefined);

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
  const codeAnim = codeSlug ? animations.find((anim) => anim.route.slice(1) === codeSlug) : null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fafaf9] border-b-3 border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 cursor-pointer group"
          aria-label="TweenLabs Home"
        >
          <Image
            src="/logo.svg"
            alt="TweenLabs Logo"
            width={32}
            height={32}
            priority
            className="object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif font-black text-xl md:text-2xl tracking-tight text-[#2a2a2a] group-hover:text-wtf-orange transition-colors duration-150">
            TweenLabs
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {currentAnim && (
            <Link
              href={`/code/${currentAnim.route.slice(1)}`}
              className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
              aria-label={`Get source code for ${currentAnim.name}`}
            >
              Get Code
            </Link>
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

          <Link
            href="/about"
            className={`brutalist-btn font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 ${
              pathname === "/about"
                ? "bg-wtf-orange text-white"
                : "bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a]"
            }`}
            aria-label="Read about TweenLabs and our engineering practices"
          >
            About
          </Link>

          <a
            href="https://github.com/GSAP-PLAYGROUND/TweenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
            aria-label="View TweenLabs source code repository on GitHub"
          >
            GitHub ↗
          </a>

          {isPending ? (
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Loading...
            </span>
          ) : session ? (
            <div className="flex items-center gap-2.5">
              {session.user.image && !avatarError ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
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
      </div>
    </header>
  );
}


