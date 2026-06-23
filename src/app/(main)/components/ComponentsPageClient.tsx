"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef, useState } from "react";
import AnimationCard from "@/components/AnimationCard";
import type { AnimationItem } from "@/data/components";

gsap.registerPlugin(useGSAP);

const TYPES = [
  { label: "All", filter: null },
  { label: "Text Effects", filter: "text" },
  { label: "Scroll Controls", filter: "scroll" },
  { label: "Cards & Grids", filter: "card" },
  { label: "Interactive Elements", filter: "interactive" },
] as const;

interface Props {
  animations: AnimationItem[];
}

export default function ComponentsPageClient({ animations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.from(".comp-page-title", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(".comp-sidebar", {
        x: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
      });

      gsap.from(".comp-card", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
        delay: 0.3,
      });
    },
    { scope: containerRef },
  );

  // Filter + search
  const filtered = animations.filter((a) => {
    const matchesType =
      !activeType ||
      a.type.includes(activeType as "text" | "scroll" | "card" | "interactive");
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  const handleTypeChange = (type: string | null) => {
    setActiveType(type);
    // Animate cards on filter change
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".comp-card");
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }
  };



  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black"
    >
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-10 pt-20 md:pt-24 pb-16 lg:pb-20">
        {/* Page Header */}
        <div className="comp-page-title border-b-3 border-[#2a2a2a] pb-6 mb-8">
          <div className="flex items-end justify-between gap-4">
            <div className="shrink-0">
              <h1 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
                All Components
              </h1>
              <p className="text-xs font-mono font-bold text-wtf-orange uppercase tracking-wider mt-1">
                {filtered.length} of {animations.length} Components
              </p>
            </div>

            {/* Search bar and back link — always right */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-36 md:w-52 lg:w-64 bg-white border-2 border-[#2a2a2a] rounded-lg px-3 py-1.5 font-mono text-[10px] md:text-xs font-bold text-[#2a2a2a] placeholder:text-zinc-450 outline-none focus:border-wtf-orange transition-colors duration-150 shadow-[2px_2px_0px_#2a2a2a]"
              />
              <Link
                href="/"
                className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-[9px] md:text-[10px] py-2 px-3 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 whitespace-nowrap"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>

        {/* Type Filter Bar */}
        <div className="comp-sidebar flex flex-col md:flex-row md:items-center gap-3 mb-8 bg-white border-2 border-[#2a2a2a] p-4 rounded-xl shadow-[3px_3px_0px_#2a2a2a] select-none">
          <span className="font-mono text-[10px] md:text-xs font-black uppercase tracking-wider text-[#2a2a2a] shrink-0">
            Filter by Type:
          </span>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((type) => {
              const isActive = activeType === type.filter;
              return (
                <button
                  key={type.label || "all"}
                  onClick={() => handleTypeChange(type.filter)}
                  className={`brutalist-btn text-[9px] md:text-[10px] font-mono font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "bg-wtf-orange text-white border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a] translate-x-[1px] translate-y-[1px]"
                      : "bg-white text-[#2a2a2a] border-[#2a2a2a] hover:bg-zinc-50 shadow-[2.5px_2.5px_0px_#2a2a2a]"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full">
          {/* ── Component Grid ── */}
          <div className="w-full">
            {filtered.length === 0 ? (
              <div className="brutalist-card p-12 bg-white flex flex-col items-center gap-3">
                <span className="text-4xl">🔍</span>
                <p className="font-mono font-bold text-sm text-zinc-500 uppercase tracking-wider">
                  No components found
                </p>
                <button
                  onClick={() => {
                    setActiveType(null);
                    setSearchQuery("");
                  }}
                  className="brutalist-btn bg-wtf-orange text-white font-mono font-bold text-xs py-2 px-5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 mt-2"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6"
              >
                {filtered.map((anim) => (
                    <div key={anim.id} className="comp-card">
                      <AnimationCard anim={anim} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
