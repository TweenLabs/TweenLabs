"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

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
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver: only activate cursor effects when component is in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

      if (!isInView) return;
      window.addEventListener("mousemove", updateCursor);
      return () => window.removeEventListener("mousemove", updateCursor);
    },
    { scope: containerRef, dependencies: [isInView] },
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
      className={`relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-8 selection:bg-[#f1b333] selection:text-black overflow-hidden ${isInView ? "cursor-none" : ""}`}
      ref={containerRef}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Custom Cursor elements (pointer-events-none is CRITICAL) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 bg-[#2a2a2a] rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2"
        style={{ display: isInView ? "block" : "none" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border-3 border-[#2a2a2a] rounded-full pointer-events-none z-[9998] flex items-center justify-center bg-transparent"
        style={{
          transformOrigin: "top left",
          display: isInView ? "flex" : "none",
        }}
      >
        <span className="cursor-label absolute pointer-events-none font-mono text-[9px] font-black bg-[#f1b333] text-black border-2 border-[#2a2a2a] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_#2a2a2a] uppercase opacity-0 scale-75 tracking-widest whitespace-nowrap z-50 select-none" />
      </div>

      {/* Grid of Snapping Targets */}
      <main className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 my-12 pointer-events-auto">
        {/* Card Target 1 */}
        <div
          data-cursor-text="EXPLORE A"
          onMouseEnter={handleTargetEnter}
          onMouseLeave={handleTargetLeave}
          className="border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] p-6 bg-white flex flex-col gap-4 justify-between h-48 cursor-none transition-transform"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              DATA SOURCE A
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#e55b3c] border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a]" />
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
          className="border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] p-6 bg-white flex flex-col gap-4 justify-between h-48 cursor-none transition-transform"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              DATA SOURCE B
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#0c9367] border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a]" />
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
          className="border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] p-6 bg-white flex flex-col gap-4 justify-between h-48 cursor-none transition-transform"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              DATA SOURCE C
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#3b82f6] border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a]" />
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
          className="border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#2a2a2a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2a2a2a] bg-[#f1b333] text-black font-mono font-bold text-sm py-4 px-8 rounded-xl cursor-none"
        >
          ⚡ Action Portal
        </button>
      </div>
    </div>
  );
}
