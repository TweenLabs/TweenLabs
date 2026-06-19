# How to Use: Interactive Magnetic Dock

This guide shows you how to copy and use the **Interactive Magnetic Dock** as a standalone React component.

### Core GSAP Animation Code
```javascript
const handleMouseMove = (e, index) => {
  const btn = dockItemsRef.current[index];
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  // Calculate distance from cursor to button center
  const distanceX = e.clientX - btnCenterX;
  const distanceY = e.clientY - btnCenterY;

  // Pull button towards cursor with magnetic force
  gsap.to(btn, {
    x: distanceX * 0.35,
    y: distanceY * 0.35,
    scale: 1.15,
    rotation: distanceX * 0.1,
    duration: 0.3,
    ease: "power2.out",
    overwrite: "auto",
  });
};

const handleClick = (btn) => {
  // Springy squash and stretch timeline feedback
  const tl = gsap.timeline();
  tl.to(btn, { scaleX: 1.35, scaleY: 0.65, duration: 0.1, ease: "power1.out" })
    .to(btn, { scaleX: 0.8, scaleY: 1.25, duration: 0.15, ease: "power1.out" })
    .to(btn, { scaleX: 1.1, scaleY: 0.95, duration: 0.15 })
    .to(btn, { scaleX: 1, scaleY: 1, duration: 0.2, ease: "elastic.out(1, 0.3)" });
};
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface DockItem {
  id: string;
  label: string;
  color: string; // Tailwind background/text classes, e.g. "bg-[#e55b3c] text-white"
  icon: React.ReactNode;
}

interface MagneticDockProps {
  items?: DockItem[];
  onSelect?: (id: string) => void;
}

const defaultDockData: DockItem[] = [
  {
    id: "home",
    label: "HOME",
    color: "bg-[#e55b3c] text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "PROJECTS",
    color: "bg-[#0c9367] text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: "about",
    label: "ABOUT",
    color: "bg-[#f1b333] text-black",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "services",
    label: "SERVICES",
    color: "bg-[#6758a5] text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "CONTACT",
    color: "bg-[#3b82f6] text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function MagneticDock({ items = defaultDockData, onSelect }: MagneticDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dockItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const btn = dockItemsRef.current[index];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - btnCenterX;
    const distanceY = e.clientY - btnCenterY;

    contextSafe(() => {
      gsap.to(btn, {
        x: distanceX * 0.35,
        y: distanceY * 0.35,
        scale: 1.15,
        rotation: distanceX * 0.1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    })();
  };

  const handleMouseLeave = (index: number) => {
    const btn = dockItemsRef.current[index];
    if (!btn) return;

    contextSafe(() => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    })();
  };

  const handleClick = (id: string, index: number) => {
    setActiveItem(id);
    if (onSelect) onSelect(id);

    const btn = dockItemsRef.current[index];
    if (!btn) return;

    contextSafe(() => {
      const tl = gsap.timeline();
      tl.to(btn, { scaleX: 1.35, scaleY: 0.65, duration: 0.1, ease: "power1.out" })
        .to(btn, { scaleX: 0.8, scaleY: 1.25, duration: 0.15, ease: "power1.out" })
        .to(btn, { scaleX: 1.1, scaleY: 0.95, duration: 0.15 })
        .to(btn, { scaleX: 1, scaleY: 1, duration: 0.2, ease: "elastic.out(1, 0.3)" });
    })();
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center py-4 overflow-visible">
      <div className="relative border-4 border-[#2a2a2a] bg-white px-6 py-4 rounded-3xl shadow-[8px_8px_0px_#2a2a2a] flex items-center gap-6 md:gap-8 justify-center max-w-full overflow-visible">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="relative group flex items-center justify-center w-14 h-14 cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={() => handleMouseLeave(idx)}
          >
            {/* Tooltip */}
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <div className="bg-[#2a2a2a] text-white text-[9px] font-mono font-bold px-3 py-1.5 rounded-md border border-white uppercase tracking-wider whitespace-nowrap shadow-[2px_2px_0px_#f1b333] rotate-2">
                {item.label}
              </div>
            </div>

            {/* Button */}
            <button
              ref={(el) => {
                dockItemsRef.current[idx] = el;
              }}
              onClick={() => handleClick(item.id, idx)}
              className={`w-14 h-14 border-3 border-[#2a2a2a] rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_#2a2a2a] cursor-pointer will-change-transform ${item.color}`}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add magnetic-dock
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
   `file:///your-project/src/components/MagneticDock.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import MagneticDock from "@/components/MagneticDock.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <MagneticDock />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `items` (Array): A list of dock navigation buttons containing labels, colors, and SVG icons.
- `onSelect` (Function): Callback function triggered when a button is clicked.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
