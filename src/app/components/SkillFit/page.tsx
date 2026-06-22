"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const candidates = [
  {
    id: 0,
    name: "Studio Shodwe",
    role: "New Collection · SS25",
    img: "https://tweenlabs.xyz/showcase-3.webp",
    color: "#0c9367",
    left: {
      tag: "New Collection",
      headline: "The Gray\nShirt Edit.",
      stats: [
        { label: "Material", value: "Premium Cotton Twill" },
        { label: "Silhouette", value: "Relaxed Oversized" },
        { label: "Season", value: "Spring / Summer 2025" },
      ],
    },
    right: {
      companies: ["Studio Shodwe", "SS25"],
      quote:
        "Minimal layers, maximum presence. The gray shirt is never just a shirt.",
      skills: [
        "Outerwear",
        "Layering",
        "Neutral Tones",
        "Unisex Fit",
        "Soft Drape",
      ],
    },
  },
  {
    id: 1,
    name: "Arjun K.",
    role: "Editorial Portrait · Menswear",
    img: "https://tweenlabs.xyz/showcase-1.webp",
    color: "#f1b333",
    left: {
      tag: "Editorial",
      headline: "Effortless\nConfidence.",
      stats: [
        { label: "Look", value: "White Open Shirt" },
        { label: "Accessories", value: "Bead Bracelet · Ring" },
        { label: "Mood", value: "Raw · Candid · Bold" },
      ],
    },
    right: {
      companies: ["Menswear", "Portrait"],
      quote:
        "The white shirt — unbuttoned, unfiltered. Style that doesn't try.",
      skills: [
        "Editorial",
        "Portraiture",
        "Street Style",
        "Minimalism",
        "Raw Aesthetic",
      ],
    },
  },
  {
    id: 2,
    name: "Studio Shodwe",
    role: "New Arrival · FW25",
    img: "https://tweenlabs.xyz/showcase-2.webp",
    color: "#3b82f6",
    left: {
      tag: "New Arrival",
      headline: "The Navy\nSilhouette.",
      stats: [
        { label: "Colour", value: "Deep Navy" },
        { label: "Drape", value: "Fluid Midi Length" },
        { label: "Season", value: "Fall / Winter 2025" },
      ],
    },
    right: {
      companies: ["Studio Shodwe", "FW25"],
      quote: "One colour. One silhouette. Everything you need for the season.",
      skills: [
        "Womenswear",
        "Minimal Drape",
        "Navy Palette",
        "Gold Detail",
        "Statement Cut",
      ],
    },
  },
  {
    id: 3,
    name: "@reallygreatsite",
    role: "Beauty & Wellness Creator",
    img: "https://tweenlabs.xyz/showcase-5.webp",
    color: "#c53b3a",
    left: {
      tag: "Beauty Creator",
      headline: "Soul Over\nBeauty.",
      stats: [
        { label: "Niche", value: "Makeup · Skincare · Wellness" },
        { label: "Aesthetic", value: "Dark Glam · Editorial" },
        { label: "Signature", value: "You're not just a makeover" },
      ],
    },
    right: {
      companies: ["Instagram", "Brand Collabs"],
      quote: "You're not just getting a makeover — you're leveling up.",
      skills: [
        "Editorial Makeup",
        "Skincare",
        "Content Creation",
        "Brand Deals",
        "Reels",
      ],
    },
  },
];

