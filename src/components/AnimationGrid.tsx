"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import AnimationCard from "@/components/AnimationCard";
import type { AnimationItem } from "@/data/animations";

interface AnimationGridProps {
  animations: AnimationItem[];
}

export default function AnimationGrid({ animations }: AnimationGridProps) {
  const [showAll, setShowAll] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("grid-show-all") === "true";
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setHasMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initialCount = isMobile ? 3 : 6;

  // Persist showAll state across navigations
  useEffect(() => {
    sessionStorage.setItem("grid-show-all", showAll.toString());
  }, [showAll]);

  const totalCount = animations.length;
  const visibleCount = showAll ? totalCount : initialCount;
  const progressPercent = (visibleCount / totalCount) * 100;

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
      }
    );
  }, [hasMounted]);

  // Animate the CTA section entrance
  useEffect(() => {
    if (!hasMounted || !ctaRef.current) return;
    gsap.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power2.out" }
    );
  }, [hasMounted]);

  // Smoothly animate the progress bar width via GSAP
  useEffect(() => {
    if (!hasMounted || !progressBarRef.current) return;
    gsap.to(progressBarRef.current, {
      width: `${progressPercent}%`,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [visibleCount, progressPercent, hasMounted]);

  const handleToggle = useCallback(() => {
    if (isAnimating.current) return;

    if (!showAll) {
      isAnimating.current = true;
      setShowAll(true);
    } else {
      if (!gridRef.current) return;
      isAnimating.current = true;

      const allCards = gridRef.current.querySelectorAll(".anim-card-item");
      const extraCards = Array.from(allCards).slice(initialCount);

      // Smoothly collapse cards
      gsap.to(Array.from(extraCards).reverse(), {
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        stagger: 0.03,
        ease: "power2.in",
        onComplete: () => {
          setShowAll(false);
          isAnimating.current = false;

          // Scroll back to the top of the grid smoothly
          if (containerRef.current) {
            const top =
              containerRef.current.getBoundingClientRect().top +
              window.scrollY -
              100;
            window.scrollTo({ top, behavior: "smooth" });
          }
        },
      });
    }
  }, [showAll, initialCount]);

  // Animate newly revealed cards on expand
  useEffect(() => {
    if (!showAll || !gridRef.current) return;

    const allCards = gridRef.current.querySelectorAll(".anim-card-item");
    const newCards = Array.from(allCards).slice(initialCount);
    if (newCards.length === 0) return;

    gsap.fromTo(
      newCards,
      { y: 50, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "all",
        onComplete: () => {
          isAnimating.current = false;
        },
      }
    );
  }, [showAll, initialCount]);

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

  const visibleAnimations = showAll
    ? animations
    : animations.slice(0, initialCount);

  return (
    <div ref={containerRef} className="w-full">
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

      {/* ── Simplified CTA Area ── */}
      <div
        ref={ctaRef}
        className="mt-16 w-full flex flex-col items-center select-none"
        style={{ opacity: 0 }}
      >
        {/* Simple Progress Bar */}
        <div className="flex items-center gap-3 w-full max-w-[220px] mb-5">
          <div className="flex-1 h-1.5 bg-[#2a2a2a]/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#2a2a2a] rounded-full"
              style={{
                width: `${(initialCount / totalCount) * 100}%`,
              }}
            />
          </div>
          <span className="font-mono text-[11px] font-bold text-[#2a2a2a]/55 tabular-nums">
            {visibleCount}/{totalCount}
          </span>
        </div>

        {/* Toggle Button - styled exactly like the card view/code buttons */}
        <button
          onClick={handleToggle}
          className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 flex items-center gap-2"
        >
          <span>{showAll ? "Show Less" : "Explore All"}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-500 ease-out ${
              showAll ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 14 14"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 3 L7 11 M3.5 8 L7 11 L10.5 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
