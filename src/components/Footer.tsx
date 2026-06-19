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
    <footer className="w-full border-t-3 border-[#2a2a2a] bg-[#f8f5ee] py-16 px-4 md:px-8 mt-auto relative z-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
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
              ScrollTrigger timelines, and Next.js templates engineered for high-performance, 
              interactive web experiences.
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
              Get notified when we publish new physics-based interactive layout modules and hooks.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-1">
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
        <div className="border-t-2 border-[#2a2a2a]/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-zinc-500">
            © {new Date().getFullYear()} TweenLabs. All rights reserved. Open source library licensed under MIT.
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="brutalist-btn bg-white hover:bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-2 px-4 rounded-md cursor-pointer transition-all"
          >
            Back To Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
