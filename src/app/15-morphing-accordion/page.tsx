"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

interface AccordionItem {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  details: string[];
  color: string;
  bgTint: string;
}

export default function MorphingAccordionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const accordionItems: AccordionItem[] = [
    {
      id: 1,
      title: "Creative Design",
      subtitle: "UI & WIREFRAMING",
      summary:
        "Translating brand identities into modern, high-fidelity responsive user interfaces.",
      details: [
        "Figma layouts & design token sync",
        "Neo-Brutalist typography pairings",
        "Vibrant, custom color palettes (HSL)",
        "Asymmetric block grid blueprints",
      ],
      color: "#e55b3c", // wtf-orange
      bgTint: "#fdf6f4",
    },
    {
      id: 2,
      title: "Frontend Architecture",
      subtitle: "NEXT.JS 16 & REACT 19",
      summary:
        "Building robust, hydration-safe code bases using standard modern frameworks.",
      details: [
        "TypeScript static type validation",
        "React Server Components (RSC) integration",
        "Tailwind CSS v4 compile optimizations",
        "Lenis smooth scroll integration",
      ],
      color: "#0c9367", // wtf-green
      bgTint: "#f2fbf7",
    },
    {
      id: 3,
      title: "Motion Choreography",
      subtitle: "GSAP TIMELINES & TWEENS",
      summary:
        "Crafting fluid, natural interactions with premium timing and performance curves.",
      details: [
        "useGSAP clean context safe execution",
        "Staggered entrance reveals & bounces",
        "ScrollTrigger pinning & scroll-scrubs",
        "Custom elastic & bezier ease functions",
      ],
      color: "#6758a5", // wtf-purple
      bgTint: "#f7f6fc",
    },
    {
      id: 4,
      title: "Performance Tuning",
      subtitle: "60 FPS OPTIMIZATION",
      summary:
        "Optimizing code execution to prevent layout thrashing and rendering lag.",
      details: [
        "CSS Transform (x/y/scale) animation prioritisation",
        "will-change and force3D compositor layers",
        "gsap.quickTo for mouse movement triggers",
        "Garbage collection & memory leak cleanup",
      ],
      color: "#3b82f6", // wtf-blue
      bgTint: "#f3f8fe",
    },
  ];

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleToggle = (index: number) => {
    const isExpanding = activeIndex !== index;
    setActiveIndex(isExpanding ? index : null);

    const activeItem = accordionItems[index];

    contextSafe(() => {
      // Morph the page background & main card border color
      gsap.to(containerRef.current, {
        backgroundColor: isExpanding ? activeItem.bgTint : "#f0eadf",
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(cardRef.current, {
        borderColor: isExpanding ? activeItem.color : "#2a2a2a",
        boxShadow: isExpanding
          ? `8px 8px 0px ${activeItem.color}`
          : "6px 6px 0px #2a2a2a",
        duration: 0.5,
        ease: "power2.out",
      });

      // Animate all height transitions
      accordionItems.forEach((_, idx) => {
        const el = contentRefs.current[idx];
        if (!el) return;

        const shouldExpand = isExpanding && idx === index;

        // Calculate details lists animations inside the expanded item
        if (shouldExpand) {
          gsap.to(el, {
            height: "auto",
            opacity: 1,
            marginTop: 16,
            duration: 0.45,
            ease: "power3.inOut",
            overwrite: "auto",
          });

          // Stagger list elements inside the expanding content
          const listItems = el.querySelectorAll(".accordion-detail-item");
          gsap.fromTo(
            listItems,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.4,
              ease: "power2.out",
              delay: 0.1,
              overwrite: "auto",
            },
          );
        } else {
          gsap.to(el, {
            height: 0,
            opacity: 0,
            marginTop: 0,
            duration: 0.35,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        }
      });
    })();
  };

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-between p-8 selection:bg-[#f1b333] selection:text-black overflow-hidden transition-colors duration-500"
      ref={containerRef}
    >
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{ backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      {/* Header Info */}
      <header className="z-10 w-full max-w-2xl text-center flex flex-col gap-4 mt-8">
        <div className="inline-flex self-center items-center gap-2 bg-[#6758a5] border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] rotate-2">
          <span>Component 15</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
          Morphing Accordion
        </h1>
        <p className="max-w-md mx-auto text-zinc-700 text-sm leading-relaxed font-sans font-medium">
          Click any accordion header below. Watch the page background color
          morph, the card borders transform, and content reveal with staggered
          transitions.
        </p>
      </header>

      {/* Accordion Container Card */}
      <main className="z-10 w-full max-w-2xl my-12">
        <div
          ref={cardRef}
          className="w-full border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] p-6 md:p-8 bg-white flex flex-col gap-4 transition-all duration-500"
        >
          {accordionItems.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={item.id}
                className={`border-b-3 border-[#2a2a2a] last:border-b-0 pb-4 last:pb-0 pt-4 first:pt-0 flex flex-col`}
              >
                {/* Header Button */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">
                      [{item.subtitle}]
                    </span>
                    <h2
                      className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight transition-colors duration-200 hover:text-[#e55b3c]"
                      style={{ color: isOpen ? item.color : "" }}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <span className="w-8 h-8 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-mono font-bold text-sm bg-zinc-50 shadow-[2px_2px_0px_#2a2a2a] group-hover:bg-[#2a2a2a] group-hover:text-white transition-colors">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Content Area */}
                <div
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  className="h-0 opacity-0 overflow-hidden flex flex-col gap-4"
                >
                  <p className="text-sm font-sans font-semibold text-zinc-600 leading-relaxed max-w-xl">
                    {item.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {item.details.map((detail, dIdx) => (
                      <div
                        key={dIdx}
                        className="accordion-detail-item flex items-center gap-2.5 font-mono text-xs text-zinc-700 bg-zinc-50 border border-zinc-300 p-2.5 rounded-lg shadow-sm"
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-black"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer link */}
      <footer className="z-10 mb-8">
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] transition-all duration-100 ease-in-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#2a2a2a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2a2a2a] bg-[#f1b333] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
      </footer>
    </div>
  );
}
