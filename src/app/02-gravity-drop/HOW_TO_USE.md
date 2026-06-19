# How to Use: Gravity Drop Animation

This guide shows you how to copy and use the **Gravity Drop** animation as a standalone React component.

### Core GSAP Animation Code
```javascript
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
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface GravityDropProps {
  initialText?: string;
}

export default function GravityDrop({ initialText = "GRAVITY DROP" }: GravityDropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState(initialText);
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
  }, { scope: containerRef, dependencies: [textInput, triggerKey] });

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl border-4 border-[#2a2a2a] p-8 bg-white rounded-2xl shadow-[6px_6px_0px_#2a2a2a] overflow-hidden"
    >
      {/* Shelf container where text lands */}
      <div className="relative min-h-[160px] flex items-center justify-center border-b-4 border-[#2a2a2a] pb-4 bg-zinc-50 rounded-lg">
        <h1 className="text-5xl font-serif font-black tracking-tight flex flex-wrap justify-center gap-x-[0.35em]">
          {textInput.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="falling-letter inline-block transform origin-bottom font-black text-[#e55b3c] will-change-transform"
                  style={{ textShadow: "2px 2px 0px #2a2a2a" }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center items-center mt-6">
        <input
          type="text"
          maxLength={20}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value.toUpperCase())}
          placeholder="TYPE TEXT HERE"
          className="border-3 border-[#2a2a2a] px-4 py-2 font-mono font-bold rounded-lg focus:outline-none"
        />
        <button
          onClick={() => setTriggerKey(p => p + 1)}
          className="border-3 border-[#2a2a2a] bg-[#e55b3c] text-white font-mono font-bold px-6 py-2 rounded-lg cursor-pointer shadow-[3px_3px_0px_#2a2a2a] hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
        >
          Trigger Drop
        </button>
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add gravity-drop
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
   `file:///your-project/src/components/GravityDrop.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import GravityDrop from "@/components/GravityDrop.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <GravityDrop />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `initialText` (string): The text characters to drop and bounce. Defaults to `'GRAVITY DROP'`.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
