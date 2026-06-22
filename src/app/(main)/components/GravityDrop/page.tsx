"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function AnimationOnePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerKey, setTriggerKey] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const text = "GRAVITY DROP";

  // IntersectionObserver: only trigger animation when component enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!hasEntered) return;
      // Animate the letters falling down
      gsap.fromTo(
        ".falling-letter",
        {
          y: -400,
          rotation: () => gsap.utils.random(-90, 90),
          opacity: 0,
          scale: 2,
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: {
            each: 0.08,
            from: "random",
          },
          ease: "bounce.out",
        },
      );
    },
    { scope: containerRef, dependencies: [triggerKey, hasEntered] },
  );

  const handleReplay = () => {
    setTriggerKey((prev) => prev + 1);
  };

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-4 selection:bg-[#f1b333] selection:text-black overflow-hidden"
      ref={containerRef}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        onClick={handleReplay}
        className="relative min-h-[160px] flex items-center justify-center pb-4 cursor-pointer select-none z-10"
      >
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-black tracking-tight flex flex-wrap justify-center gap-x-[0.35em]">
          {text.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="falling-letter inline-block transform origin-bottom font-black text-[#e55b3c] will-change-transform"
                  style={{ textShadow: "3px 3px 0px #2a2a2a" }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
