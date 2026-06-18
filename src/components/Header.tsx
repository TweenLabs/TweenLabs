"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animations } from "@/data/animations";

export default function Header() {
  const pathname = usePathname();

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
        </div>
      </div>
    </header>
  );
}


