"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(useGSAP, Flip);

interface BentoItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gridClass: string;
  color: string;
  textColor: string;
  details: string[];
}

export default function BentoGridFlipPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const flipStateRef = useRef<any>(null);

  const bentoItems: BentoItem[] = [
    {
      id: 1,
      title: "Core Mechanics",
      subtitle: "STATS MONITOR",
      description: "Optimized event pipelines running at 60fps. Handles complex coordinate transforms and collision grids dynamically.",
      gridClass: "col-span-1 md:col-span-2 row-span-1 h-52",
      color: "bg-wtf-orange",
      textColor: "text-white",
      details: [
        "60fps hardware accelerated loop",
        "Coordinate mapping matrix",
        "Vector-based collision grids",
        "Garbage cleanup on component unmount"
      ]
    },
    {
      id: 2,
      title: "Design System",
      subtitle: "UI TOKENS",
      description: "Neo-Brutalist utility layers, interactive variables, and asymmetric structural skews.",
      gridClass: "col-span-1 row-span-1 md:row-span-2 h-52 md:h-110",
      color: "bg-wtf-green",
      textColor: "text-white",
      details: [
        "Tailwind CSS v4 variables",
        "Fine-grain grain tactile overlay",
        "High-contrast border offsets",
        "Interactive dark modes"
      ]
    },
    {
      id: 3,
      title: "Velocity Engine",
      subtitle: "SCROLL DETECTOR",
      description: "Inertia metrics reading delta inputs to drive canvas rendering. Auto-clamps bounds to maximize frames.",
      gridClass: "col-span-1 row-span-1 h-52",
      color: "bg-wtf-yellow",
      textColor: "text-black",
      details: [
        "Inertial kinetic damping",
        "Touch screen gesture trackers",
        "Bound clamp multipliers",
        "Scroll-linked timeline scaling"
      ]
    },
    {
      id: 4,
      title: "Elastic Cursor",
      subtitle: "LAGGING RETICLE",
      description: "Dual-coordinate pointer smoothing with custom elasticity weights. Morphing boundaries snap to hover nodes.",
      gridClass: "col-span-1 row-span-1 h-52",
      color: "bg-wtf-purple",
      textColor: "text-white",
      details: [
        "gsap.quickTo mouse follower",
        "Magnetic pull offsets",
        "Button boundaries snapping",
        "Interactive text overlays"
      ]
    },
    {
      id: 5,
      title: "Morphing Accordions",
      subtitle: "STAGGER DETAIL",
      description: "Color transitions driven by background morph targets. Inner elements unfold using autoAlpha spring tweens.",
      gridClass: "col-span-1 md:col-span-2 row-span-1 h-52",
      color: "bg-wtf-blue",
      textColor: "text-white",
      details: [
        "Accordion height auto transitions",
        "Spring-staggered inner items",
        "Page color morph mapping",
        "Dynamic content overlays"
      ]
    },
  ];

  const activeCard = bentoItems.find((item) => item.id === activeCardId);

  // useGSAP handles animating the transition after state render updates
  useGSAP(() => {
    if (activeCardId !== null) {
      // 1. Flip Morph expansion
      if (flipStateRef.current) {
        Flip.from(flipStateRef.current, {
          duration: 0.65,
          ease: "power4.out",
          absolute: true,
          fade: true,
          nested: true,
          onComplete: () => {
            // 2. Cascade stagger reveal of inner items
            gsap.fromTo(
              ".overlay-content-item",
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.07,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              }
            );
          }
        });
      }
    } else {
      // Flip Morph collapse back to original item
      if (flipStateRef.current) {
        Flip.from(flipStateRef.current, {
          duration: 0.65,
          ease: "power4.out",
          absolute: true,
        });
      }
    }
    flipStateRef.current = null;
  }, { dependencies: [activeCardId], scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  // 3D Perspective Tilt on Hover
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeCardId !== null) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateY = (x / (rect.width / 2)) * 7;
    const rotateX = -(y / (rect.height / 2)) * 7;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 600,
      ease: "power1.out",
      duration: 0.25,
      overwrite: "auto",
    });

    // Rotate the blueprint crosshair accent on hover
    const crosshair = card.querySelector(".accents-crosshair");
    if (crosshair) {
      gsap.to(crosshair, {
        rotation: (x / rect.width) * 90,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  });

  // Reset 3D Tilt on Leave
  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1, 0.4)",
      duration: 0.65,
      overwrite: "auto",
    });

    const crosshair = card.querySelector(".accents-crosshair");
    if (crosshair) {
      gsap.to(crosshair, {
        rotation: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    }
  });

  const handleCardClick = contextSafe((id: number) => {
    // 1. Reset card rotation before capture to prevent skewed starting dimensions
    const card = containerRef.current?.querySelector(`[data-flip-id="bento-${id}"]`);
    if (card) {
      gsap.set(card, { rotateX: 0, rotateY: 0 });
    }

    // 2. Capture state
    flipStateRef.current = Flip.getState(`[data-flip-id="bento-${id}"]`, {
      props: "box-shadow,border-radius,background-color",
      simple: true,
    });

    setActiveCardId(id);
  });

  const handleClose = contextSafe(() => {
    if (activeCardId === null) return;

    flipStateRef.current = Flip.getState(`[data-flip-id="bento-${activeCardId}"]`, {
      props: "box-shadow,border-radius,background-color",
      simple: true,
    });

    setActiveCardId(null);
  });

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-between p-8 selection:bg-wtf-yellow selection:text-black overflow-x-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Header Info */}
      <header className="z-10 w-full max-w-2xl text-center flex flex-col gap-4 mt-8">
        <div className="inline-flex self-center items-center gap-2 bg-wtf-green border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Component 13</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
          Bento Grid Expansion
        </h1>
        <p className="max-w-md mx-auto text-zinc-700 text-sm leading-relaxed font-sans font-medium">
          Hover over cards to activate the 3D perspective tilts. Click any card to morph it into a detail screen overlay using GSAP's Flip plugin.
        </p>
      </header>

      {/* Bento Grid Area */}
      <main className="z-10 w-full max-w-4xl my-12 relative min-h-[400px]">
        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          {bentoItems.map((item) => {
            const isTargeted = activeCardId === item.id;
            return (
              <div
                key={item.id}
                data-flip-id={`bento-${item.id}`}
                onClick={() => handleCardClick(item.id)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`brutalist-card p-6 bg-white flex flex-col justify-between cursor-pointer overflow-hidden relative group select-none ${
                  item.gridClass
                } ${isTargeted ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              >
                {/* Tech Blueprint Accent Crosshairs */}
                <div className="accents-crosshair absolute bottom-4 right-4 text-zinc-350 opacity-15 pointer-events-none group-hover:opacity-40 transition-opacity">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 2v20M2 12h20" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">
                      [{item.subtitle}]
                    </span>
                    <span className="inline-block bg-zinc-100 border border-[#2a2a2a] px-2.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase transition-colors group-hover:bg-[#2a2a2a] group-hover:text-white">
                      CLICK TO OPEN
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
                    {item.title}
                  </h2>
                </div>
                
                <p className="font-sans font-medium text-zinc-650 text-xs line-clamp-2 mt-4 relative z-10">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Viewport Detail Overlay */}
        {activeCardId !== null && activeCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/45 backdrop-blur-sm">
            <div
              data-flip-id={`bento-${activeCard.id}`}
              className="w-full max-w-2xl brutalist-card p-6 md:p-10 bg-white flex flex-col justify-between relative overflow-hidden"
            >
              {/* Technical Dot accent inside details modal */}
              <div className="absolute top-4 left-6 flex items-center gap-2 pointer-events-none">
                <span className="h-2 w-2 rounded-full bg-wtf-green animate-ping" />
                <span className="font-mono text-[8px] text-zinc-450 uppercase font-black">ACTIVE NODE</span>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 brutalist-btn bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-mono font-bold text-lg cursor-pointer"
              >
                ×
              </button>

              <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col gap-2 overlay-content-item opacity-0">
                  <span className="font-mono text-xs text-zinc-450 uppercase tracking-wider">
                    [{activeCard.subtitle}]
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
                    {activeCard.title}
                  </h2>
                </div>

                <p className="font-sans font-medium text-zinc-700 text-sm md:text-base leading-relaxed overlay-content-item opacity-0">
                  {activeCard.description}
                </p>

                <div className="flex flex-col gap-3 overlay-content-item opacity-0">
                  <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                    [ Detailed Specifications ]
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeCard.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-zinc-50 border border-zinc-300 p-3 rounded-lg"
                      >
                        <span
                          className={`w-2 h-2 rounded-full border border-black ${activeCard.color}`}
                        />
                        <span className="font-mono text-xs font-bold text-zinc-700">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 border-t-2 border-zinc-200 pt-6 overlay-content-item opacity-0">
                <button
                  onClick={handleClose}
                  className="brutalist-btn bg-white text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Close Detail
                </button>
                <button
                  className={`brutalist-btn text-white font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer ${activeCard.color}`}
                >
                  Execute Module
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer link */}
      <footer className="z-10 mb-8">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </footer>
    </div>
  );
}
