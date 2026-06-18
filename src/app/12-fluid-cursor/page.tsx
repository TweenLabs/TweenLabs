"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function FluidCursorPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom cursor elements
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Mouse state refs
  const mouseCoords = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const activeTargetRef = useRef<HTMLElement | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (typeof window === "undefined" || !dotRef.current || !ringRef.current)
        return;

      // quickTo helpers for smooth tracking
      const xToDot = gsap.quickTo(dotRef.current, "x", {
        duration: 0.08,
        ease: "power2.out",
      });
      const yToDot = gsap.quickTo(dotRef.current, "y", {
        duration: 0.08,
        ease: "power2.out",
      });

      const updateCursor = (e: MouseEvent) => {
        mouseCoords.current = { x: e.clientX, y: e.clientY };

        // If we are not currently snapped/hovering on a magnetic target, track the mouse
        if (!isHovered.current) {
          xToDot(e.clientX);
          yToDot(e.clientY);
          gsap.to(ringRef.current, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else if (activeTargetRef.current) {
          // If we are hovering a target, follow the mouse inside the target with a slight offset
          const rect = activeTargetRef.current.getBoundingClientRect();

          // Calculate offsets inside the element to create a magnetic drag effect
          const elementCenterX = rect.left + rect.width / 2;
          const elementCenterY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - elementCenterX) * 0.15;
          const deltaY = (e.clientY - elementCenterY) * 0.15;

          // Animate the snap border with the drag offset
          gsap.to(ringRef.current, {
            x: rect.left + deltaX,
            y: rect.top + deltaY,
            duration: 0.2,
            overwrite: "auto",
          });

          // Small dot tracks mouse closely inside target
          xToDot(e.clientX);
          yToDot(e.clientY);
        }
      };

      window.addEventListener("mousemove", updateCursor);
      return () => window.removeEventListener("mousemove", updateCursor);
    },
    { scope: containerRef },
  );

  // Handle snapping mouse enter
  const handleTargetEnter = (e: React.MouseEvent<HTMLElement>) => {
    isHovered.current = true;
    const target = e.currentTarget;
    activeTargetRef.current = target;

    const rect = target.getBoundingClientRect();
    const cursorText = target.getAttribute("data-cursor-text") || "";

    contextSafe(() => {
      // Smoothly morph the outer ring to enclose the hovered element
      gsap.to(ringRef.current, {
        width: rect.width,
        height: rect.height,
        borderRadius: "12px", // match standard brutalist cards
        borderWidth: "3px",
        borderColor: "#2a2a2a",
        backgroundColor: "rgba(241, 179, 51, 0.2)", // semi-transparent yellow
        boxShadow: "4px 4px 0px #2a2a2a",
        x: rect.left,
        y: rect.top,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Animate inner dot to scale down
      gsap.to(dotRef.current, {
        scale: 0.5,
        backgroundColor: "#e55b3c", // orange dot
        duration: 0.2,
        overwrite: "auto",
      });

      // Make target hover tag visible inside the ring
      const labelEl = ringRef.current?.querySelector(".cursor-label");
      if (labelEl) {
        labelEl.innerHTML = cursorText;
        gsap.to(labelEl, {
          opacity: 1,
          scale: 1,
          y: -24,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    })();
  };

  // Handle mouse leave reset
  const handleTargetLeave = () => {
    isHovered.current = false;
    activeTargetRef.current = null;

    contextSafe(() => {
      // Reset ring back to default round state
      gsap.to(ringRef.current, {
        width: 32,
        height: 32,
        borderRadius: "9999px",
        borderWidth: "3px",
        borderColor: "#2a2a2a",
        backgroundColor: "transparent",
        boxShadow: "0px 0px 0px transparent",
        duration: 0.35,
        ease: "back.out(1.5)",
        overwrite: "auto",
      });

      // Reset dot back to default
      gsap.to(dotRef.current, {
        scale: 1,
        backgroundColor: "#2a2a2a",
        duration: 0.2,
        overwrite: "auto",
      });

      // Hide text label
      const labelEl = ringRef.current?.querySelector(".cursor-label");
      if (labelEl) {
        gsap.to(labelEl, {
          opacity: 0,
          scale: 0.6,
          y: 0,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    })();
  };

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-between p-8 selection:bg-wtf-yellow selection:text-black overflow-hidden cursor-none"
      ref={containerRef}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Custom Cursor elements (pointer-events-none is CRITICAL) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 bg-[#2a2a2a] rounded-full pointer-events-none z-9999 transform -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border-3 border-[#2a2a2a] rounded-full pointer-events-none z-9998 flex items-center justify-center bg-transparent"
        style={{ transformOrigin: "top left" }}
      >
        <span className="cursor-label absolute pointer-events-none font-mono text-[9px] font-black bg-wtf-yellow text-black border-2 border-[#2a2a2a] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_#2a2a2a] uppercase opacity-0 scale-70 tracking-widest whitespace-nowrap z-50 select-none" />
      </div>

      {/* Header Info */}
      <header className="z-10 w-full max-w-2xl text-center flex flex-col gap-4 mt-8 pointer-events-auto">
        <div className="inline-flex self-center items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Component 12</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
          Fluid Custom Cursor
        </h1>
        <p className="max-w-md mx-auto text-zinc-700 text-sm leading-relaxed font-sans font-medium">
          Move your mouse over the bento cards and buttons below. The custom
          reticle cursor will smoothly track, morph, and stick onto target card
          boundaries.
        </p>
      </header>

      {/* Grid of Snapping Targets */}
      <main className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 my-12 pointer-events-auto">
        {/* Card Target 1 */}
        <div
          data-cursor-text="EXPLORE A"
          onMouseEnter={handleTargetEnter}
          onMouseLeave={handleTargetLeave}
          className="brutalist-card p-6 bg-white flex flex-col gap-4 justify-between h-48 cursor-none transition-transform"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              DATA SOURCE A
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-wtf-orange border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a]" />
          </div>
          <h2 className="text-2xl font-serif font-black uppercase text-[#2a2a2a]">
            Project Alpha
          </h2>
          <p className="text-xs text-zinc-600 font-sans font-medium leading-normal">
            Hover here to capture the outer elastic cursor ring into this bento
            block.
          </p>
        </div>

        {/* Card Target 2 */}
        <div
          data-cursor-text="LAUNCH B"
          onMouseEnter={handleTargetEnter}
          onMouseLeave={handleTargetLeave}
          className="brutalist-card p-6 bg-white flex flex-col gap-4 justify-between h-48 cursor-none transition-transform"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              DATA SOURCE B
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-wtf-green border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a]" />
          </div>
          <h2 className="text-2xl font-serif font-black uppercase text-[#2a2a2a]">
            Project Beta
          </h2>
          <p className="text-xs text-zinc-600 font-sans font-medium leading-normal">
            The cursor snaps and expands into a tinted backdrop reveal.
          </p>
        </div>

        {/* Card Target 3 */}
        <div
          data-cursor-text="VIEW CODE"
          onMouseEnter={handleTargetEnter}
          onMouseLeave={handleTargetLeave}
          className="brutalist-card p-6 bg-white flex flex-col gap-4 justify-between h-48 cursor-none transition-transform"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              DATA SOURCE C
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-wtf-blue border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a]" />
          </div>
          <h2 className="text-2xl font-serif font-black uppercase text-[#2a2a2a]">
            Project Gamma
          </h2>
          <p className="text-xs text-zinc-600 font-sans font-medium leading-normal">
            A beautiful, lag-free user experience using GSAP&apos;s optimized
            quickTo.
          </p>
        </div>
      </main>

      {/* Button Interactive Targets */}
      <div className="z-10 flex flex-wrap gap-6 justify-center mb-8 pointer-events-auto">
        <button
          data-cursor-text="CONFIRM COMMAND"
          onMouseEnter={handleTargetEnter}
          onMouseLeave={handleTargetLeave}
          className="brutalist-btn bg-wtf-yellow text-black font-mono font-bold text-sm py-4 px-8 rounded-xl cursor-none"
        >
          ⚡ Action Portal
        </button>

        <div className="cursor-none">
          <button
            onClick={() =>
              window.history.length > 1
                ? window.history.back()
                : (window.location.href = "/")
            }
            data-cursor-text="BACK HOME"
            onMouseEnter={handleTargetEnter}
            onMouseLeave={handleTargetLeave}
            className="brutalist-btn bg-white text-[#2a2a2a] font-mono font-bold text-sm py-4 px-8 rounded-xl cursor-none"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
