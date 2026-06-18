"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AnimationOnePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState("GRAVITY DROP");
  const [triggerKey, setTriggerKey] = useState(0);

  useGSAP(() => {
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
      }
    );
  }, { scope: containerRef, dependencies: [triggerKey] });

  const handleReplay = () => {
    setTriggerKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-4 selection:bg-wtf-yellow selection:text-black" ref={containerRef}>
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />
      
      <div className="z-10 w-full max-w-2xl brutalist-card p-8 bg-white flex flex-col gap-8 text-center relative overflow-hidden">
        {/* Header tag */}
        <div className="inline-flex self-center items-center gap-2 bg-wtf-orange border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Gravity Drop Sandbox</span>
        </div>
        
        {/* Shelf container where text lands */}
        <div className="relative min-h-[160px] flex items-center justify-center border-b-4 border-[#2a2a2a] pb-4 bg-zinc-50 rounded-lg shadow-inner">
          <div className="absolute top-2 left-2 font-mono text-[9px] text-zinc-400">SHELF COLLIDER</div>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight flex flex-wrap justify-center gap-x-2">
            {textInput.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="falling-letter inline-block transform origin-bottom font-black text-wtf-orange will-change-transform"
                    style={{ textShadow: "2px 2px 0px #2a2a2a" }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* User Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            maxLength={20}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value.toUpperCase())}
            placeholder="TYPE TEXT HERE"
            className="w-full md:w-64 border-3 border-[#2a2a2a] px-4 py-2.5 font-mono font-bold rounded-lg focus:outline-none focus:bg-yellow-50 placeholder-zinc-400 shadow-[3px_3px_0px_#2a2a2a]"
          />
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleReplay}
              className="flex-1 md:flex-none brutalist-btn bg-wtf-orange text-white font-mono font-bold text-sm py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
            >
              ☄️ Trigger Drop
            </button>
            <div className="flex-1 md:flex-none">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
          className="w-full brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}
