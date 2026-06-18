"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AnimationThreePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = containerRef.current?.closest("#main-scroller") || undefined;
      const chars = gsap.utils.toArray<HTMLElement>(".reveal-char");

      // 1. Create the main horizontal translation tween
      const horizontalTween = gsap.to(textTrackRef.current, {
        x: () => {
          const track = textTrackRef.current;
          return track ? -(track.scrollWidth - window.innerWidth) : 0;
        },
        ease: "none",
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          scroller: scroller,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=3000", // Fixed scroll height to guarantee user can always scroll fully
          invalidateOnRefresh: true,
        },
      });

      // 2. Animate characters relative to their position in the viewport
      chars.forEach((char) => {
        // Unified entry/exit behavior for all letters: enter from top, exit to bottom
        const startY = -window.innerHeight * 0.9; // Starts above screen
        const startRot = -35; // Standardized tilt

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: char,
            containerAnimation: horizontalTween, // Link to the horizontal scroll timeline
            scroller: scroller,
            start: "left right", // Starts exactly when left edge of character enters right side of viewport (keyword syntax)
            end: "right left", // Ends exactly when right edge of character leaves left side of viewport (keyword syntax)
            scrub: true,
          },
        });

        tl.fromTo(
          char,
          {
            y: startY,
            rotation: startRot,
            opacity: 0,
            scale: 0.6,
          },
          {
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 0.35, // Slower entry
            ease: "power3.out",
          },
        )
          // Add subtle kinetic wave motion while scrolling through the DOM
          .to(char, {
            y: -15,
            rotation: 4,
            scale: 1.03,
            duration: 0.15,
            ease: "sine.inOut",
          })
          .to(char, {
            y: 15,
            rotation: -4,
            scale: 0.97,
            duration: 0.15,
            ease: "sine.inOut",
          })
          .to(char, {
            // Exit to the bottom
            y: -startY, // Positive y value (exits to bottom)
            rotation: -startRot, // Positive 35 degrees
            opacity: 0,
            scale: 0.6,
            duration: 0.35, // Slower exit
            ease: "power3.in",
          });
      });

      // Recalculate ScrollTrigger parameters once fonts load
      const handleLoad = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("load", handleLoad);

      // Modern fonts ready API to dynamically refresh triggers when custom fonts swap in
      if (document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1500);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timer);
        // Let the useGSAP hook handle ScrollTrigger cleanup automatically to avoid React unmount crashes
      };
    },
    { scope: containerRef },
  );

  // Global index tracker for continuous alternation
  let globalCharIndex = 0;

  const renderWord = (word: string, isOrange = false) => {
    return (
      <span className="inline-block whitespace-nowrap">
        {word.split("").map((char) => {
          const idx = globalCharIndex++;
          return (
            <span
              key={idx}
              className="reveal-char inline-block transform origin-center will-change-transform font-serif font-black uppercase text-[8vw] md:text-[10vw] text-white"
              style={{
                textShadow: "4px 4px 0px #121212",
                color: isOrange ? "var(--color-wtf-orange)" : "white",
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div
      className="relative min-h-screen bg-[#1e1e1e] text-white overflow-x-hidden selection:bg-wtf-yellow selection:text-black"
      ref={containerRef}
    >
      {/* Subtle Dot Grid Background Overlay */}
      <div
        className="absolute inset-0 dot-grid pointer-events-none z-10"
        style={{ opacity: 0.05 }}
      />

      {/* Dashboard Back Link */}
      <div className="fixed left-6 top-6 z-50">
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="brutalist-btn bg-wtf-yellow text-black px-4 py-2 text-xs font-mono font-bold uppercase rounded-md cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-xs uppercase tracking-widest text-white/50 animate-bounce pointer-events-none flex flex-col items-center gap-1">
        <span>Scroll to Explore</span>
        <span className="text-wtf-orange font-bold text-sm">↓</span>
      </div>

      {/* Main assembly wrapper */}
      <div
        ref={scrollSectionRef}
        className="h-[calc(100vh-64px)] w-full flex items-center relative overflow-hidden"
      >
        {/* Horizontal text scroll track */}
        <div
          ref={textTrackRef}
          className="relative flex items-center pl-[100vw] pr-[100vw] whitespace-nowrap h-full select-none z-20 w-max flex-shrink-0"
        >
          <div className="flex gap-[6vw] flex-shrink-0 w-max">
            {renderWord("HELLO")}
            {renderWord("THIS")}
            {renderWord("IS")}
            {renderWord("GSAP", true)}
          </div>
        </div>
      </div>
    </div>
  );
}