const N = candidates.length;
const SCROLL_PER_SEGMENT = 400; // Tight segments — feels effortless
const TOTAL_SCROLL = N * SCROLL_PER_SEGMENT + 200;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ScreenSkillFitPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── All cards + panels start HIDDEN (below screen) ──────────────────
      candidates.forEach((_, i) => {
        gsap.set(`.sc-card-${i}`, {
          y: "115%",
          scale: 0.88,
          opacity: 0,
          rotation: i % 2 === 0 ? 3 : -3,
        });
        gsap.set(`.sc-left-${i}`, { x: -100, opacity: 0 });
        gsap.set(`.sc-right-${i}`, { x: 100, opacity: 0 });
      });

      const scroller =
        containerRef.current?.closest("#main-scroller") || undefined;

      // ── Master Timeline — scrubbed by scroll ─────────────────────────────
      // Triggers when pinRef reaches top of viewport (after scrolling past intro)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          scroller: scroller,
          pin: true,
          anticipatePin: 1,
          scrub: 0.5,
          start: "top top",
          end: `+=${TOTAL_SCROLL}`,
          invalidateOnRefresh: true,
        },
      });

      // Timeline units: each segment = 1 unit
      // Segment layout per card:
      //   [0.0 – 0.5]  card slides IN  + panels slide IN
      //   [0.5 – 0.9]  hold (card visible, nothing moves)
      //   [0.9 – 1.4]  card slides OUT + panels slide OUT  (overlaps with next card's in)

      const SEG = 1;
      const IN_DUR = SEG * 0.45;
      const HOLD_END = SEG * 0.9;
      const OUT_DUR = SEG * 0.5;

      candidates.forEach((_, i) => {
        const base = i * SEG;
        const rotIn = 0;
        const rotOut = i % 2 === 0 ? -5 : 5;

        // — CARD IN — (unchanged)
        tl.to(
          `.sc-card-${i}`,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: rotIn,
            duration: IN_DUR,
            ease: "power3.out",
          },
          base,
        );

        // — PANELS IN — appear after card is already visible (not simultaneous)
        tl.to(
          `.sc-left-${i}`,
          { x: 0, opacity: 1, duration: IN_DUR * 0.9, ease: "power2.out" },
          base + 0.22, // ← was 0.06 — now panels enter after card is settled
        );
        tl.to(
          `.sc-right-${i}`,
          { x: 0, opacity: 1, duration: IN_DUR * 0.9, ease: "power2.out" },
          base + 0.24, // ← slight stagger right after left
        );

        if (i < N - 1) {
          // — CARD OUT — (unchanged)
          tl.to(
            `.sc-card-${i}`,
            {
              y: "-115%",
              scale: 0.9,
              opacity: 0,
              rotation: rotOut,
              duration: OUT_DUR,
              ease: "power3.inOut",
            },
            base + HOLD_END,
          );

          // — PANELS OUT — exit fast BEFORE card starts moving
          tl.to(
            `.sc-left-${i}`,
            { x: -80, opacity: 0, duration: 0.18, ease: "power3.in" },
            base + HOLD_END - 0.12, // ← exits just before card starts moving
          );
          tl.to(
            `.sc-right-${i}`,
            { x: 80, opacity: 0, duration: 0.18, ease: "power3.in" },
            base + HOLD_END - 0.1, // ← slight stagger
          );
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="bg-[#f5f0e8] text-[#1c1714]">
      {/* ══ SECTION 2: Pinned animation screen ══════════════════════════════ */}
      <div ref={pinRef} className="h-screen w-full relative">
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='2' height='2' fill='%23000'/%3E%3Crect x='2' y='2' width='2' height='2' fill='%23000'/%3E%3C/svg%3E")`,
            backgroundSize: "4px 4px",
          }}
        />

        {/* ── Three-column layout ─────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center px-8 md:px-14 gap-8 xl:gap-14">
          {/* LEFT PANELS */}
          <div className="flex-1 h-full relative hidden md:flex items-center">
            <div
              className="relative w-full"
              style={{ height: "min(480px, 60vh)" }}
            >
              {candidates.map((c, i) => (
                <div
                  key={c.id}
                  className={`sc-left-${i} absolute inset-0 flex flex-col justify-center gap-5`}
                >
                  {/* Accent tag */}
                  <span
                    className="self-start font-mono text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border"
                    style={{
                      color: c.color,
                      borderColor: `${c.color}50`,
                      backgroundColor: `${c.color}12`,
                    }}
                  >
                    {c.left.tag}
                  </span>

                  {/* Headline */}
                  <h2
                    className="font-serif font-black text-[clamp(1.9rem,2.8vw,3.2rem)] text-[#1c1714] leading-[1.06] tracking-tight uppercase"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {c.left.headline}
                  </h2>

                  {/* Stats */}
                  <div className="flex flex-col gap-3.5 mt-1">
                    {c.left.stats.map((s) => (
                      <div key={s.label}>
                        <span className="font-mono text-[8px] uppercase tracking-widest text-stone-400 font-bold block mb-0.5">
                          {s.label}
                        </span>
                        <span className="font-sans font-bold text-[13px] text-stone-700 block">
                          {s.value}
                        </span>
                        <div className="h-px bg-stone-300 w-full mt-2" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — card stack */}
          <div
            className="shrink-0 relative"
            style={{ width: "clamp(220px, 22vw, 310px)", aspectRatio: "3/4.3" }}
          >
            {candidates.map((c, i) => (
              <div
                key={c.id}
                className={`sc-card-${i} absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.75)]`}
                style={{ zIndex: N - i }}
              >
                {/* Photo */}
                <div className="absolute inset-0">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Bottom gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, #0d0d10 0%, rgba(13,13,16,0.6) 38%, transparent 62%)",
                    }}
                  />
                </div>

                {/* Card footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div
                    className="h-[2px] w-8 rounded-full mb-3"
                    style={{ backgroundColor: c.color }}
                  />
                  <h3 className="font-serif font-black text-[1.15rem] text-white leading-none tracking-tight mb-1">
                    {c.name}
                  </h3>
                  <p
                    className="font-mono text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: c.color }}
                  >
                    {c.role}
                  </p>
                </div>

                {/* Index */}
                <div className="absolute top-4 right-4 z-10 font-mono text-[8px] font-bold text-white/35">
                  [{String(i + 1).padStart(2, "0")} /{" "}
                  {String(N).padStart(2, "0")}]
                </div>
              </div>
            ))}

            {/* Progress dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {candidates.map((c, i) => (
                <div
                  key={c.id}
                  className={`sc-dot-${i} h-[3px] rounded-full transition-all duration-500`}
                  style={{
                    width: i === 0 ? "18px" : "6px",
                    backgroundColor: i === 0 ? c.color : "#d4cfc8",
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT PANELS */}
          <div className="flex-1 h-full relative hidden md:flex items-center">
            <div
              className="relative w-full"
              style={{ height: "min(480px, 60vh)" }}
            >
              {candidates.map((c, i) => (
                <div
                  key={c.id}
                  className={`sc-right-${i} absolute inset-0 flex flex-col justify-center gap-5`}
                >
                  {/* Companies */}
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                      Worked at
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {c.right.companies.map((co) => (
                        <span
                          key={co}
                          className="font-mono text-[9px] font-bold border border-stone-300 bg-stone-100 text-stone-700 px-3 py-1 rounded-full"
                        >
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote
                    className="font-serif font-bold text-[clamp(1.05rem,1.9vw,1.5rem)] text-[#1c1714] leading-snug tracking-tight pl-4"
                    style={{ borderLeft: `3px solid ${c.color}` }}
                  >
                    &ldquo;{c.right.quote}&rdquo;
                  </blockquote>

                  {/* Skills */}
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                      Core Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {c.right.skills.map((sk) => (
                        <span
                          key={sk}
                          className="font-mono text-[8px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border border-stone-200 text-stone-500 bg-white/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className="self-start font-mono text-[9px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full"
                    style={{
                      backgroundColor: c.color,
                      color: c.id === 1 ? "#111" : "#fff",
                    }}
                  >
                    View Profile →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-center: thin scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-200">
          <div
            className="h-full bg-stone-500"
            style={{ width: "0%", transition: "width 0.3s ease" }}
          />
        </div>
      </div>
    </div>
  );
}
