"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface CarouselItem {
  id: number;
  num: string;
  title: string;
  category: string;
  desc: string;
  imgUrl: string;
  bgColor: string; // Hex color for background transitions
  accentColor: string; // Tailwind class
  textColor: string;
}

const items: CarouselItem[] = [
  {
    id: 0,
    num: "01",
    title: "Quantum Compiler",
    category: "ENGINEERING",
    desc: "A custom LLVM backend translating abstract syntax trees into parallel topological gates.",
    imgUrl: "/Untitled design.png",
    bgColor: "#e55b3c", // wtf-orange
    accentColor: "bg-wtf-orange",
    textColor: "text-white",
  },
  {
    id: 1,
    num: "02",
    title: "Kinetic Geometry",
    category: "GRAPHICS",
    desc: "GPU-accelerated vector fields tracing magnetic flow lines with spring-damper integrations.",
    imgUrl: "/Untitled design (1).png",
    bgColor: "#0c9367", // wtf-green
    accentColor: "bg-wtf-green",
    textColor: "text-white",
  },
  {
    id: 2,
    num: "03",
    title: "Syntactic Shadow",
    category: "AESTHETICS",
    desc: "High-contrast editorial grid structures utilizing strict monospace matrices and ink traps.",
    imgUrl: "/Untitled design (2).png",
    bgColor: "#6758a5", // wtf-purple
    accentColor: "bg-wtf-purple",
    textColor: "text-white",
  },
  {
    id: 3,
    num: "04",
    title: "Hydra Protocol",
    category: "NETWORKS",
    desc: "A peer-to-peer ledger using ephemeral cryptographic state rings and consensus maps.",
    imgUrl: "/Untitled design (3).png",
    bgColor: "#3b82f6", // wtf-blue
    accentColor: "bg-wtf-blue",
    textColor: "text-white",
  },
  {
    id: 4,
    num: "05",
    title: "Hyperion Core",
    category: "HARDWARE",
    desc: "FPGA solvers designed for extreme throughput pipelines and multi-threaded register stacks.",
    imgUrl: "/Untitled design (4).png",
    bgColor: "#c53b3a", // wtf-red
    accentColor: "bg-wtf-red",
    textColor: "text-white",
  },
  {
    id: 5,
    num: "06",
    title: "Helios Shader",
    category: "RAYTRACING",
    desc: "Real-time volumetric path tracers modeling multi-scatter atmospheric absorption.",
    imgUrl: "/Untitled design (5).png",
    bgColor: "#f1b333", // wtf-yellow
    accentColor: "bg-wtf-yellow",
    textColor: "text-black",
  },
];

