"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import AnimationCard from "@/components/AnimationCard";
import type { AnimationItem } from "@/data/components";

interface AnimationGridProps {
  animations: AnimationItem[];
}

export default function AnimationGrid({ animations }: AnimationGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setHasMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initialCount = isMobile ? 3 : 6;
  const visibleAnimations = animations.slice(0, initialCount);
  const totalCount = animations.length;

  // Animate initial cards on mount
  useEffect(() => {
    if (!hasMounted || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".anim-card-item");
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "all",
      },
    );
  }, [hasMounted]);

  // Animate the CTA section entrance
  useEffect(() => {
    if (!hasMounted || !ctaRef.current) return;
    gsap.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power2.out" },
    );
  }, [hasMounted]);

  if (!hasMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {animations.slice(0, 6).map((anim) => (
          <div key={anim.id} className="anim-card-item h-full">
            <AnimationCard anim={anim} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Card Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {visibleAnimations.map((anim) => (
          <div key={anim.id} className="anim-card-item h-full">
            <AnimationCard anim={anim} />
          </div>
        ))}
      </div>

      {/* ── Explore All CTA ── */}
      <div
        ref={ctaRef}
        className="mt-16 w-full flex flex-col items-center select-none"
        style={{ opacity: 0 }}
      >
        {/* Progress indicator */}
        <div className="flex items-center gap-3 w-full max-w-[220px] mb-5">
          <div className="flex-1 h-1.5 bg-[#2a2a2a]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2a2a2a] rounded-full transition-all duration-500"
              style={{ width: `${(initialCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[11px] font-bold text-[#2a2a2a]/55 tabular-nums">
            {initialCount}/{totalCount}
          </span>
        </div>

        {/* Navigate to /components page */}
        <Link
          href="/components"
          className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 flex items-center gap-2"
        >
          <span>Explore All</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 14 14"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7 L11 7 M8 3.5 L11 7 L8 10.5" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
