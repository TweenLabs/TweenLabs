"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollOrbitGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial State: Offset the cards relative to their final horizontal layout position
      // They float at the 4 corners of the screen (partially off-screen and rotated)
      gsap.set(".orbit-card-0", {
        x: "-15vw",
        y: "-35vh",
        rotation: -18,
        scale: 0.75,
      });
      gsap.set(".orbit-card-1", {
        x: "52vw",
        y: "-38vh",
        rotation: 12,
        scale: 0.75,
      });
      gsap.set(".orbit-card-2", {
        x: "-42vw",
        y: "38vh",
        rotation: -12,
        scale: 0.75,
      });
      gsap.set(".orbit-card-3", {
        x: "15vw",
        y: "35vh",
        rotation: 18,
        scale: 0.75,
      });

      // Hide playhead and timeline tracks initially
      gsap.set(".playhead-line", { scaleY: 0, opacity: 0 });
      gsap.set(".timeline-track", { scaleX: 0, opacity: 0 });

      // Hide card images initially
      gsap.set(".card-image", { opacity: 0, scale: 0.9 });

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      // 2. Master timeline linked to vertical scroll pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          scroller: scroller,
          pin: true,
          scrub: 0.6,
          start: "top top",
          end: "+=3000", // Pinned scroll height
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Convergence (0.0s to 1.2s)
      // Cards slide from offset corners into a unified flat horizontal timeline row
      tl.to(
        ".orbit-card-0, .orbit-card-1, .orbit-card-2, .orbit-card-3",
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0,
      );

      // Fade in timeline track guides (0.8s to 1.2s)
      tl.to(
        ".timeline-track",
        {
          scaleX: 1,
          opacity: 0.15,
          duration: 0.4,
          ease: "power2.out",
        },
        0.8,
      );

      // Phase 2: Playhead Activation & Sweep (1.2s to 3.5s)
      // Laser playhead line extends and sweeps across the cards
      tl.to(
        ".playhead-line",
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.5)",
        },
        1.2,
      ).to(
        ".playhead-line",
        {
          left: "95vw",
          duration: 2.0,
          ease: "none", // Linear sweep mapping
        },
        1.5,
      );

      // Dynamic Card Magnification & Image Reveal during Playhead Sweep

      // Card 0 (crosses around 1.73s, active range: 1.55s to 2.05s)
      tl.to(".orbit-card-0", { scale: 1.08, duration: 0.25 }, 1.55)
        .to(
          ".orbit-card-0 .card-inner-box",
          {
            borderColor: "#f1b333",
            boxShadow: "0 12px 36px rgba(241, 179, 51, 0.35)",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-0 .card-image",
          { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 },
          "<",
        )
        .to(".orbit-card-0", { scale: 1, duration: 0.25 }, 1.8)
        .to(
          ".orbit-card-0 .card-inner-box",
          {
            borderColor: "#2a2a2a",
            boxShadow: "6px 6px 0px #2a2a2a",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-0 .card-image",
          { scale: 1, rotation: 0, duration: 0.25 },
          "<",
        );

      // Card 1 (crosses around 2.24s, active range: 2.05s to 2.55s)
      tl.to(".orbit-card-1", { scale: 1.08, duration: 0.25 }, 2.05)
        .to(
          ".orbit-card-1 .card-inner-box",
          {
            borderColor: "#0c9367",
            boxShadow: "0 12px 36px rgba(12, 147, 103, 0.35)",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-1 .card-image",
          { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 },
          "<",
        )
        .to(".orbit-card-1", { scale: 1, duration: 0.25 }, 2.3)
        .to(
          ".orbit-card-1 .card-inner-box",
          {
            borderColor: "#2a2a2a",
            boxShadow: "6px 6px 0px #2a2a2a",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-1 .card-image",
          { scale: 1, rotation: 0, duration: 0.25 },
          "<",
        );

      // Card 2 (crosses around 2.75s, active range: 2.55s to 3.05s)
      tl.to(".orbit-card-2", { scale: 1.08, duration: 0.25 }, 2.55)
        .to(
          ".orbit-card-2 .card-inner-box",
          {
            borderColor: "#8b5cf6",
            boxShadow: "0 12px 36px rgba(139, 92, 246, 0.35)",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-2 .card-image",
          { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 },
          "<",
        )
        .to(".orbit-card-2", { scale: 1, duration: 0.25 }, 2.8)
        .to(
          ".orbit-card-2 .card-inner-box",
          {
            borderColor: "#2a2a2a",
            boxShadow: "6px 6px 0px #2a2a2a",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-2 .card-image",
          { scale: 1, rotation: 0, duration: 0.25 },
          "<",
        );

      // Card 3 (crosses around 3.26s, active range: 3.05s to 3.55s)
      tl.to(".orbit-card-3", { scale: 1.08, duration: 0.25 }, 3.05)
        .to(
          ".orbit-card-3 .card-inner-box",
          {
            borderColor: "#c53b3a",
            boxShadow: "0 12px 36px rgba(197, 59, 58, 0.35)",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-3 .card-image",
          { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 },
          "<",
        )
        .to(".orbit-card-3", { scale: 1, duration: 0.25 }, 3.3)
        .to(
          ".orbit-card-3 .card-inner-box",
          {
            borderColor: "#2a2a2a",
            boxShadow: "6px 6px 0px #2a2a2a",
            duration: 0.25,
          },
          "<",
        )
        .to(
          ".orbit-card-3 .card-image",
          { scale: 1, rotation: 0, duration: 0.25 },
          "<",
        );

      // Phase 3: Exit Staggered Slide-out (3.5s to 4.5s)
      tl.to(
        ".playhead-line",
        {
          scaleY: 0,
          opacity: 0,
          duration: 0.2,
        },
        3.5,
      ).to(
        ".timeline-cards-row",
        {
          xPercent: -150,
          duration: 1.0,
          ease: "power2.in",
        },
        3.6,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      className="relative min-h-screen bg-[#f2ece0] text-[#2a2a2a] overflow-x-hidden selection:bg-[#f1b333] selection:text-black"
      ref={containerRef}
    >
      {/* Dot Grid Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Scroll Indicator HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-xs uppercase tracking-widest text-[#2a2a2a]/60 animate-bounce pointer-events-none flex flex-col items-center gap-1">
        <span>Scroll Down to Assemble</span>
        <span className="text-[#e55b3c] font-bold text-sm">↓</span>
      </div>

      {/* Main Pinned Work Area */}
      <div
        ref={scrollSectionRef}
        className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      >
        {/* Timeline Track Line (Full Screen width) */}
        <div className="timeline-track absolute left-[5vw] right-[5vw] h-[2px] bg-[#2a2a2a]/15 opacity-0 origin-left z-10" />

        {/* Laser Playhead Line (Full Screen height) */}
        <div
          ref={playheadRef}
          className="playhead-line absolute top-[5vh] bottom-[5vh] left-[5vw] w-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-30 origin-top transform -translate-x-1/2"
        >
          {/* Playhead Nodes */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
        </div>

        {/* Absolute Cards container */}
        <div className="timeline-cards-row absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-full h-[280px] md:h-[360px] lg:h-[420px]">
            {/* CARD 0: Golden Ratio Spiral (Gold) */}
            <div className="orbit-card-0 absolute top-0 left-[4vw] md:left-[6vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <div className="flex justify-between items-center w-full font-mono text-[9px] text-zinc-400">
                  <span>MODULE_A // 01</span>
                  <span>[GOLDEN]</span>
                </div>

                <div className="flex-grow w-full flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  {/* Tech Crosshair Placeholder in background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <svg
                      className="w-8 h-8 text-[#2a2a2a]"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="50" y1="20" x2="50" y2="80" />
                      <line x1="20" y1="50" x2="80" y2="50" />
                      <circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  {/* Status indicator before reveal */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 p-4 text-center select-none">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2a2a2a]/45 font-bold animate-pulse">
                      [ LOCKED ]
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2a2a2a]/30 mt-1">
                      Sweep to Scan
                    </span>
                  </div>
                  <div className="card-image absolute inset-0 w-full h-full z-10 pointer-events-none will-change-transform">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                      alt="Golden Spiral Preview"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif font-black text-sm md:text-base text-[#2a2a2a] uppercase tracking-wider">
                    Golden Spiral
                  </h3>
                  <span className="font-mono text-[8px] text-zinc-400 uppercase">
                    Ratio Math
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 1: Waveform Matrix (Green) */}
            <div className="orbit-card-1 absolute top-0 left-[28vw] md:left-[29vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <div className="flex justify-between items-center w-full font-mono text-[9px] text-zinc-400">
                  <span>MODULE_B // 02</span>
                  <span>[WAVE]</span>
                </div>

                <div className="flex-grow w-full flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  {/* Tech Crosshair Placeholder in background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <svg
                      className="w-8 h-8 text-[#2a2a2a]"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="50" y1="20" x2="50" y2="80" />
                      <line x1="20" y1="50" x2="80" y2="50" />
                      <circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  {/* Status indicator before reveal */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 p-4 text-center select-none">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2a2a2a]/45 font-bold animate-pulse">
                      [ LOCKED ]
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2a2a2a]/30 mt-1">
                      Sweep to Scan
                    </span>
                  </div>
                  <div className="card-image absolute inset-0 w-full h-full z-10 pointer-events-none will-change-transform">
                    <img
                      src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80"
                      alt="Waves Preview"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif font-black text-sm md:text-base text-[#2a2a2a] uppercase tracking-wider">
                    Waves Osc
                  </h3>
                  <span className="font-mono text-[8px] text-zinc-400 uppercase">
                    Frequency
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Quantum Rings (Purple) */}
            <div className="orbit-card-2 absolute top-0 left-[52vw] md:left-[52vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <div className="flex justify-between items-center w-full font-mono text-[9px] text-zinc-400">
                  <span>MODULE_C // 03</span>
                  <span>[RING]</span>
                </div>

                <div className="flex-grow w-full flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  {/* Tech Crosshair Placeholder in background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <svg
                      className="w-8 h-8 text-[#2a2a2a]"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="50" y1="20" x2="50" y2="80" />
                      <line x1="20" y1="50" x2="80" y2="50" />
                      <circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  {/* Status indicator before reveal */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 p-4 text-center select-none">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2a2a2a]/45 font-bold animate-pulse">
                      [ LOCKED ]
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2a2a2a]/30 mt-1">
                      Sweep to Scan
                    </span>
                  </div>
                  <div className="card-image absolute inset-0 w-full h-full z-10 pointer-events-none will-change-transform">
                    <img
                      src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=600&q=80"
                      alt="Quantum Ring Preview"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif font-black text-sm md:text-base text-[#2a2a2a] uppercase tracking-wider">
                    Quantum Ring
                  </h3>
                  <span className="font-mono text-[8px] text-zinc-400 uppercase">
                    Resonance
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: Isometric Grid (Red) */}
            <div className="orbit-card-3 absolute top-0 left-[76vw] md:left-[75vw] w-[20vw] md:w-[19vw] h-full transform will-change-transform pointer-events-auto">
              <div className="card-inner-box w-full h-full border-3 border-[#2a2a2a] bg-white rounded-3xl flex flex-col justify-between p-5 md:p-6 shadow-[6px_6px_0px_#2a2a2a] transition-shadow duration-200">
                <div className="flex justify-between items-center w-full font-mono text-[9px] text-zinc-400">
                  <span>MODULE_D // 04</span>
                  <span>[MATRIX]</span>
                </div>

                <div className="flex-grow w-full flex items-center justify-center bg-[#fbfaf7] border border-zinc-200 my-3 rounded-2xl overflow-hidden relative">
                  {/* Tech Crosshair Placeholder in background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <svg
                      className="w-8 h-8 text-[#2a2a2a]"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="50" y1="20" x2="50" y2="80" />
                      <line x1="20" y1="50" x2="80" y2="50" />
                      <circle cx="50" cy="50" r="10" />
                    </svg>
                  </div>
                  {/* Status indicator before reveal */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 p-4 text-center select-none">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2a2a2a]/45 font-bold animate-pulse">
                      [ LOCKED ]
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2a2a2a]/30 mt-1">
                      Sweep to Scan
                    </span>
                  </div>
                  <div className="card-image absolute inset-0 w-full h-full z-10 pointer-events-none will-change-transform">
                    <img
                      src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
                      alt="Iso Matrix Preview"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif font-black text-sm md:text-base text-[#2a2a2a] uppercase tracking-wider">
                    Iso Matrix
                  </h3>
                  <span className="font-mono text-[8px] text-zinc-400 uppercase">
                    Dimension
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
