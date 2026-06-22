"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

// ─── DATA ─────────────────────────────────────────────────
const texts = [
  "Creative",
  "Morphing",
  "Dynamic",
  "Seamless",
  "Animated",
  "Powerful",
  "Reactive",
  "Stunning",
  "Elegant",
];

const colors = [
  "#e55b3c", // Orange
  "#6758a5", // Purple
  "#0c9367", // Green
  "#3b82f6", // Blue
  "#c53b3a", // Red
  "#f1b333", // Yellow
  "#0c9367", // Green
  "#e55b3c", // Orange
  "#6758a5", // Purple
];

// ─── HELPERS ──────────────────────────────────────────────
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────
export default function MorphingTextPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const morphingRef = useRef(false);
  const idxRef = useRef(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const nextIdx = (currentIdx + 1) % texts.length;

  // Per-frame morph with single interpolated color
  const startMorph = useCallback(() => {
    if (morphingRef.current) return;
    morphingRef.current = true;

    const fromIdx = idxRef.current;
    const toIdx = (fromIdx + 1) % texts.length;
    const fromColor = colors[fromIdx];
    const toColor = colors[toIdx];

    let fraction = 0;

    const tick = () => {
      fraction += 0.01;
      if (fraction > 1) fraction = 1;

      // Ease in-out quad
      const t =
        fraction < 0.5
          ? 2 * fraction * fraction
          : 1 - Math.pow(-2 * fraction + 2, 2) / 2;

      // Single interpolated color — never two colors at once
      const blendedColor = lerpColor(fromColor, toColor, t);

      if (text1Ref.current && text2Ref.current) {
        // Both layers use the same blended color
        text1Ref.current.style.color = blendedColor;
        text2Ref.current.style.color = blendedColor;

        // Text 1 dissolves out
        text1Ref.current.style.filter = `blur(${t * 8}px)`;
        text1Ref.current.style.opacity = `${Math.pow(1 - t, 0.4)}`;

        // Text 2 dissolves in
        text2Ref.current.style.filter = `blur(${(1 - t) * 8}px)`;
        text2Ref.current.style.opacity = `${Math.pow(t, 0.4)}`;
      }

      if (fraction < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        morphingRef.current = false;
        idxRef.current = toIdx;

        setCurrentIdx(toIdx);

        requestAnimationFrame(() => {
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.style.filter = "blur(0px)";
            text1Ref.current.style.opacity = "1";
            text1Ref.current.style.color = toColor;
            text2Ref.current.style.filter = "blur(8px)";
            text2Ref.current.style.opacity = "0";
          }
        });
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Auto-cycle — first morph fires sooner, then regular interval
  useEffect(() => {
    // Start first morph quickly after entrance animation finishes
    const firstTimer = setTimeout(() => {
      startMorph();
    }, 1400);

    // Then regular interval for subsequent morphs
    const interval = setInterval(startMorph, 3200);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [startMorph]);

  // Entrance
  useGSAP(
    () => {
      gsap.from(".morph-wrap", {
        scale: 0.92,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.15,
      });
      gsap.from(".morph-dots", {
        y: 8,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.6,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-4 md:p-8 selection:bg-[#f1b333] selection:text-black overflow-hidden"
      ref={containerRef}
    >
      {/* Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* SVG Threshold Filter — gooey dissolve */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="text-morph">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="snap"
            />
            <feComposite in="SourceGraphic" in2="snap" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Morphing Text */}
      <div className="morph-wrap relative z-20 flex flex-col items-center gap-8">
        <div
          className="relative flex items-center justify-center"
          style={{ filter: "url(#text-morph)" }}
        >
          <div className="relative h-[56px] md:h-[110px] lg:h-[150px] flex items-center justify-center min-w-[280px] md:min-w-[500px] lg:min-w-[700px]">
            {/* Layer 1 — current word */}
            <span
              ref={text1Ref}
              className="absolute font-serif font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight will-change-transform select-none leading-none"
              style={{ color: colors[currentIdx] }}
              aria-live="polite"
            >
              {texts[currentIdx]}
            </span>

            {/* Layer 2 — next word */}
            <span
              ref={text2Ref}
              className="absolute font-serif font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight will-change-transform select-none leading-none"
              style={{
                color: colors[currentIdx],
                opacity: 0,
                filter: "blur(8px)",
              }}
              aria-hidden="true"
            >
              {texts[nextIdx]}
            </span>
          </div>
        </div>

        {/* Minimal dot indicator */}
        <div className="morph-dots flex items-center gap-2.5">
          {texts.map((_, idx) => (
            <div
              key={idx}
              className="rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: idx === currentIdx ? 24 : 6,
                height: 4,
                backgroundColor:
                  idx === currentIdx
                    ? colors[currentIdx]
                    : "rgba(42,42,42,0.12)",
                borderRadius: 999,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
