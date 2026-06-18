# How to Use: SVG String Line Network

This guide details how to integrate the **SVG String Line Network** with ScrollTrigger-driven path drawing, MotionPath dot tracking, and proximity node activations.

### Core GSAP Animation Code
```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const path = document.querySelector("#network-path");
const dot = document.querySelector(".moving-dot");
const cards = document.querySelectorAll(".im-card");

const pathLength = path.getTotalLength();

// Hide path initially using dasharray properties
gsap.set(path, {
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength,
});

// Map SVG coordinates to find the nearest timeline scroll progress for each card
const cardCenters = Array.from(cards).map((card) => {
  const xPct = parseFloat(card.style.left) / 100;
  const yPct = parseFloat(card.style.top) / 100;
  return { svgX: xPct * 1600, svgY: yPct * 900, card };
});

const SAMPLES = 600;
const pathSamples = [];
for (let i = 0; i <= SAMPLES; i++) {
  const t = (i / SAMPLES) * pathLength;
  const pt = path.getPointAtLength(t);
  pathSamples.push({ t: i / SAMPLES, x: pt.x, y: pt.y });
}

const cardProgressMap = cardCenters.map(({ svgX, svgY, card }) => {
  let closestProgress = 0;
  let closest = Infinity;
  for (const sample of pathSamples) {
    const dist = (sample.x - svgX) ** 2 + (sample.y - svgY) ** 2;
    if (dist < closest) {
      closest = dist;
      closestProgress = sample.t;
    }
  }
  return { card, progress: closestProgress };
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: "+=3000",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      const progress = self.progress;

      // Proximity scaling and color shifting based on dot distance
      cardProgressMap.forEach(({ card, progress: cardProg }, index) => {
        const activationWindow = 0.06;
        const proximity = Math.max(0, 1 - Math.abs(progress - cardProg) / activationWindow);
        const scale = progress >= cardProg ? 1.08 : 0.85 + 0.23 * proximity;
        
        const colorInterpolator = gsap.utils.interpolate("#ffffff", "#FFE5EC");
        const backgroundColor = colorInterpolator(progress >= cardProg ? 1 : proximity);

        gsap.set(card, { scale, backgroundColor });
      });
    },
  },
});

// Draw path SVG strokes on scroll
tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);

// Align dot position along the dynamic path
tl.to(dot, {
  motionPath: {
    path: path,
    align: path,
    alignOrigin: [0.5, 0.5],
  },
  ease: "none",
}, 0);
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

export interface NetworkNodeItem {
  id: number;
  title: string;
  imgUrl: string;
  x: string; // percentage string (e.g. "50%")
  y: string; // percentage string (e.g. "22%")
  accentHex: string; // rgb value string (e.g. "229, 91, 60")
}

interface StringLineNetworkProps {
  nodes: NetworkNodeItem[];
  pathD: string; // SVG path d attribute
}

const defaultColors = [
  "#FFE5EC", "#E0FFFE", "#F3E8FF", "#ECFDF5", "#FFFBEB",
  "#EFF6FF", "#FAF5FF", "#FFF0F5", "#FFE8D6", "#F0DFDF"
];

export default function StringLineNetwork({ nodes, pathD }: StringLineNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  useGSAP(
    () => {
      const path = containerRef.current?.querySelector("#network-path") as SVGPathElement | null;
      const dot = containerRef.current?.querySelector(".moving-dot") as HTMLDivElement | null;
      const cards = containerRef.current?.querySelectorAll(".node-card");

      if (!path || !dot || !cards) return;
      const pathLength = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const cardCenters = Array.from(cards).map((card) => {
        const htmlCard = card as HTMLElement;
        const xPct = parseFloat(htmlCard.style.left) / 100;
        const yPct = parseFloat(htmlCard.style.top) / 100;
        return {
          svgX: xPct * 1600,
          svgY: yPct * 900,
          card: htmlCard,
        };
      });

      const SAMPLES = 600;
      const pathSamples: { t: number; x: number; y: number }[] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const t = (i / SAMPLES) * pathLength;
        const pt = path.getPointAtLength(t);
        pathSamples.push({ t: i / SAMPLES, x: pt.x, y: pt.y });
      }

      const cardProgressMap = cardCenters.map(({ svgX, svgY, card }) => {
        let closestProgress = 0;
        let closest = Infinity;

        for (const sample of pathSamples) {
          const dx = sample.x - svgX;
          const dy = sample.y - svgY;
          const dist = dx * dx + dy * dy;

          if (dist < closest) {
            closest = dist;
            closestProgress = sample.t;
          }
        }
        return { card, progress: closestProgress };
      });

      gsap.set(cards, { scale: 0.85 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setCurrentProgress(Math.round(progress * 100));

            cardProgressMap.forEach(({ card, progress: cardProg }, index) => {
              const activationWindow = 0.06;
              const proximity = Math.max(0, 1 - Math.abs(progress - cardProg) / activationWindow);
              const scale = progress >= cardProg ? 1.08 : 0.85 + 0.23 * proximity;

              const colorInterpolator = gsap.utils.interpolate(
                "#ffffff",
                defaultColors[index % defaultColors.length]
              );
              const backgroundColor = colorInterpolator(progress >= cardProg ? 1 : proximity);

              gsap.set(card, { scale, backgroundColor });
            });
          },
        },
      });

      tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
      tl.to(dot, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
      }, 0);
    },
    { scope: containerRef, dependencies: [nodes, pathD] }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 600,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });
  });

  const handleCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1.1, 0.4)",
      duration: 0.75,
      overwrite: "auto",
    });
  });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-white select-none">
      {/* Console readout overlay */}
      <div className="absolute top-6 right-6 z-30 font-mono text-[10px] font-bold text-zinc-500 text-right">
        [ SYSTEM: TRACKING ] PATH: {currentProgress}%
      </div>

      <svg
        className="absolute inset-0 w-full h-full z-0"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          id="network-path"
          d={pathD}
          stroke="#2a2a2a"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Moving tracking head */}
      <div className="moving-dot absolute top-0 left-0 w-6 h-6 rounded-full bg-[#e55b3c] border-2 border-[#2a2a2a] z-10 shadow-[2px_2px_0px_#2a2a2a]">
        <span className="absolute h-10 w-10 border-2 border-[#e55b3c]/30 rounded-full animate-ping pointer-events-none -left-2 -top-2" />
      </div>

      {/* Interactive node elements */}
      {nodes.map((node) => (
        <div
          key={node.id}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="group node-card absolute flex items-center gap-3 px-4 py-2 rounded-full border-2 border-[#2a2a2a] bg-white shadow-[3px_3px_0px_#2a2a2a] z-20 cursor-pointer"
          style={{
            left: node.x,
            top: node.y,
            transform: "translate(-50% , -50%)",
            transformOrigin: "center center",
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-0"
            style={{
              background: `radial-gradient(100px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(${node.accentHex}, 0.1), transparent 85%)`,
            }}
          />

          <div className="w-10 h-10 rounded-full border-2 border-[#2a2a2a] relative overflow-hidden flex-shrink-0 z-10 bg-zinc-100">
            <img className="object-cover w-full h-full" src={node.imgUrl} alt={node.title} />
          </div>

          <div className="flex flex-col relative z-10" style={{ transform: "translateZ(15px)" }}>
            <h2 className="uppercase text-[11px] font-serif font-black tracking-tight text-[#2a2a2a] leading-none">
              {node.title}
            </h2>
            <span className="font-mono text-[7px] text-zinc-400 font-bold tracking-wider mt-0.5">
              [ X: {node.x} | Y: {node.y} ]
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add string-line
```

---

### 🛠️ Option B: Manual Installation

Follow these beginner-friendly, step-by-step instructions to integrate the component into your project.

### ⚡ Step 1: Install Dependencies
Open your project terminal and install the required GreenSock libraries:
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create a new component file inside your React/Next.js folder structure, for example:
   `file:///your-project/src/components/StringLineNetwork.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import StringLineNetwork from "@/components/StringLineNetwork.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <StringLineNetwork />
    </main>
  );
}
```

### ⚠️ Plugin Registration Notice
Since this component uses GSAP plugins (ScrollTrigger, MotionPathPlugin), they must be imported and registered at the top of your component file:
```tsx
import { ScrollTrigger, MotionPathPlugin } from "gsap/all";
gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `nodes` (Array): Floating node coordinate keys.
- `pathD` (string): The raw SVG path geometry definition.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
