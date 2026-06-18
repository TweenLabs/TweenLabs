"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function MorphElementPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    // 1. Text reveals on page load
    gsap.fromTo(
      ".intro-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
    );

    // 2. Feature card staggers on load
    gsap.fromTo(
      ".feature-card-item",
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.3,
      }
    );

    // 3. Spotlight cursor mask follower
    const updateSpotlight = (e: MouseEvent) => {
      const rect = spotlightRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCoords({ x: Math.round(x), y: Math.round(y) });
      setIsHovered(true);

      // Animate the masking spotlight circle (revealing the background mesh image)
      gsap.to(".spotlight-bg", {
        clipPath: `circle(160px at ${x}px ${y}px)`,
        duration: 0.35,
        ease: "power1.out",
        overwrite: "auto",
      });

      // Animate the vector targeting reticle
      gsap.to(".vector-reticle", {
        x: x,
        y: y,
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // Reset/fade out spotlight to center
      gsap.to(".spotlight-bg", {
        clipPath: `circle(0px at 50% 50%)`,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(".vector-reticle", {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const containerEl = spotlightRef.current;
    if (containerEl) {
      containerEl.addEventListener("mousemove", updateSpotlight);
      containerEl.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (containerEl) {
        containerEl.removeEventListener("mousemove", updateSpotlight);
        containerEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Mouse tilt on features cards (subtle and controlled)
  const handleCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
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
      transformPerspective: 1000,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });
  });

  const handleCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
      overwrite: "auto",
    });
  });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center py-20 px-6 selection:bg-wtf-yellow selection:text-black overflow-x-hidden font-sans"
    >
      {/* Background grids */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />

      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Page Heading readout (absolute right) */}
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-1 select-none text-right">
        <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-300 bg-white px-2 py-0.5 rounded">
          Component 19
        </span>
        <h1 className="font-serif font-black text-lg uppercase text-[#2a2a2a]">
          Spotlight Reveal
        </h1>
      </div>

      {/* Spotlight Canvas content directly */}
      <div className="w-full max-w-4xl flex flex-col gap-8 z-10 mt-6 select-none">
        
        {/* Simple Header */}
        <div className="flex flex-col gap-1 items-start text-left">
          <span className="font-mono text-[9px] font-bold text-zinc-400 tracking-widest uppercase">[ DYNAMIC LENS REV ]</span>
          <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-[#2a2a2a] leading-none">
            Presentation Spotlight
          </h2>
        </div>

        {/* Main console screen */}
        <div className="w-full flex items-center justify-between border-b-2 border-[#2a2a2a] pb-3 font-mono text-[9px] md:text-[10px] font-bold text-zinc-505">
          <span>[ CONSOLE: READY ]</span>
          <span>COORDS: X={isHovered ? coords.x : "000"}PX, Y={isHovered ? coords.y : "000"}PX</span>
          <span>MASK: circle(160px)</span>
        </div>

        {/* Spotlight Area */}
        <div
          ref={spotlightRef}
          className="relative brutalist-card w-full h-[360px] md:h-[400px] rounded-2xl bg-[#141416] overflow-hidden flex flex-col items-center justify-center text-center p-6 select-none group border-3 border-[#2a2a2a]"
        >
          {/* Vector Targeting Reticle (follows mouse) */}
          <div
            className="vector-reticle absolute pointer-events-none opacity-0 scale-50 z-20"
            style={{
              width: "320px",
              height: "320px",
              marginLeft: "-160px",
              marginTop: "-160px",
              left: 0,
              top: 0,
            }}
          >
            <svg className="w-full h-full text-wtf-orange opacity-45 animate-[spin_12s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="42" strokeWidth="0.6" />
              <line x1="50" y1="2" x2="50" y2="98" strokeWidth="0.5" />
              <line x1="2" y1="50" x2="98" y2="50" strokeWidth="0.5" />
            </svg>
          </div>

          {/* The hidden color background revealed ONLY by mouse cursor spotlight circle */}
          <div
            className="spotlight-bg absolute inset-0 pointer-events-none opacity-90 transition-opacity"
            style={{ clipPath: "circle(0px at 50% 50%)" }}
          >
            <Image
              src="/Untitled design (5).png"
              alt=""
              fill
              priority
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-wtf-purple/20 mix-blend-multiply" />
          </div>

          {/* Static Content */}
          <h3 className="relative z-10 text-2xl md:text-4xl font-serif font-black uppercase tracking-tight text-white leading-none group-hover:text-wtf-yellow transition-colors duration-300 max-w-2xl px-4">
            Information flows best through intentional design.
          </h3>
          <p className="relative z-10 text-[9px] font-mono text-zinc-500 mt-6 uppercase tracking-widest bg-[#2a2a2a]/45 border border-zinc-700 px-4 py-1.5 rounded-full">
            [ Hover to project targeting laser ]
          </p>
        </div>

        {/* Sibling Features Cards */}
        <div className="features grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pointer-events-auto">
          {[
            { title: "Flow", desc: "Pipeline mapping.", hex: "229, 91, 60" },
            { title: "Signal", desc: "Clamping deltas.", hex: "12, 147, 103" },
            { title: "System Design", desc: "Neo-Brutalism.", hex: "241, 179, 51" },
            { title: "Archive", desc: "Stagger storage.", hex: "103, 88, 165" },
          ].map((feature, i) => (
            <div
              key={i}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="group feature-card-item brutalist-card p-5 bg-white flex flex-col justify-between h-40 hover:bg-zinc-50 transition-shadow duration-200 cursor-pointer select-none relative overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                style={{
                  background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${feature.hex}, 0.08), transparent 85%)`,
                }}
              />

              <div className="flex justify-between items-start relative z-10" style={{ transform: "translateZ(20px)" }}>
                <span className="font-mono text-[9px] font-bold text-zinc-400">NODE 0{i + 1}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-wtf-green border border-black shadow-[1.5px_1.5px_0px_black]" />
              </div>
              
              <h4 className="text-lg font-serif font-black uppercase text-[#2a2a2a] relative z-10 leading-tight" style={{ transform: "translateZ(25px)" }}>{feature.title}</h4>
              <p className="text-[10px] font-mono text-zinc-500 uppercase relative z-10" style={{ transform: "translateZ(20px)" }}>{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
