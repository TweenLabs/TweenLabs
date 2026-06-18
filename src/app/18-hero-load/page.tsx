"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function HeroLoadPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLHeadingElement>(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  useGSAP(() => {
    const counter = { value: 0 };

    // Initial setups to prevent flashes
    gsap.set(".hero-load-img", { y: 150, opacity: 0, scale: 1.2 });
    gsap.set(".split-word-inner", { y: "100%" });

    const counterTl = gsap.timeline();
    const textTl = gsap.timeline();
    const revealTl = gsap.timeline({ delay: 0.5 });

    // 1. Preloader counter up to 100
    counterTl.to(counter, {
      value: 100,
      duration: 3.5,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(counter.value));
        }
      },
    });

    // 2. Preloader Text rolling upward
    textTl
      .to(".preloader-overlay-text", {
        y: "0",
        duration: 0.6,
        ease: "power3.inOut",
        delay: 0.5,
      })
      .to(".preloader-overlay-text", {
        y: "-2rem",
        duration: 0.6,
        ease: "power3.inOut",
        delay: 0.6,
      })
      .to(".preloader-overlay-text", {
        y: "-4rem",
        duration: 0.6,
        ease: "power3.inOut",
        delay: 0.6,
      })
      .to(".preloader-overlay-text", {
        y: "-6rem",
        duration: 0.6,
        ease: "power3.inOut",
        delay: 0.8,
      });

    // 3. Main layout reveal sequence after preloader completes
    revealTl
      .to(".hero-load-img", {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.8,
        ease: "power3.out",
        delay: 3.6, // Wait for counter
      })
      .to(".hero-load-images", {
        gap: "0.8vw",
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(
        ".hero-load-img",
        {
          scale: 1,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(".hero-load-img:not(.hero-center-img)", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.inOut",
      })
      .to(".hero-center-img", {
        scale: 1.5,
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(".preloader-black-overlay", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          setIsIntroComplete(true);
        }
      })
      .to(
        ".split-word-inner",
        {
          y: "0",
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.4"
      );

  }, { scope: containerRef });

  const heroTitle = "HEY THIS SIDE IS ROXY";

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col justify-between selection:bg-wtf-yellow selection:text-black overflow-hidden"
    >
      {/* Floating dashboard back link */}
      <div className="fixed top-4 left-4 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Preloader Loading Overlay */}
      <div className="preloader-black-overlay fixed inset-0 bg-black z-40 flex flex-col justify-between p-8 md:p-16 select-none" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
        <div className="flex justify-between items-center w-full text-zinc-550 font-mono text-[10px] tracking-widest font-bold">
          <span>PORTFOLIO PRELOADER</span>
          <span>ROXY SANDBOX</span>
        </div>

        {/* Counter */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Overlay Text Ticker */}
          <div className="absolute top-[40%] text-center overflow-hidden h-8">
            <div className="preloader-overlay-text transform translate-y-8 flex flex-col font-mono text-zinc-400 text-sm font-bold uppercase tracking-wider">
              <span>Structure</span>
              <span>Designed Identity</span>
              <span>Welcome</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end w-full">
          <div className="text-zinc-600 font-mono text-[9px] max-w-xs leading-relaxed uppercase">
            Recalculating structural vectors. Page opens automatically.
          </div>
          <div className="flex items-baseline text-white font-serif font-black tracking-tight leading-none">
            <h1 ref={counterRef} className="text-7xl md:text-9xl">0</h1>
            <span className="text-xl md:text-2xl text-wtf-orange font-bold ml-2">%</span>
          </div>
        </div>
      </div>

      {/* Main Page Header */}
      <nav className="z-10 w-full px-8 py-6 flex justify-between items-center border-b border-zinc-300 bg-white">
        <div className="font-serif font-black text-sm uppercase tracking-tight">
          Elara Vandenberg
        </div>
        <div className="flex gap-6 font-mono text-xs font-bold text-zinc-550 uppercase">
          <span className="cursor-pointer hover:text-black">Runway</span>
          <span className="cursor-pointer hover:text-black">Lookbook</span>
          <span className="cursor-pointer hover:text-black">Biography</span>
        </div>
      </nav>

      {/* Hero Layout */}
      <main className="z-10 flex-1 flex flex-col items-center justify-center relative w-full h-[80vh] px-8">
        {/* Images Grid */}
        <div className="hero-load-images w-full max-w-4xl flex items-center justify-center gap-16 select-none">
          <div className="hero-load-img relative w-[12%] aspect-[3/4] border-2 border-black rounded-lg overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
            <Image src="/Untitled design.png" alt="" fill className="object-cover" />
          </div>
          <div className="hero-load-img relative w-[12%] aspect-[3/4] border-2 border-black rounded-lg overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
            <Image src="/Untitled design (1).png" alt="" fill className="object-cover" />
          </div>
          <div className="hero-load-img hero-center-img relative w-[24%] aspect-[3/4] border-3 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,0.2)]">
            <Image src="/Untitled design (2).png" alt="" fill className="object-cover" />
          </div>
          <div className="hero-load-img relative w-[12%] aspect-[3/4] border-2 border-black rounded-lg overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
            <Image src="/Untitled design (3).png" alt="" fill className="object-cover" />
          </div>
          <div className="hero-load-img relative w-[12%] aspect-[3/4] border-2 border-black rounded-lg overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
            <Image src="/Untitled design (4).png" alt="" fill className="object-cover" />
          </div>
        </div>

        {/* Text Title Reveal */}
        <div className="absolute bottom-8 left-12 text-left pointer-events-none">
          <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight flex flex-wrap gap-x-3 text-[#2a2a2a]">
            {heroTitle.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block overflow-hidden pb-1">
                <span className="split-word-inner inline-block transform will-change-transform text-wtf-orange" style={{ textShadow: "1.5px 1.5px 0px #2a2a2a" }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </main>

      {/* Intro Complete Back button */}
      {isIntroComplete && (
        <div className="absolute bottom-6 right-8 z-30">
          <Link href="/">
            <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer">
              ← Dashboard
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