export default function ThreeDCarouselPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  // Dragging and scrolling state references
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startRotation: 0,
    rotation: 0,
    smoothRotation: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });

  const getHexWithOpacity = (hex: string, alpha: number) => {
    // Simple hex to rgba helper
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Setup loop ticker to smoothly interpolate carousel rotation
  useGSAP(() => {
    const updatePositions = () => {
      const state = dragRef.current;
      const numCards = items.length;

      if (detailIdx === null) {
        // Normal interactive carousel behavior
        if (state.isDragging) {
          state.smoothRotation += (state.rotation - state.smoothRotation) * 0.25;
        } else {
          // Add friction momentum if released
          state.velocity *= 0.92;
          state.rotation += state.velocity;
          // Clamp target rotation
          state.rotation = Math.max(0, Math.min(numCards - 1, state.rotation));
          state.smoothRotation += (state.rotation - state.smoothRotation) * 0.15;
        }
      }

      // Sync active index state (for pagination/indicator highlights)
      const currentActive = Math.max(0, Math.min(numCards - 1, Math.round(state.smoothRotation)));
      setActiveIdx(currentActive);

      // Interpolate ambient background color
      const activeItem = items[currentActive];
      if (wrapperRef.current && detailIdx === null) {
        const targetBg = getHexWithOpacity(activeItem.bgColor, 0.12);
        gsap.to(wrapperRef.current, {
          backgroundColor: targetBg,
          duration: 0.5,
          overwrite: "auto",
        });
      }

      // Apply 3D transforms to all cards in the carousel
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // In detail mode, the active card gets a special animation, and others fade out completely
        if (detailIdx !== null) {
          if (index !== detailIdx) {
            gsap.to(card, {
              opacity: 0,
              scale: 0.5,
              z: -400,
              x: index < detailIdx ? -600 : 600,
              rotationY: index < detailIdx ? -60 : 60,
              pointerEvents: "none",
              duration: 0.6,
              overwrite: "auto",
            });
          }
          return;
        }

        // Standard carousel layout positions
        const diff = index - state.smoothRotation;
        
        // Calculations for coverflow layout
        const xStep = 260; // Horizontal offset per card
        const zStep = 180; // Depth push per card
        const maxRotY = 48; // Maximum Y rotation
        
        const x = diff * xStep;
        const z = -Math.abs(diff) * zStep;
        const rotY = Math.max(-maxRotY, Math.min(maxRotY, diff * -35));
        
        // Custom scale and opacity coefficients
        const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.08);
        const opacity = Math.max(0.08, 1 - Math.abs(diff) * 0.38);
        const isClickable = Math.abs(diff) < 0.8;

        gsap.set(card, {
          x: x,
          y: 0,
          z: z,
          rotationY: rotY,
          scale: scale,
          opacity: opacity,
          zIndex: Math.round(100 - Math.abs(diff) * 10),
          pointerEvents: isClickable ? "auto" : "none",
        });
      });
    };

    gsap.ticker.add(updatePositions);
    return () => gsap.ticker.remove(updatePositions);
  }, { scope: wrapperRef, dependencies: [detailIdx] });

  // Handle Drag / Pointer Events
  const handlePointerDown = (e: React.PointerEvent) => {
    if (detailIdx !== null) return;
    
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    const state = dragRef.current;
    state.isDragging = true;
    state.startX = e.clientX;
    state.startRotation = state.rotation;
    state.lastX = e.clientX;
    state.lastTime = Date.now();
    state.velocity = 0;

    if (carouselRef.current) {
      carouselRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = dragRef.current;
    if (!state.isDragging) return;

    const width = wrapperRef.current?.offsetWidth || 1000;
    const deltaX = e.clientX - state.startX;
    
    // Sensitivity: how many cards to slide per full width drag
    const sensitivity = 2.2;
    state.rotation = state.startRotation - (deltaX / width) * sensitivity;

    // Track instant velocity
    const now = Date.now();
    const dt = now - state.lastTime;
    if (dt > 0) {
      const dx = e.clientX - state.lastX;
      // Convert delta X pixels to rotation velocity units
      state.velocity = -(dx / width) * sensitivity * 0.7;
      state.lastX = e.clientX;
      state.lastTime = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const state = dragRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;

    if (carouselRef.current) {
      carouselRef.current.releasePointerCapture(e.pointerId);
    }

    // Snap to nearest integer index with momentum bias
    const numCards = items.length;
    const momentumOffset = state.velocity * 4;
    const targetSnap = Math.max(0, Math.min(numCards - 1, Math.round(state.rotation + momentumOffset)));
    
    // Animate target rotation to exact snapping position
    gsap.to(state, {
      rotation: targetSnap,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    state.velocity = 0;
  };

  // Handle Wheel Scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (detailIdx !== null) return;
    
    const state = dragRef.current;
    const numCards = items.length;

    // Scroll amount converts to small delta offset
    const delta = e.deltaY * 0.0015;
    state.rotation = Math.max(0, Math.min(numCards - 1, state.rotation + delta));
    
    // Smooth snapping on scroll finish (debounced look)
    gsap.killTweensOf(state);
    gsap.to(state, {
      rotation: Math.round(state.rotation),
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const closeDetail = useCallback(() => {
    if (detailIdx === null) return;

    const previousIdx = detailIdx;
    setDetailIdx(null);

    // Stagger out elements inside detail panel
    if (detailPanelRef.current) {
      gsap.to(detailPanelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }

    // Restore wrapper background
    const activeItem = items[previousIdx];
    if (wrapperRef.current) {
      const targetBg = getHexWithOpacity(activeItem.bgColor, 0.12);
      gsap.to(wrapperRef.current, {
        backgroundColor: targetBg,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [detailIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (detailIdx !== null) {
        if (e.key === "Escape") {
          closeDetail();
        }
        return;
      }

      const state = dragRef.current;
      const numCards = items.length;

      if (e.key === "ArrowRight") {
        const next = Math.min(numCards - 1, Math.round(state.rotation) + 1);
        gsap.to(state, { rotation: next, duration: 0.5, ease: "power2.out" });
      } else if (e.key === "ArrowLeft") {
        const prev = Math.max(0, Math.round(state.rotation) - 1);
        gsap.to(state, { rotation: prev, duration: 0.5, ease: "power2.out" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailIdx, closeDetail]);

  // Card Mouse Hover 3D Tilt Effect
  const handleCardMouseMove = (e: React.MouseEvent, index: number) => {
    if (detailIdx !== null) return;
    
    const state = dragRef.current;
    // Only apply hover tilt to the active card
    if (index !== Math.round(state.smoothRotation)) return;

    const card = cardInnersRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    // Calculate rotation limits (-15 to 15 degrees)
    const rotY = (xPercent - 0.5) * 20;
    const rotX = (yPercent - 0.5) * -20;

    gsap.to(card, {
      rotationY: rotY,
      rotationX: rotX,
      scale: 1.04,
      boxShadow: "12px 12px 0px #2a2a2a",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardInnersRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      boxShadow: "6px 6px 0px #2a2a2a",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  // Detail Panel Reveal Transition
  const openDetail = (index: number) => {
    const state = dragRef.current;
    if (index !== Math.round(state.smoothRotation)) {
      // If clicked card is not centered, center it first!
      gsap.to(state, {
        rotation: index,
        duration: 0.5,
        ease: "power2.out",
      });
      return;
    }

    setDetailIdx(index);
    const card = cardsRef.current[index];
    const activeItem = items[index];

    if (!card) return;

    // Shift wrapper background to solid active color
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        backgroundColor: activeItem.bgColor,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    // Animate active card straight to the viewport left side
    gsap.to(card, {
      x: "-25vw",
      y: 0,
      z: 0,
      scale: 1,
      rotationY: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    // Stagger in elements inside the detail panel
    if (detailPanelRef.current) {
      gsap.fromTo(
        detailPanelRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.7, ease: "power3.inOut", overwrite: "auto" }
      );

      gsap.fromTo(
        detailPanelRef.current.querySelectorAll(".stagger-in"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.3, overwrite: "auto" }
      );
    }
  };



  return (
    <div
      ref={wrapperRef}
      onWheel={handleWheel}
      className="relative w-full h-screen overflow-hidden bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black font-sans transition-colors duration-500"
    >
      {/* Dynamic tactile noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-10" />

      {/* Floating Dashboard Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
        onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
        className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase tracking-wider cursor-pointer"
        
      >
        ← Back
      </button>
      </div>

      {/* Header Info */}
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-1 select-none text-right">
        <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-300 bg-white px-2 py-0.5 rounded">
          Component 14
        </span>
        <h1 className="font-serif font-black text-lg md:text-xl uppercase tracking-tight text-[#2a2a2a]">
          3D Coverflow Carousel
        </h1>
        <p className="font-mono text-[9px] text-zinc-500 max-w-[200px]">
          [Drag / Scroll Wheel / Arrow Keys]
        </p>
      </div>

      {/* Left/Right Button Indicators */}
      <div className={`absolute bottom-6 left-6 z-30 flex gap-2.5 transition-opacity duration-300 ${detailIdx !== null ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <button
          onClick={() => {
            const state = dragRef.current;
            const prev = Math.max(0, Math.round(state.rotation) - 1);
            gsap.to(state, { rotation: prev, duration: 0.5, ease: "power2.out" });
          }}
          className="w-10 h-10 rounded-md border-3 border-[#2a2a2a] bg-white hover:bg-zinc-100 flex items-center justify-center font-bold shadow-[3px_3px_0px_#2a2a2a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#2a2a2a] cursor-pointer"
        >
          ←
        </button>
        <button
          onClick={() => {
            const state = dragRef.current;
            const next = Math.min(items.length - 1, Math.round(state.rotation) + 1);
            gsap.to(state, { rotation: next, duration: 0.5, ease: "power2.out" });
          }}
          className="w-10 h-10 rounded-md border-3 border-[#2a2a2a] bg-white hover:bg-zinc-100 flex items-center justify-center font-bold shadow-[3px_3px_0px_#2a2a2a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#2a2a2a] cursor-pointer"
        >
          →
        </button>
      </div>

      {/* Pagination Dot/Number Bar */}
      <div className={`absolute bottom-6 right-6 z-30 flex items-center gap-4 transition-opacity duration-300 ${detailIdx !== null ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="flex gap-2">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                const state = dragRef.current;
                gsap.to(state, { rotation: idx, duration: 0.5, ease: "power2.out" });
              }}
              className={`h-3 rounded-full border-2 border-[#2a2a2a] transition-all duration-300 cursor-pointer ${
                idx === activeIdx ? "w-8 bg-wtf-yellow" : "w-3 bg-white"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-xs font-bold bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] px-3 py-1 rounded shadow-[2px_2px_0px_#f1b333]">
          0{activeIdx + 1} / 0{items.length}
        </span>
      </div>

      {/* Carousel Main Stage Wrapper */}
      <div
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full flex items-center justify-center relative select-none scroll-viewport cursor-grab active:cursor-grabbing"
        style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIdx;

          return (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              onClick={() => openDetail(idx)}
              className="absolute w-[290px] h-[390px] md:w-[340px] md:h-[450px] flex items-center justify-center will-animate-both"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Face container */}
              <div
                ref={(el) => {
                  cardInnersRef.current[idx] = el;
                }}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={() => handleCardMouseLeave(idx)}
                className={`w-full h-full brutalist-card p-4 bg-white flex flex-col justify-between cursor-pointer rounded-xl select-none relative overflow-hidden group ${
                  isActive ? "border-wtf-yellow" : "border-[#2a2a2a]"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                }}
              >
                {/* 3D Content Layers */}
                <div className="flex flex-col gap-3" style={{ transform: "translateZ(30px)" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-zinc-400">[NODE {item.num}]</span>
                    <span className={`border-2 border-[#2a2a2a] px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase shadow-[1px_1px_0px_#2a2a2a] ${item.accentColor}`}>
                      {item.category}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none select-none">
                    {item.title}
                  </h2>
                </div>

                {/* Card Image Area */}
                <div
                  className="w-full h-[180px] md:h-[230px] border-3 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-100"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <Image
                    src={item.imgUrl}
                    alt={item.title}
                    fill
                    sizes="(max-w-7xl) 35vw"
                    priority={idx < 3}
                    className="object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between mt-2" style={{ transform: "translateZ(20px)" }}>
                  <span className="font-mono text-[10px] font-bold text-zinc-500">
                    CLICK TO EXPAND
                  </span>
                  <div className={`w-8 h-8 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-bold text-xs shadow-[1.5px_1.5px_0px_#2a2a2a] transition-colors ${item.accentColor} ${item.textColor}`}>
                    ↗
                  </div>
                </div>

                {/* Ambient glow accent (only active) */}
                {isActive && (
                  <div
                    className="absolute inset-0 border-3 border-wtf-yellow opacity-40 animate-pulse pointer-events-none rounded-xl"
                    style={{ transform: "translateZ(-1px)" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Split Detail View Panel */}
      <div
        ref={detailPanelRef}
        className="fixed top-0 right-0 w-full md:w-[50vw] h-full bg-white border-l-4 border-[#2a2a2a] z-40 flex flex-col justify-between p-8 md:p-14 shadow-2xl pointer-events-auto transform translate-x-full opacity-0"
      >
        {detailIdx !== null && (
          <>
            {/* Top Bar inside panel */}
            <div className="flex items-center justify-between stagger-in">
              <span className="font-mono text-xs font-bold text-zinc-400">
                MODULE 0{items[detailIdx].id + 1} {"//"} DETAIL EXPANSION
              </span>
              <button
                onClick={closeDetail}
                className="brutalist-btn bg-wtf-red text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm hover:bg-red-700 cursor-pointer shadow-[3px_3px_0px_#2a2a2a]"
              >
                ✕
              </button>
            </div>

            {/* Core Info details */}
            <div className="flex flex-col gap-6 md:gap-8 my-auto">
              <div className="stagger-in flex items-center gap-3">
                <span className={`border-2 border-[#2a2a2a] px-3.5 py-1 rounded-full text-xs font-mono font-bold text-white uppercase shadow-[2.5px_2.5px_0px_#2a2a2a] ${items[detailIdx].accentColor}`}>
                  {items[detailIdx].category}
                </span>
                <span className="font-mono text-sm text-zinc-500 font-semibold">
                  System Active
                </span>
              </div>

              <h2 className="stagger-in text-4xl md:text-6xl font-serif font-black uppercase text-[#2a2a2a] leading-none tracking-tight">
                {items[detailIdx].title}
              </h2>

              <p className="stagger-in text-base md:text-lg font-sans font-medium text-zinc-700 leading-relaxed border-l-4 border-[#2a2a2a] pl-6">
                {items[detailIdx].desc}
              </p>

              {/* Decorative data block specs */}
              <div className="stagger-in grid grid-cols-2 gap-4 mt-4 font-mono">
                <div className="border-2 border-[#2a2a2a] p-3 rounded-lg bg-zinc-50 shadow-[2px_2px_0px_#2a2a2a]">
                  <span className="text-[10px] text-zinc-400 block font-bold">SOLVER RATE</span>
                  <span className="text-sm font-black text-[#2a2a2a]">60.00 Hz // PASS</span>
                </div>
                <div className="border-2 border-[#2a2a2a] p-3 rounded-lg bg-zinc-50 shadow-[2px_2px_0px_#2a2a2a]">
                  <span className="text-[10px] text-zinc-400 block font-bold">LATENCY SYNC</span>
                  <span className="text-sm font-black text-[#2a2a2a]">0.02 ms // SAFE</span>
                </div>
              </div>
            </div>

            {/* Footer buttons / actions inside panel */}
            <div className="stagger-in flex flex-col md:flex-row gap-4 mt-auto">
              <button
                className={`brutalist-btn flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm uppercase tracking-wider cursor-pointer text-center ${items[detailIdx].accentColor} ${items[detailIdx].textColor}`}
              >
                Execute Pipeline
              </button>
              <button
                onClick={closeDetail}
                className="brutalist-btn flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm uppercase tracking-wider bg-white hover:bg-zinc-100 text-[#2a2a2a] cursor-pointer"
              >
                Close Spec
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
