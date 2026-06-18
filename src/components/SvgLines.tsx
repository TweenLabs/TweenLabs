"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLORS = ["#87BAB2", "#D56D88", "#F17752", "#F1A650"];

export const SvgLine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const pathData = `
    M -350 220
    H 300
    
    Q 380 220 380 300
    V 360
    Q 380 440 460 440
    
    H 760
    
    Q 860 440 860 540
    V 620
    Q 860 720 960 720
    
    H 1800
  `;

  useGSAP(() => {
    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length + (COLORS.length - i - 1) * 80,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 95%",
          scrub: 1.5,
        },
      });
    });
  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 600,
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
      duration: 0.8,
      overwrite: "auto",
    });
  });

  return (
    <section
      ref={containerRef}
      className="relative h-[140vh] overflow-hidden bg-[#f0eadf] border-b-3 border-[#2a2a2a] flex items-center"
    >
      <svg
        viewBox="0 0 1600 1100"
        className="absolute left-0 top-25 h-full w-full opacity-90 z-0"
        fill="none"
      >
        {COLORS.map((color, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={pathData}
            stroke={color}
            strokeWidth="20"
            strokeLinecap="butt"
            strokeLinejoin="round"
            style={{
              transform: `translate(${i * 18}px, ${i * 18}px)`,
            }}
          />
        ))}
      </svg>

      {/* Structured Technical spec block on left */}
      <div className="absolute left-[8%] top-[25%] z-10 w-full max-w-sm flex flex-col gap-4 select-none pointer-events-none">
        <span className="font-mono text-xs font-bold text-zinc-550 uppercase tracking-widest">[ SPECIFICATIONS 01 ]</span>
        <h2 className="text-3xl font-serif font-black uppercase text-[#2a2a2a] leading-none">
          Scroll Pipelines
        </h2>
        <p className="font-sans text-xs md:text-sm text-zinc-650 leading-relaxed font-semibold">
          Executing multi-threaded translation matrices using high-fidelity viewport triggers at 60Hz.
        </p>
        <div className="border border-zinc-300 bg-white/80 p-3 rounded-xl flex items-center justify-between font-mono max-w-[200px] shadow-[2.5px_2.5px_0px_#2a2a2a] mt-2">
          <div className="flex flex-col">
            <span className="text-[7px] text-zinc-400 font-bold">SCRUB LATENCY</span>
            <span className="text-[9px] font-black text-[#2a2a2a]">0.12s // SAFE</span>
          </div>
          <span className="h-2 w-2 rounded-full bg-wtf-orange animate-pulse" />
        </div>
      </div>

      {/* Main interactive title card on right */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute right-[8%] bottom-[25%] z-10 brutalist-card p-6 bg-[#2a2a2a] text-white rotate-2 hover:shadow-[10px_10px_0px_#f1b333] transition-shadow duration-200 border-3 border-[#2a2a2a] cursor-pointer group"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded z-0"
          style={{
            background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(241, 179, 51, 0.15), transparent 85%)`,
          }}
        />
        <h1
          className="md:text-5xl lg:text-6xl font-serif font-black leading-none uppercase tracking-tight relative z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          Let's Chat
        </h1>
        <span className="font-mono text-[8px] text-zinc-400 font-bold block mt-2 relative z-10" style={{ transform: "translateZ(10px)" }}>
          COORD // [ ROTATE: +2DEG ]
        </span>
      </div>
    </section>
  );
};

const COLORS_TWO = ["#F4A261", "#E76F51", "#2A9D8F", "#E9C46A"];

export const SvgLineTwo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const pathData = `
    M -200 550
    C 400 950, 400 150, 800 550
    S 1200 150, 1800 550
  `;

  useGSAP(() => {
    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length + (COLORS_TWO.length - i - 1) * 80,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 95%",
          scrub: 1.5,
        },
      });
    });
  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 600,
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
      duration: 0.8,
      overwrite: "auto",
    });
  });

  return (
    <section
      ref={containerRef}
      className="relative h-[140vh] overflow-hidden bg-[#161618] border-b-3 border-[#2a2a2a] flex items-center"
    >
      <svg
        viewBox="0 0 1600 1100"
        className="absolute left-0 top-25 h-full w-full opacity-90 z-0"
        fill="none"
      >
        {COLORS_TWO.map((color, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={pathData}
            stroke={color}
            strokeWidth="20"
            strokeLinecap="butt"
            strokeLinejoin="round"
            style={{
              transform: `translate(${i * 18}px, ${i * 18}px)`,
            }}
          />
        ))}
      </svg>

      {/* Structured Technical spec block on right */}
      <div className="absolute right-[8%] top-[25%] z-10 w-full max-w-sm flex flex-col gap-4 select-none pointer-events-none text-right items-end">
        <span className="font-mono text-xs font-bold text-zinc-550 uppercase tracking-widest">[ SPECIFICATIONS 02 ]</span>
        <h2 className="text-3xl font-serif font-black uppercase text-white leading-none">
          Vector Mathematics
        </h2>
        <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed font-semibold">
          Evaluating dynamic cubic-bezier tangent paths to trace magnetic fields.
        </p>
        <div className="border border-zinc-800 bg-[#1e1e20] p-3 rounded-xl flex items-center justify-between font-mono max-w-[200px] shadow-[2.5px_2.5px_0px_#2a2a2a] mt-2 text-left">
          <div className="flex flex-col">
            <span className="text-[7px] text-zinc-500 font-bold">CURVATURE MAPPING</span>
            <span className="text-[9px] font-black text-white">CUBIC_BEZIER // PASS</span>
          </div>
          <span className="h-2 w-2 rounded-full bg-wtf-green animate-pulse ml-4" />
        </div>
      </div>

      {/* Main interactive title card on left */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute left-[8%] bottom-[25%] z-10 brutalist-card p-6 bg-white text-[#2a2a2a] -rotate-2 hover:shadow-[10px_10px_0px_#6758a5] transition-shadow duration-200 border-3 border-[#2a2a2a] cursor-pointer group"
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded z-0"
          style={{
            background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(103, 88, 165, 0.12), transparent 85%)`,
          }}
        />
        <h1
          className="md:text-5xl lg:text-6xl font-serif font-black leading-none uppercase tracking-tight relative z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          Our Work
        </h1>
        <span className="font-mono text-[8px] text-zinc-400 font-bold block mt-2 relative z-10" style={{ transform: "translateZ(10px)" }}>
          COORD // [ ROTATE: -2DEG ]
        </span>
      </div>
    </section>
  );
};
