"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

interface BentoItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gridClass: string;
  color: string; // Tailwind bg color class
  accentHex: string; // Raw hex for glowing spotlights
  imgUrl: string;
  statLabel: string;
  statValue: string;
}

export default function BentoGridPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const bentoItems: BentoItem[] = [
    {
      id: 1,
      title: "Core Mechanics",
      subtitle: "STATS MONITOR",
      description:
        "Optimized event pipelines running at 60fps. Handles complex coordinate transforms and collision grids dynamically.",
      gridClass: "col-span-1 md:col-span-2 h-[280px]",
      color: "bg-[#e55b3c]",
      accentHex: "229, 91, 60", // wtf-orange rgb
      imgUrl: "/Untitled design.png",
      statLabel: "RENDER STABILITY",
      statValue: "99.8% // PASS",
    },
    {
      id: 2,
      title: "Design System",
      subtitle: "UI TOKENS",
      description:
        "Neo-Brutalist utility layers, interactive variables, and asymmetric structural skews.",
      gridClass: "col-span-1 row-span-1 md:row-span-2 h-auto md:h-[584px]",
      color: "bg-[#0c9367]",
      accentHex: "12, 147, 103", // wtf-green rgb
      imgUrl: "/Untitled design (1).png",
      statLabel: "VARIABLE SYNC",
      statValue: "42 TOKENS",
    },
    {
      id: 3,
      title: "Velocity Engine",
      subtitle: "SCROLL DETECTOR",
      description:
        "Inertia metrics reading delta inputs to drive canvas rendering. Auto-clamps bounds to maximize frames.",
      gridClass: "col-span-1 h-[280px]",
      color: "bg-[#f1b333]",
      accentHex: "241, 179, 51", // wtf-yellow rgb
      imgUrl: "/Untitled design (2).png",
      statLabel: "INTERPOLATION RATE",
      statValue: "0.15s DAMP",
    },
    {
      id: 4,
      title: "Elastic Cursor",
      subtitle: "LAGGING RETICLE",
      description:
        "Dual-coordinate pointer smoothing with custom elasticity weights. Morphing boundaries snap to hover nodes.",
      gridClass: "col-span-1 h-[280px]",
      color: "bg-[#6758a5]",
      accentHex: "103, 88, 165", // wtf-purple rgb
      imgUrl: "/Untitled design (3).png",
      statLabel: "SPRING STIFFNESS",
      statValue: "k=0.75",
    },
    {
      id: 5,
      title: "Morphing Accordions",
      subtitle: "STAGGER DETAIL",
      description:
        "Color transitions driven by background morph targets. Inner elements unfold using autoAlpha spring tweens.",
      gridClass: "col-span-1 md:col-span-2 h-[280px]",
      color: "bg-[#3b82f6]",
      accentHex: "59, 130, 246", // wtf-blue rgb
      imgUrl: "/Untitled design (4).png",
      statLabel: "TRANSITION DELAY",
      statValue: "0.08s STAG",
    },
  ];

  const { contextSafe } = useGSAP({ scope: containerRef });

  // 3D Perspective Tilt on Hover (subtle and controlled)
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set coordinates for custom inline CSS spotlight
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // Small, elegant 3D tilt values (-5 to +5 degrees)
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });

    const crosshair = card.querySelector(".accents-crosshair");
    if (crosshair) {
      gsap.to(crosshair, {
        rotation: ((x - rect.width / 2) / rect.width) * 90,
        duration: 0.45,
        ease: "power1.out",
        overwrite: "auto",
      });
    }

    // Interactive image push inside frame
    const imgFrame = card.querySelector(".inner-img-container img");
    if (imgFrame) {
      const moveX = ((x - rect.width / 2) / rect.width) * 10;
      const moveY = ((y - rect.height / 2) / rect.height) * 10;
      gsap.to(imgFrame, {
        x: moveX,
        y: moveY,
        scale: 1.05,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  });

  // Reset 3D Tilt on Mouse Leave
  const handleMouseLeave = contextSafe(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: "elastic.out(1.1, 0.4)",
        duration: 0.75,
        overwrite: "auto",
      });

      const crosshair = card.querySelector(".accents-crosshair");
      if (crosshair) {
        gsap.to(crosshair, {
          rotation: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      }

      const imgFrame = card.querySelector(".inner-img-container img");
      if (imgFrame) {
        gsap.to(imgFrame, {
          x: 0,
          y: 0,
          scale: 1.0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
  );

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-between p-6 md:p-12 selection:bg-[#f1b333] selection:text-black overflow-x-hidden font-sans"
      ref={containerRef}
    >
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{ backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Floating Dashboard Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#2a2a2a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2a2a2a] bg-[#f1b333] text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Header Info */}
      <header className="z-10 w-full max-w-3xl text-center flex flex-col gap-3 mt-12 md:mt-6 select-none">
        <div className="inline-flex self-center items-center gap-2 bg-[#0c9367] border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] rotate-2">
          <span>Component 13</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
          Bento Grid Tilt
        </h1>
        <p className="max-w-md mx-auto text-zinc-650 text-xs md:text-sm leading-relaxed font-sans font-medium">
          A clean, professional showcase layout. Hover cards to experience
          smooth 3D perspective depth, vector snaps, and reactive images.
        </p>
      </header>

      {/* Bento Grid Area */}
      <main className="z-10 w-full max-w-5xl my-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          {bentoItems.map((item) => {
            const isWide = item.gridClass.includes("col-span-2");
            const isTall = item.gridClass.includes("md:h-[584px]");

            return (
              <div
                key={item.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`group p-6 bg-white flex flex-col justify-between overflow-hidden relative select-none cursor-pointer rounded-2xl border-3 border-[#2a2a2a] shadow-[5px_5px_0px_#2a2a2a] hover:shadow-[10px_10px_0px_#2a2a2a] transition-shadow duration-200 ${
                  item.gridClass
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                }}
              >
                {/* Pointer Spotlight Overlay Element */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"
                  style={{
                    background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${item.accentHex}, 0.08), transparent 85%)`,
                  }}
                />

                {/* Tech Blueprint Accent Crosshairs */}
                <div
                  className="accents-crosshair absolute bottom-4 right-4 text-zinc-300 opacity-20 pointer-events-none group-hover:opacity-60 transition-opacity"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <svg
                    className="w-9 h-9"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                    <path d="M12 2v20M2 12h20" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* For Wide Layouts (Image on the right, content on the left) */}
                {isWide ? (
                  <div className="flex flex-row h-full gap-6 w-full relative z-10">
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-black text-zinc-400">
                            [{item.subtitle}]
                          </span>
                          <span
                            className={`inline-block border border-[#2a2a2a] px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${item.color}`}
                          >
                            SYS ACTIVE
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
                          {item.title}
                        </h2>
                        <p className="font-sans font-medium text-zinc-600 text-[11px] md:text-xs leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Stat box at bottom */}
                      <div className="border-2 border-[#2a2a2a] bg-zinc-50 p-2.5 rounded-xl flex items-center justify-between font-mono max-w-[220px] shadow-[2px_2px_0px_#2a2a2a]">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-zinc-400 font-bold uppercase">
                            {item.statLabel}
                          </span>
                          <span className="text-[9px] font-black text-[#2a2a2a]">
                            {item.statValue}
                          </span>
                        </div>
                        <span
                          className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${item.color}`}
                        />
                      </div>
                    </div>

                    {/* Framed Image on Right */}
                    <div
                      className="inner-img-container hidden sm:block w-[160px] md:w-[200px] h-full border-3 border-[#2a2a2a] relative overflow-hidden rounded-xl bg-zinc-50 shadow-[3px_3px_0px_#2a2a2a]"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      <Image
                        src={item.imgUrl}
                        alt={item.title}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-300"
                      />
                    </div>
                  </div>
                ) : isTall ? (
                  // For Tall Layouts (Text, then Image, then Stat)
                  <div className="flex flex-col h-full justify-between w-full relative z-10">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-black text-zinc-400">
                          [{item.subtitle}]
                        </span>
                        <span
                          className={`inline-block border border-[#2a2a2a] px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${item.color}`}
                        >
                          SYS ACTIVE
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
                        {item.title}
                      </h2>
                    </div>

                    {/* Centered Image frame */}
                    <div
                      className="inner-img-container w-full h-[220px] md:h-[260px] border-3 border-[#2a2a2a] relative overflow-hidden rounded-xl bg-zinc-50 my-4 shadow-[3px_3px_0px_#2a2a2a]"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      <Image
                        src={item.imgUrl}
                        alt={item.title}
                        fill
                        sizes="350px"
                        className="object-cover transition-transform duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="font-sans font-medium text-zinc-600 text-xs leading-relaxed">
                        {item.description}
                      </p>

                      {/* Stat box at bottom */}
                      <div className="border-2 border-[#2a2a2a] bg-zinc-50 p-2.5 rounded-xl flex items-center justify-between font-mono shadow-[2px_2px_0px_#2a2a2a]">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-zinc-400 font-bold uppercase">
                            {item.statLabel}
                          </span>
                          <span className="text-[9px] font-black text-[#2a2a2a]">
                            {item.statValue}
                          </span>
                        </div>
                        <span
                          className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${item.color}`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // For Standard Square Layouts (Text, then Stat)
                  <div className="flex flex-col h-full justify-between w-full relative z-10">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-black text-zinc-400">
                          [{item.subtitle}]
                        </span>
                        <span
                          className={`inline-block border border-[#2a2a2a] px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase ${item.color}`}
                        >
                          SYS ACTIVE
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
                        {item.title}
                      </h2>
                      <p className="font-sans font-medium text-zinc-650 text-xs leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Stat box at bottom */}
                    <div className="border-2 border-[#2a2a2a] bg-zinc-50 p-2.5 rounded-xl flex items-center justify-between font-mono shadow-[2px_2px_0px_#2a2a2a]">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-zinc-400 font-bold uppercase">
                          {item.statLabel}
                        </span>
                        <span className="text-[9px] font-black text-[#2a2a2a]">
                          {item.statValue}
                        </span>
                      </div>
                      <span
                        className={`h-2.5 w-2.5 rounded-full border border-black animate-pulse ${item.color}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer link */}
      <footer className="z-10 mt-4">
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#2a2a2a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2a2a2a] bg-[#f1b333] text-[#2a2a2a] font-mono font-bold text-xs py-3.5 px-6 rounded-xl uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
      </footer>
    </div>
  );
}
