"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="w-full border-t-3 border-[#2a2a2a] bg-[#f8f5ee] py-10 md:py-16 px-4 md:px-8 mt-auto relative z-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand & Status (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <Image
                src="/logo.svg"
                alt="TweenLabs Logo"
                width={32}
                height={32}
                className="object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-serif font-black text-2xl tracking-tight text-[#2a2a2a] group-hover:text-wtf-orange transition-colors duration-150">
                TweenLabs
              </span>
            </Link>
            <p className="text-sm font-medium text-zinc-600 leading-relaxed max-w-sm">
              An open laboratory of copy-paste GreenSock (GSAP) UI components,
              ScrollTrigger timelines, and Next.js templates engineered for
              high-performance, interactive web experiences.
            </p>
            {/* Lab Status Badge */}
            <div className="inline-flex items-center gap-2 border-2 border-[#2a2a2a] bg-white px-3 py-1 rounded-full text-[9px] font-mono font-bold text-wtf-green uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a] w-fit mt-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wtf-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-wtf-green"></span>
              </span>
              <span>Build v0.1.6 // ALL GATES PASSING</span>
            </div>
          </div>

          {/* Column 2: Explore Navigation (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-orange">
              Explore
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="text-zinc-600 hover:text-wtf-orange transition-colors duration-150"
                >
                  Components Index
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-zinc-600 hover:text-wtf-orange transition-colors duration-150"
                >
                  About TweenLabs
                </Link>
              </li>
              <li>
                <Link
                  href="/llms"
                  className="text-zinc-600 hover:text-wtf-orange transition-colors duration-150"
                >
                  AI Specs (llms.txt)
                </Link>
              </li>
              <li>
                <Link
                  href="/llms-full"
                  className="text-zinc-600 hover:text-wtf-orange transition-colors duration-150"
                >
                  Full Directory Context
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Open Source / Legal (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-purple">
              Repository
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <a
                  href="https://github.com/TweenLabs/TweenLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-wtf-purple transition-colors duration-150"
                >
                  GitHub Project ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TweenLabs/TweenLabs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-wtf-purple transition-colors duration-150"
                >
                  Report a Bug ↗
                </a>
              </li>
              <li>
                <a
                  href="https://gsap.com/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-wtf-purple transition-colors duration-150"
                >
                  Official GSAP Docs ↗
                </a>
              </li>
              <li>
                <span className="text-zinc-400 cursor-default">
                  MIT License
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-blue">
              Lab Newsletter
            </h4>
            <p className="text-sm font-medium text-zinc-600 leading-relaxed">
              Get notified when we publish new physics-based interactive layout
              modules and hooks.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 mt-1"
            >
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:flex-grow border-3 border-[#2a2a2a] px-3.5 py-2 font-mono font-bold rounded-lg placeholder-zinc-450 focus:outline-none focus:bg-[#fafaf9] shadow-[3px_3px_0px_#2a2a2a] text-xs transition-colors duration-150"
              />
              <button
                type="submit"
                className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-black font-mono font-bold text-[10px] uppercase py-2 px-4 rounded-lg tracking-wider cursor-pointer transition-colors duration-150 h-10 w-full sm:w-auto flex items-center justify-center whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <span className="font-mono text-[10px] font-bold text-wtf-green uppercase animate-pulse">
                ✓ Added to laboratory logs!
              </span>
            )}
          </div>
        </div>

        {/* Sub-footer Section */}
        <div className="border-t-2 border-[#2a2a2a]/20 pt-6 md:pt-8 flex flex-col items-center gap-5 md:gap-0 md:flex-row md:justify-between">
          <span className="text-[10px] md:text-xs font-mono text-zinc-400 text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} TweenLabs. All rights reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            Open source · MIT License
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-wtf-orange transition-colors duration-150"
            >
              About
            </Link>
            <span className="text-zinc-300 text-xs">|</span>
            <a
              href="https://github.com/TweenLabs/TweenLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-wtf-orange transition-colors duration-150"
              aria-label="Star TweenLabs on GitHub"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
