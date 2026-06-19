# How to Use: Morphing Accordion

This guide explains how to integrate the dynamic **Morphing Accordion** component with staggered item reveals and reactive background color transitions.

### Core GSAP Animation Code
```javascript
const handleToggle = (index) => {
  const isExpanding = activeIndex !== index;
  const activeItem = accordionItems[index];

  // Morph background container
  gsap.to(containerRef.current, {
    backgroundColor: isExpanding ? activeItem.bgTint : "#f0eadf",
    duration: 0.5,
    ease: "power2.out",
  });

  // Morph card border & shadow accent
  gsap.to(cardRef.current, {
    borderColor: isExpanding ? activeItem.color : "#2a2a2a",
    boxShadow: isExpanding
      ? `8px 8px 0px ${activeItem.color}`
      : "6px 6px 0px #2a2a2a",
    duration: 0.5,
    ease: "power2.out",
  });

  // Animate panel heights & details stagger
  accordionItems.forEach((_, idx) => {
    const el = contentRefs.current[idx];
    if (!el) return;

    const shouldExpand = isExpanding && idx === index;

    if (shouldExpand) {
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        marginTop: 16,
        duration: 0.45,
        ease: "power3.inOut",
        overwrite: "auto",
      });

      // Stagger list elements inside the expanding content panel
      const listItems = el.querySelectorAll(".accordion-detail-item");
      gsap.fromTo(
        listItems,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.1,
          overwrite: "auto",
        }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.35,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }
  });
};
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface AccordionData {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  details: string[];
  color: string; // Accent color hex (e.g. "#e55b3c")
  bgTint: string; // Backdrop color hex (e.g. "#fdf6f4")
}

interface MorphingAccordionProps {
  items: AccordionData[];
}

export default function MorphingAccordion({ items }: MorphingAccordionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleToggle = contextSafe((index: number) => {
    const isExpanding = activeIndex !== index;
    setActiveIndex(isExpanding ? index : null);

    const activeItem = items[index];

    // Page background transition
    gsap.to(containerRef.current, {
      backgroundColor: isExpanding ? activeItem.bgTint : "#f0eadf",
      duration: 0.5,
      ease: "power2.out",
    });

    // Main card box-shadow & border transformation
    gsap.to(cardRef.current, {
      borderColor: isExpanding ? activeItem.color : "#2a2a2a",
      boxShadow: isExpanding
        ? `8px 8px 0px ${activeItem.color}`
        : "6px 6px 0px #2a2a2a",
      duration: 0.5,
      ease: "power2.out",
    });

    // Toggle panels
    items.forEach((_, idx) => {
      const el = contentRefs.current[idx];
      if (!el) return;

      const shouldExpand = isExpanding && idx === index;

      if (shouldExpand) {
        gsap.to(el, {
          height: "auto",
          opacity: 1,
          marginTop: 16,
          duration: 0.45,
          ease: "power3.inOut",
          overwrite: "auto",
        });

        const listItems = el.querySelectorAll(".accordion-detail-item");
        gsap.fromTo(
          listItems,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.1,
            overwrite: "auto",
          }
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          marginTop: 0,
          duration: 0.35,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      }
    });
  });

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center p-8 transition-colors duration-500 bg-[#f0eadf]"
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl border-3 border-[#2a2a2a] bg-white p-6 md:p-8 rounded-2xl shadow-[6px_6px_0px_#2a2a2a] transition-all duration-500"
      >
        {items.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={item.id}
              className="border-b-3 border-[#2a2a2a] last:border-b-0 pb-4 last:pb-0 pt-4 first:pt-0 flex flex-col"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer group"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.subtitle}]</span>
                  <h2
                    className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight transition-colors duration-200"
                    style={{ color: isOpen ? item.color : "" }}
                  >
                    {item.title}
                  </h2>
                </div>
                <span className="w-8 h-8 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-mono font-bold text-sm bg-zinc-50 shadow-[2px_2px_0px_#2a2a2a] group-hover:bg-[#2a2a2a] group-hover:text-white transition-colors">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="h-0 opacity-0 overflow-hidden flex flex-col gap-4"
              >
                <p className="text-sm font-sans font-semibold text-zinc-600 leading-relaxed max-w-xl">
                  {item.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {item.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="accordion-detail-item flex items-center gap-2.5 font-mono text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg"
                    >
                      <span
                        className="w-2 h-2 rounded-full border border-black"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add morphing-accordion
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
   `file:///your-project/src/components/MorphingAccordion.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import MorphingAccordion from "@/components/MorphingAccordion.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <MorphingAccordion />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `items` (Array): An array of accordion data lists. Each item has a `title`, `subtitle`, `summary`, `details` array, `color`, and `bgTint` morph colors.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
