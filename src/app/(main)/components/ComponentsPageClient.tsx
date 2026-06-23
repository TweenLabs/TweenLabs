"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import AnimationMiniPreview from "@/components/AnimationMiniPreview";
import type { AnimationItem } from "@/data/components";
import { useAuthModal } from "@/provider/AuthModalProvider";
import { useSession } from "@/provider/SessionProvider";

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
  const router = useRouter();
  const { session } = useSession();
  const { openModal } = useAuthModal();

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

  const handleGetCode = (anim: AnimationItem) => {
    const url = `/code/${anim.componentName}`;
    session ? router.push(url) : openModal(url, true);
  };

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

  const hoverMap: Record<string, string> = {
    "bg-wtf-orange": "hover:border-[#f1903a]",
    "bg-wtf-green": "hover:border-[#0B9B65]",
    "bg-wtf-red": "hover:border-[#c23b3a]",
    "bg-wtf-blue": "hover:border-[#4d8ef7]",
    "bg-wtf-yellow": "hover:border-[#f1b333]",
    "bg-wtf-purple": "hover:border-[#8b5cf6]",
  };

  const hoverColorsMap: Record<string, string> = {
    "bg-wtf-orange": "hover:bg-wtf-orange hover:text-white",
    "bg-wtf-green": "hover:bg-wtf-green hover:text-white",
    "bg-wtf-red": "hover:bg-wtf-red hover:text-white",
    "bg-wtf-blue": "hover:bg-wtf-blue hover:text-white",
    "bg-wtf-yellow": "hover:bg-wtf-yellow hover:text-black",
    "bg-wtf-purple": "hover:bg-wtf-purple hover:text-white",
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
                {filtered.map((anim) => {
                  const originalIndex = animations.findIndex(
                    (a) => a.id === anim.id,
                  );
                  const displayId = String(
                    originalIndex !== -1 ? originalIndex + 1 : 0,
                  ).padStart(2, "0");
                  return (
                    <ComponentCard
                      key={anim.id}
                      anim={anim}
                      displayId={displayId}
                      hoverMap={hoverMap}
                      hoverColorsMap={hoverColorsMap}
                      onGetCode={handleGetCode}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Individual card with its own hover state for iframe preview */
function ComponentCard({
  anim,
  displayId,
  hoverMap,
  hoverColorsMap,
  onGetCode,
}: {
  anim: AnimationItem;
  displayId: string;
  hoverMap: Record<string, string>;
  hoverColorsMap: Record<string, string>;
  onGetCode: (anim: AnimationItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`comp-card brutalist-card p-5 md:p-6 bg-white flex flex-col justify-between gap-4 md:gap-5 border-2 border-[#2a2a2a] transition-all duration-150 overflow-hidden ${hoverMap[anim.bgColor] || ""}`}
    >
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-[11px] text-zinc-400">
            [{displayId}]
          </span>
          <span
            className={`inline-flex items-center border-2 border-[#2a2a2a] px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-mono font-bold uppercase ${anim.bgColor} ${anim.textColor} shadow-[1px_1px_0px_#2a2a2a]`}
          >
            {anim.bgColor.replace("bg-wtf-", "")}
          </span>
        </div>
        <h2 className="font-sans font-black text-base md:text-lg uppercase tracking-tight text-[#2a2a2a] leading-tight break-words">
          {anim.name}
        </h2>

        {/* Live preview with static thumbnail */}
        <Link href={anim.route} className="block w-full">
          <AnimationMiniPreview
            componentName={anim.componentName}
            isHovered={isHovered}
            previewImage={anim.preview}
          />
        </Link>
      </div>

      <div className="flex gap-2 min-w-0">
        <Link href={anim.route} className="flex-1 min-w-0">
          <button
            className={`w-full brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-[10px] md:text-xs py-2.5 md:py-3 px-3 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 whitespace-nowrap`}
          >
            View →
          </button>
        </Link>
        <button
          onClick={() => onGetCode(anim)}
          className={`flex-1 min-w-0 brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-[10px] md:text-xs py-2.5 md:py-3 px-3 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 whitespace-nowrap`}
        >
          Get Code
        </button>
      </div>
    </div>
  );
}
