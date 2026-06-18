# How to Use: Scroll Tags Assembly

This guide shows you how to copy and use the **Scroll Tags Assembly** animation as a standalone React component.

### Core GSAP Animation Code
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: scrollSection,
    pin: true,
    scrub: 1,
    start: "top top",
    end: "+=1500",
  },
});

tags.forEach((tag, idx) => {
  const xStart = Number(tag.getAttribute("data-xs") || 0);
  const yStart = Number(tag.getAttribute("data-ys") || 0);
  const rotate = Number(tag.getAttribute("data-rot") || 0);

  tl.fromTo(
    tag,
    { x: xStart, y: yStart, rotation: rotate * 3, opacity: 0, scale: 0.2 },
    { x: 0, y: 0, rotation: rotate, opacity: 1, scale: 1, ease: "power2.out" },
    idx * 0.15
  );
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

interface TagItem {
  text: string;
  color: string; // Tailwind color class or hex styles
  xStart: number; // starting offset X
  yStart: number; // starting offset Y
  rotate: number; // landing rotation angle
}

interface ScrollTagsProps {
  tags?: TagItem[];
}

const defaultTags: TagItem[] = [
  { text: "CREATIVE", color: "bg-[#e55b3c] text-white", xStart: -400, yStart: -200, rotate: -15 },
  { text: "DEVELOPER", color: "bg-[#0c9367] text-white", xStart: 400, yStart: 250, rotate: 12 },
  { text: "GSAP 3", color: "bg-[#f1b333] text-black", xStart: -300, yStart: 300, rotate: -8 },
  { text: "NEXT.JS", color: "bg-[#6758a5] text-white", xStart: 500, yStart: -150, rotate: 15 },
  { text: "REACT", color: "bg-[#3b82f6] text-white", xStart: -500, yStart: 100, rotate: 5 },
  { text: "BRUTALIST", color: "bg-[#c53b3a] text-white", xStart: 300, yStart: -300, rotate: -12 },
];

export default function ScrollTagsAssembly({ tags = defaultTags }: ScrollTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tagElements = gsap.utils.toArray<HTMLElement>(".assembler-tag");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=1500", // scroll distance for animation
        anticipatePin: 1,
      },
    });

    tagElements.forEach((tagEl, idx) => {
      const xStart = Number(tagEl.getAttribute("data-xs") || 0);
      const yStart = Number(tagEl.getAttribute("data-ys") || 0);
      const rotate = Number(tagEl.getAttribute("data-rot") || 0);

      tl.fromTo(
        tagEl,
        {
          x: xStart,
          y: yStart,
          rotation: rotate * 3,
          opacity: 0,
          scale: 0.2,
        },
        {
          x: 0,
          y: 0,
          rotation: rotate,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
        },
        idx * 0.15 // staggered timeline offset
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Intro indicator */}
      <div className="h-[40vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold uppercase">Scroll down to assemble tags</h2>
        <span className="animate-bounce mt-4">↓</span>
      </div>

      {/* Assembly Area */}
      <section 
        ref={scrollSectionRef} 
        className="h-screen w-full flex items-center justify-center relative bg-white border-y-4 border-[#2a2a2a]"
      >
        <div className="w-full max-w-3xl p-6 border-3 border-[#2a2a2a] rounded-xl bg-zinc-50 flex flex-wrap gap-4 items-center justify-center shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05)]">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`assembler-tag px-6 py-3 border-2 border-[#2a2a2a] rounded-lg font-mono font-black text-base shadow-[3px_3px_0px_#2a2a2a] transform will-change-transform ${tag.color}`}
              data-xs={tag.xStart}
              data-ys={tag.yStart}
              data-rot={tag.rotate}
            >
              {tag.text}
            </span>
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="h-[40vh]" />
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs add scroll-tags-assembly
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
   `file:///your-project/src/components/ScrollTagsAssembly.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import ScrollTagsAssembly from "@/components/ScrollTagsAssembly.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <ScrollTagsAssembly />
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

- `tags` (Array): An array of tag objects. Each object contains `text` (string), `color` (Tailwind class), `xStart` (number), `yStart` (number), and `rotate` (number).

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
