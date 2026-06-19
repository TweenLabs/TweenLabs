# How to Use: Inward-Outward Border Reveal

This guide shows you how to copy and use the **Inward-Outward Border Reveal** text animation as a standalone React component.

### Core GSAP Animation Code
```javascript
const horizontalTween = gsap.to(textTrack, {
  x: () => -(textTrack.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: scrollSection,
    pin: true,
    scrub: 1,
  },
});

chars.forEach((char) => {
  const startY = -window.innerHeight * 0.9;
  const startRot = -35;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: char,
      containerAnimation: horizontalTween,
      start: "left right",
      end: "right left",
      scrub: true,
    },
  });

  tl.fromTo(char, { y: startY, rotation: startRot, opacity: 0, scale: 0.6 }, { y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" })
    .to(char, { y: -15, rotation: 4, scale: 1.03, duration: 0.15, ease: "sine.inOut" })
    .to(char, { y: 15, rotation: -4, scale: 0.97, duration: 0.15, ease: "sine.inOut" })
    .to(char, { y: -startY, rotation: -startRot, opacity: 0, scale: 0.6, duration: 0.35, ease: "power3.in" });
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

interface BorderRevealProps {
  phrase: string; // The text string to animate
}

export default function BorderRevealText({ phrase = "HELLO WORLD THIS IS GSAP" }: BorderRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const chars = gsap.utils.toArray<HTMLElement>(".reveal-char");

    // 1. Create the main horizontal translation timeline
    const horizontalTween = gsap.to(textTrackRef.current, {
      x: () => -(textTrackRef.current?.scrollWidth! - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=2500", // Scroll length control
        invalidateOnRefresh: true,
      },
    });

    // 2. Animate characters relative to horizontal viewport positions
    chars.forEach((char) => {
      const startY = -window.innerHeight * 0.9;
      const startRot = -35;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: char,
          containerAnimation: horizontalTween, // Link to horizontal scroll
          start: "left right", // Enter right edge of viewport
          end: "right left",   // Exit left edge of viewport
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
          duration: 0.35,
          ease: "power3.out",
        }
      )
      // Drift wave phase
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
      // Exit drop out
      .to(char, {
        y: -startY,
        rotation: -startRot,
        opacity: 0,
        scale: 0.6,
        duration: 0.35,
        ease: "power3.in",
      });
    });

    return () => {
      // Reverts automatically via useGSAP hook
    };
  }, { scope: containerRef, dependencies: [phrase] });

  let globalCharIndex = 0;

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-[#1e1e1e] text-white overflow-hidden"
    >
      {/* Scroll area */}
      <div 
        ref={scrollSectionRef} 
        className="h-screen w-full flex items-center relative overflow-hidden"
      >
        {/* Track holding the text */}
        <div 
          ref={textTrackRef} 
          className="relative flex items-center pl-[100vw] pr-[100vw] whitespace-nowrap h-full select-none w-max flex-shrink-0"
        >
          <div className="flex gap-[6vw] flex-shrink-0 w-max">
            {phrase.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char) => {
                  const idx = globalCharIndex++;
                  return (
                    <span
                      key={idx}
                      className="reveal-char inline-block transform origin-center font-serif font-black uppercase text-[8vw] md:text-[10vw]"
                      style={{
                        textShadow: "4px 4px 0px #121212",
                        color: wordIdx % 2 === 1 ? "#e55b3c" : "white"
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add inward-outward-border-reveal
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
   `file:///your-project/src/components/BorderRevealText.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import BorderRevealText from "@/components/BorderRevealText.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <BorderRevealText />
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

- `phrase` (string): The message string that scrolls horizontally and drops characters. Defaults to `'HELLO THIS IS GSAP'`.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
