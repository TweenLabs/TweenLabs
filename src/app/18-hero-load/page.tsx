"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ImageItem {
  id: number;
  url: string;
  accentHex: string;
}

const imagesData: ImageItem[] = [
  { id: 1, url: "/Untitled design.png", accentHex: "229, 91, 60" },
  { id: 2, url: "/Untitled design (1).png", accentHex: "12, 147, 103" },
  { id: 3, url: "/Untitled design (2).png", accentHex: "241, 179, 51" }, // Center
  { id: 4, url: "/Untitled design (3).png", accentHex: "59, 130, 246" },
  { id: 5, url: "/Untitled design (4).png", accentHex: "103, 88, 165" },
];

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
        const progressBar = document.getElementById("loader-progress-bar");
        if (progressBar) {
          progressBar.style.width = `${counter.value}%`;
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
        stagger: 0.08,
        duration: 0.85,
        ease: "power3.out",
        delay: 3.6, // Wait for counter
      })
      .to(".hero-load-images", {
        gap: "1.2vw",
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
        scale: 1.35,
        duration: 0.85,
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
          duration: 0.65,
          stagger: 0.06,
          ease: "power3.out",
        },
        "-=0.4"
      );

  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Mouse tilt on grid items when loaded (subtle and controlled)
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 6;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 800,
      ease: "power1.out",
      duration: 0.35,
      overwrite: "auto",
    });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
      overwrite: "auto",
    });
  });

  const heroTitle = "HEY THIS SIDE IS ROXY";

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col justify-between selection:bg-wtf-yellow selection:text-black overflow-hidden font-sans"
    >
      {/* Background grids */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />

      {/* Floating dashboard back link */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Preloader Loading Overlay */}
      <div className="preloader-black-overlay fixed inset-0 bg-[#141416] z-40 flex flex-col justify-between p-8 md:p-16 select-none" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
        {/* Top bar info */}
        <div className="flex justify-between items-center w-full text-zinc-550 font-mono text-[9px] md:text-[10px] tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-wtf-orange animate-ping" />
            <span>PORTFOLIO PRELOADER // INTRO MODE</span>
          </div>
          <span>MATRIX CODES V1.0</span>
        </div>

        {/* Center layout with vertical scanner text */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Laser scanning bar */}
          <div className="absolute top-[42%] left-[10vw] right-[10vw] h-[1px] bg-wtf-orange opacity-40 animate-pulse pointer-events-none" />
          
          <div className="absolute top-[38%] text-center overflow-hidden h-8">
            <div className="preloader-overlay-text transform translate-y-8 flex flex-col font-mono text-zinc-400 text-xs font-bold uppercase tracking-widest">
              <span>INITIALIZING SYSTEM...</span>
              <span>CALCULATING VECTOR FIELDS...</span>
              <span>ESTABLISHING RENDERING CONTEXT...</span>
              <span>WELCOME PORTAL STACK...</span>
            </div>
          </div>
        </div>

        {/* Bottom bar status and progress */}
        <div className="flex justify-between items-end w-full relative z-10">
          <div className="text-zinc-500 font-mono text-[8px] md:text-[9px] max-w-xs leading-relaxed uppercase flex flex-col gap-1">
            <span>[ SYSTEM: ACTIVE ]</span>
            <span>[ MEMORY REGISTERS: CACHED ]</span>
            <span>Page opens automatically on complete.</span>
          </div>
          <div className="flex items-baseline text-white font-serif font-black tracking-tight leading-none">
            <h1 ref={counterRef} className="text-7xl md:text-9xl">0</h1>
            <span className="text-xl md:text-2xl text-wtf-orange font-bold ml-2">%</span>
          </div>
        </div>

        {/* Load Progress bar */}
        <div className="absolute bottom-0 left-0 h-2 bg-wtf-orange transition-all duration-100 ease-out" id="loader-progress-bar" style={{ width: "0%" }} />
      </div>

      {/* Main Page Header */}

      {/* Hero Landing Stage */}
      <main className="z-10 flex-1 flex flex-col items-center justify-center relative w-full h-[80vh] px-8">
        {/* Images Grid */}
        <div className="hero-load-images w-full max-w-4xl flex items-center justify-center gap-16 select-none">
          {imagesData.map((img) => {
            const isCenter = img.id === 3;
            return (
              <div
                key={img.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`hero-load-img group relative overflow-hidden bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,0.12)] cursor-pointer ${
                  isCenter
                    ? "hero-center-img w-[24%] aspect-[3/4] border-3 border-[#2a2a2a] rounded-xl shadow-[5px_5px_0px_#2a2a2a]"
                    : "w-[12%] aspect-[3/4]"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{
                    background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${img.accentHex}, 0.08), transparent 85%)`,
                  }}
                />
                <Image src={img.url} alt="" fill className="object-cover" />
              </div>
            );
          })}
        </div>

        {/* Text Title Reveal */}
        <div className="absolute bottom-8 left-12 text-left pointer-events-none select-none">
          <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight flex flex-wrap gap-x-3 text-[#2a2a2a]">
            {heroTitle.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block overflow-hidden pb-1">
                <span className="split-word-inner inline-block transform will-change-transform text-wtf-orange font-serif font-black uppercase" style={{ textShadow: "1.5px 1.5px 0px #2a2a2a" }}>
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
