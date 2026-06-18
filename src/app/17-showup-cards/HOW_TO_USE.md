# How to Use: Showup Cards Reveal

This guide demonstrates how to copy and use the **Showup Cards** assembly and flip interaction.

### Core GSAP Animation Code
```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const smoothStep = (p) => p * p * (3 - 2 * p);

// Pin section in viewport
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "bottom bottom",
  pin: ".showup-cards-sec",
  pinSpacing: false,
});

// Animate vertical fall, fanning offset, and 180° backface flip on scroll scrub
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "bottom bottom",
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;

    ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
      const delay = index * 0.5;
      const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
      const innerCard = document.querySelector(`${cardId} .flip-card-inner`);

      // 1. Fall & bounce curve (Y offset interpolation)
      let y;
      if (cardProgress < 0.4) {
        y = gsap.utils.interpolate("-100%", "40%", smoothStep(cardProgress / 0.4));
      } else if (cardProgress < 0.6) {
        y = gsap.utils.interpolate("40%", "0%", smoothStep((cardProgress - 0.4) / 0.2));
      } else {
        y = "0%";
      }

      // 2. Scale reveal mapping
      let scale = cardProgress < 0.4 
        ? gsap.utils.interpolate(0.25, 0.75, smoothStep(cardProgress / 0.4)) 
        : cardProgress < 0.6 
        ? gsap.utils.interpolate(0.75, 1, smoothStep((cardProgress - 0.4) / 0.2)) 
        : 1;

      // 3. Opacity fade
      let opacity = cardProgress < 0.2 ? smoothStep(cardProgress / 0.2) : 1;

      // 4. Horizontal fanning spread and 180 degree flip rotation
      let x, rotate, rotationY;
      if (cardProgress < 0.6) {
        x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
        rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
        rotationY = 0;
      } else if (cardProgress < 1) {
        const norm = (cardProgress - 0.6) / 0.4;
        x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", smoothStep(norm));
        rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(norm));
        rotationY = smoothStep(norm) * 180;
      } else {
        x = "0%";
        rotate = 0;
        rotationY = 180;
      }

      gsap.set(cardId, { opacity, y, x, rotate, scale });
      if (innerCard) {
        gsap.set(innerCard, { rotationY });
      }
    });
  },
});
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ShowUpCardItem {
  id: number;
  phase: string;
  title: string;
  desc: string;
  imgUrl: string;
  accentClass: string; // Tailwind bg class: e.g. "bg-[#e55b3c]"
}

interface ShowUpCardsSectionProps {
  cards: ShowUpCardItem[];
}

export default function ShowUpCardsSection({ cards }: ShowUpCardsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const smoothStep = (p: number) => p * p * (3 - 2 * p);

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".showup-cards-sec",
        pinSpacing: false,
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          cards.forEach((card, index) => {
            const cardId = `#card-node-${card.id}`;
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
            const innerCard = document.querySelector(`${cardId} .flip-card-inner`);

            let y;
            if (cardProgress < 0.4) {
              y = gsap.utils.interpolate("-100%", "40%", smoothStep(cardProgress / 0.4));
            } else if (cardProgress < 0.6) {
              y = gsap.utils.interpolate("40%", "0%", smoothStep((cardProgress - 0.4) / 0.2));
            } else {
              y = "0%";
            }

            let scale = cardProgress < 0.4
              ? gsap.utils.interpolate(0.25, 0.75, smoothStep(cardProgress / 0.4))
              : cardProgress < 0.6
              ? gsap.utils.interpolate(0.75, 1, smoothStep((cardProgress - 0.4) / 0.2))
              : 1;

            let opacity = cardProgress < 0.2 ? smoothStep(cardProgress / 0.2) : 1;

            let x, rotate, rotationY;
            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const norm = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", smoothStep(norm));
              rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(norm));
              rotationY = smoothStep(norm) * 180;
            } else {
              x = "0%";
              rotate = 0;
              rotationY = 180;
            }

            gsap.set(cardId, { opacity, y, x, rotate, scale });
            if (innerCard) {
              gsap.set(innerCard, { rotationY });
            }
          });
        },
      });
    },
    { scope: containerRef, dependencies: [cards] }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotY = (x / rect.width - 0.5) * 12;
    const rotX = (y / rect.height - 0.5) * -12;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.35,
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
    <div ref={containerRef} className="relative min-h-[280vh] w-full">
      <section className="showup-cards-sec relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="cards-container w-full max-w-4xl flex items-center justify-center gap-6 md:gap-8 px-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card w-48 aspect-[5/7] md:w-56 opacity-0 flex-1 relative transform-gpu"
              id={`card-node-${card.id}`}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transformStyle: "preserve-3d",
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div className="flip-card-inner w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
                {/* Card Front Side */}
                <div
                  className="absolute inset-0 border-3 border-[#2a2a2a] bg-white p-4 flex flex-col justify-between rounded-xl shadow-[4px_4px_0px_#2a2a2a] cursor-pointer"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{card.phase}]</span>
                  </div>
                  <div className="w-full h-36 border-2 border-[#2a2a2a] relative overflow-hidden rounded-lg bg-zinc-50 my-2">
                    <img src={card.imgUrl} alt={card.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="border-t border-zinc-200 pt-2 flex justify-between items-center">
                    <h3 className="font-serif font-black text-xs text-[#2a2a2a]">{card.title}</h3>
                    <span className="font-mono text-[10px] font-bold text-zinc-400">0{card.id}</span>
                  </div>
                </div>

                {/* Card Back Side */}
                <div
                  className="absolute inset-0 border-3 border-[#2a2a2a] bg-white p-4 flex flex-col justify-between rounded-xl shadow-[4px_4px_0px_#2a2a2a] cursor-pointer"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="w-full flex justify-between font-mono font-bold text-[9px] border-b-2 border-black pb-2 items-center">
                    <span className="text-zinc-400">NODE SPECS</span>
                    <span className={`h-2 w-2 rounded-full border border-black animate-pulse ${card.accentClass}`} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                    <p className="text-[11px] font-sans font-semibold text-zinc-650 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add showup-cards
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
   `file:///your-project/src/components/ShowUpCardsSection.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import ShowUpCardsSection from "@/components/ShowUpCardsSection.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <ShowUpCardsSection />
    </main>
  );
}
```

### ⚠️ Plugin Registration Notice
Since this component uses GSAP plugins (ScrollTrigger), they must be imported and registered at the top of your component file:
```tsx
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(useGSAP, ScrollTrigger);
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `cards` (Array): List of cards that fall, scatter horizontally, and flip 180° on scroll scrub.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
