"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function KineticTypographyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState("KINETIC TYPE");
  const [mode, setMode] = useState<"wave" | "scramble" | "magnetic" | "liquid">(
    "wave",
  );
  const [speed, setSpeed] = useState(1); // multiplier
  const [triggerKey, setTriggerKey] = useState(0);

  // Animations run based on input state and mode changes
  useGSAP(
    () => {
      // 1. Reset all characters to clean state before starting a new animation
      gsap.set(".kinetic-char", { clearProps: "all" });

      if (mode === "wave") {
        // Staggered sine wave bounce + rotation
        gsap.fromTo(
          ".kinetic-char",
          {
            y: 20,
            rotate: -8,
            scale: 0.9,
          },
          {
            y: -20,
            rotate: 8,
            scale: 1.1,
            duration: 0.6 / speed,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
              each: 0.08,
              from: "start",
            },
          },
        );
      } else if (mode === "scramble") {
        // Glitchy letter decoder effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*_+=?";
        const textArray = textInput.split("");

        textArray.forEach((originalChar, index) => {
          if (originalChar === " ") return;
          const el = containerRef.current?.querySelector(`.char-${index}`);
          if (!el) return;

          let scrambleCount = 0;
          const maxScrambles = 8 + Math.floor(Math.random() * 8) + index;
          const intervalTime = 40 / speed;

          const interval = setInterval(() => {
            if (scrambleCount >= maxScrambles) {
              el.textContent = originalChar;
              clearInterval(interval);
            } else {
              el.textContent = chars[Math.floor(Math.random() * chars.length)];
              scrambleCount++;
            }
          }, intervalTime);
        });
      } else if (mode === "liquid") {
        // SVG Turbulence Distortion Loop
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        tl.to("#displacement", {
          attr: { scale: 45 },
          duration: 1.8 / speed,
          ease: "power1.inOut",
        }).to(
          "#turbulence",
          {
            attr: { baseFrequency: "0.03 0.09" },
            duration: 1.8 / speed,
            ease: "power1.inOut",
          },
          "<",
        );
      }
    },
    { scope: containerRef, dependencies: [textInput, mode, speed, triggerKey] },
  );

  // Mode 3: Magnetic hover behavior runs on mousemove over the container
  useGSAP(
    (context, contextSafe) => {
      if (mode !== "magnetic" || !contextSafe) return;

      const chars = textContainerRef.current?.querySelectorAll(".kinetic-char");
      if (!chars || chars.length === 0) return;

      const onMouseMove = contextSafe((e: MouseEvent) => {
        const rect = textContainerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        chars.forEach((char) => {
          const charEl = char as HTMLElement;
          const charRect = charEl.getBoundingClientRect();
          const charX = charRect.left + charRect.width / 2 - rect.left;
          const charY = charRect.top + charRect.height / 2 - rect.top;

          const deltaX = mouseX - charX;
          const deltaY = mouseY - charY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          const maxDistance = 140;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance; // 0 to 1

            // Push letters away from mouse with a slight tilt rotation
            const moveX = -(deltaX / distance) * force * 30;
            const moveY = -(deltaY / distance) * force * 30;
            const angle = -(deltaX / distance) * force * 25;

            gsap.to(charEl, {
              x: moveX,
              y: moveY,
              rotate: angle,
              scale: 1 + force * 0.25,
              color: "#6758a5", // Turn purple when close to mouse
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            // Reset
            gsap.to(charEl, {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              color: "#2a2a2a",
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });

      const onMouseLeave = contextSafe(() => {
        chars.forEach((char) => {
          gsap.to(char, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            color: "#2a2a2a",
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });

      const container = textContainerRef.current;
      container?.addEventListener("mousemove", onMouseMove);
      container?.addEventListener("mouseleave", onMouseLeave);

      return () => {
        container?.removeEventListener("mousemove", onMouseMove);
        container?.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: containerRef, dependencies: [mode, textInput] },
  );

  const triggerReplay = () => {
    setTriggerKey((prev) => prev + 1);
  };

  const loadPreset = (phrase: string) => {
    setTextInput(phrase.toUpperCase());
    triggerReplay();
  };

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-4 selection:bg-wtf-yellow selection:text-black"
      ref={containerRef}
    >
      {/* SVG Liquid Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence
              id="turbulence"
              type="fractalNoise"
              baseFrequency="0.01 0.04"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              id="displacement"
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <div className="z-10 w-full max-w-4xl brutalist-card p-6 md:p-8 bg-white flex flex-col gap-8 text-center relative overflow-hidden">
        {/* Badge header */}
        <div className="inline-flex self-center items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-left">
          <span>06 • Kinetic Typography</span>
        </div>

        {/* Display Panel */}
        <div
          ref={textContainerRef}
          className="relative min-h-[260px] flex items-center justify-center border-3 border-[#2a2a2a] bg-zinc-50 rounded-xl shadow-inner overflow-hidden p-6 cursor-crosshair select-none"
        >
          <div className="absolute top-3 left-3 font-mono text-[9px] text-zinc-400 tracking-wider">
            {mode.toUpperCase()} WORKSPACE
          </div>

          <h1
            className="text-4xl md:text-7xl font-serif font-black tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-1 w-full text-center"
            style={{
              filter: mode === "liquid" ? "url(#liquid-filter)" : "none",
            }}
          >
            {textInput.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, charIdx) => {
                  // Global flat index for class reference
                  const flatIndex =
                    textInput.split(" ").slice(0, wordIdx).join("").length +
                    charIdx;
                  return (
                    <span
                      key={charIdx}
                      className={`kinetic-char char-${flatIndex} inline-block transform origin-center font-black text-[#2a2a2a] will-change-transform`}
                      style={{ textShadow: "3px 3px 0px #f1b333" }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
        </div>

        {/* Control Center */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t-3 border-dashed border-zinc-200 pt-6">
          {/* Section 1: Inputs & Presets */}
          <div className="flex flex-col gap-3">
            <label className="font-mono text-xs font-bold text-zinc-500 uppercase">
              1. Custom Text Input
            </label>
            <input
              type="text"
              maxLength={22}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.toUpperCase())}
              placeholder="ENTER SENTENCE"
              className="w-full border-3 border-[#2a2a2a] px-3 py-2 font-mono font-bold rounded-lg focus:outline-none focus:bg-yellow-50 placeholder-zinc-400 shadow-[3px_3px_0px_#2a2a2a]"
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {["AWWWARDS", "KINETIC", "BRUTALISM", "GSAP"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => loadPreset(preset)}
                  className="font-mono text-[9px] font-bold border border-[#2a2a2a] px-2 py-0.5 rounded bg-zinc-100 hover:bg-wtf-yellow transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Mode Selector */}
          <div className="flex flex-col gap-2.5">
            <label className="font-mono text-xs font-bold text-zinc-500 uppercase">
              2. Animation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "wave", label: "Wave Cascade" },
                  { id: "scramble", label: "Cyber Scramble" },
                  { id: "magnetic", label: "Magnetic Push" },
                  { id: "liquid", label: "Liquid Warp" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`font-mono text-[11px] font-bold py-2 px-2.5 border-2 border-[#2a2a2a] rounded-lg transition-all shadow-[2px_2px_0px_#2a2a2a] cursor-pointer ${
                    mode === m.id
                      ? "bg-wtf-purple text-white shadow-none translate-x-[2px] translate-y-[2px]"
                      : "bg-white text-[#2a2a2a] hover:bg-zinc-100"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Fine Tuning & Actions */}
          <div className="flex flex-col gap-3 justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-xs font-bold text-zinc-500 uppercase">
                  3. Speed Multiplier
                </label>
                <span className="font-mono text-xs font-bold bg-zinc-100 border border-zinc-350 px-1.5 rounded">
                  {speed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-wtf-purple cursor-ew-resize"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={triggerReplay}
                className="flex-1 brutalist-btn bg-wtf-purple text-white font-mono font-bold text-xs py-2 px-4 rounded-lg uppercase cursor-pointer"
              >
                ⚡ Re-Trigger
              </button>

              <div className="flex-1">
                <button
                  onClick={() =>
                    window.history.length > 1
                      ? window.history.back()
                      : (window.location.href = "/")
                  }
                  className="w-full brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-2 px-4 rounded-lg uppercase cursor-pointer"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
