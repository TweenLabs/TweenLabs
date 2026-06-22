"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const tabs = [
  {
    label: "Design",
    color: "#e55b3c",
    content: {
      headline: "Pixel-Perfect Design Systems",
      body: "We build cohesive design languages that scale across products. Every component is crafted with intention — from micro-interactions to full-page transitions.",
      tags: ["Figma", "Design Tokens", "Component Library", "Responsive"],
    },
  },
  {
    label: "Develop",
    color: "#0c9367",
    content: {
      headline: "Modern Engineering Stack",
      body: "React 19, Next.js 16, and GSAP power our frontend. We write clean, performant code that ships fast and scales effortlessly.",
      tags: ["React 19", "Next.js 16", "TypeScript", "GSAP"],
    },
  },
  {
    label: "Animate",
    color: "#6758a5",
    content: {
      headline: "Motion That Tells Stories",
      body: "Every animation serves a purpose. ScrollTrigger choreography, physics-based springs, and SplitText reveals — motion is our signature.",
      tags: ["ScrollTrigger", "SplitText", "Flip", "MorphSVG"],
    },
  },
  {
    label: "Deploy",
    color: "#3b82f6",
    content: {
      headline: "Ship With Confidence",
      body: "Automated CI/CD pipelines, edge deployments, and performance monitoring. Your product goes live fast and stays fast.",
      tags: ["Vercel", "Edge Runtime", "CI/CD", "Monitoring"],
    },
  },
];

export default function TabsMotionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;

    const direction = index > activeIndex ? 1 : -1;
    const tabButtons =
      containerRef.current?.querySelectorAll<HTMLElement>(".tab-btn");
    const target = tabButtons?.[index];

    if (target && pillRef.current) {
      gsap.to(pillRef.current, {
        x: target.offsetLeft,
        width: target.offsetWidth,
        backgroundColor: tabs[index].color,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    // Content crossfade
    if (contentRef.current) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0,
        x: -30 * direction,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setActiveIndex(index),
      });
      tl.fromTo(
        contentRef.current,
        { opacity: 0, x: 30 * direction },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
      );
    }
  };

  useGSAP(
    () => {
      const tabButtons =
        containerRef.current?.querySelectorAll<HTMLElement>(".tab-btn");
      const firstTab = tabButtons?.[0];
      if (firstTab && pillRef.current) {
        gsap.set(pillRef.current, {
          x: firstTab.offsetLeft,
          width: firstTab.offsetWidth,
          backgroundColor: tabs[0].color,
        });
      }

      // Stagger in content on mount
      gsap.from(".tab-content-inner > *", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { scope: containerRef },
  );

  const active = tabs[activeIndex];

  return (
    <div
      className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#0c9367] selection:text-white min-h-screen flex flex-col items-center justify-center p-6"
      ref={containerRef}
    >
      {/* Background Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header Metadata */}
        <div className="text-center">
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 block">
            Component 20 · Tabs Motion
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none mb-4">
            Tabs Motion
          </h1>
          <p className="max-w-md mx-auto text-xs md:text-sm font-sans font-medium text-zinc-550 leading-relaxed">
            Animated tab navigation with a sliding indicator pill and
            directional content crossfade transitions.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="relative bg-white border-3 border-[#2a2a2a] rounded-xl p-1.5 flex gap-1 shadow-[4px_4px_0px_#2a2a2a] mb-2">
          <div
            ref={pillRef}
            className="absolute top-1.5 left-0 h-[calc(100%-12px)] rounded-lg z-0 transition-none"
          />

          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              className="tab-btn relative z-10 flex-1 font-mono text-xs font-black uppercase tracking-wider py-3 rounded-lg transition-colors duration-200 cursor-pointer"
              style={{
                color: activeIndex === i ? "#fff" : "#2a2a2a",
              }}
              onClick={() => handleTabClick(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div
          ref={contentRef}
          className="bg-white border-3 border-[#2a2a2a] rounded-xl p-8 shadow-[4px_4px_0px_#2a2a2a] overflow-hidden"
        >
          <div className="tab-content-inner">
            <span
              className="inline-block font-mono text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border mb-4"
              style={{
                color: active.color,
                borderColor: `${active.color}50`,
                backgroundColor: `${active.color}12`,
              }}
            >
              {active.label}
            </span>

            <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-[#1c1714] leading-tight tracking-tight mb-4">
              {active.content.headline}
            </h2>

            <p className="font-sans text-sm text-stone-600 leading-relaxed mb-6">
              {active.content.body}
            </p>

            <div className="flex flex-wrap gap-2">
              {active.content.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border-2 border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] bg-zinc-50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
