# How to Use: Fluid Custom Cursor

This guide shows you how to copy and use the **Fluid Custom Cursor** as a standalone React component.

### Core GSAP Animation Code
```javascript
// quickTo helpers for smooth, high-performance tracking
const xToDot = gsap.quickTo(dotRef.current, "x", {
  duration: 0.08,
  ease: "power2.out",
});
const yToDot = gsap.quickTo(dotRef.current, "y", {
  duration: 0.08,
  ease: "power2.out",
});

const updateCursor = (e) => {
  // If not hovering/snapping on a target, track the mouse freely
  if (!isHovered.current) {
    xToDot(e.clientX);
    yToDot(e.clientY);
    gsap.to(ringRef.current, {
      x: e.clientX - 16,
      y: e.clientY - 16,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  } else if (activeTargetRef.current) {
    // Morph & magnetic drag calculations relative to target center
    const rect = activeTargetRef.current.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - elementCenterX) * 0.15;
    const deltaY = (e.clientY - elementCenterY) * 0.15;

    gsap.to(ringRef.current, {
      x: rect.left + deltaX,
      y: rect.top + deltaY,
      duration: 0.2,
      overwrite: "auto",
    });

    xToDot(e.clientX);
    yToDot(e.clientY);
  }
};
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface FluidCursorProps {
  children?: React.ReactNode;
}

export default function FluidCursor({ children }: FluidCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const isHovered = useRef(false);
  const activeTargetRef = useRef<HTMLElement | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (typeof window === "undefined" || !dotRef.current || !ringRef.current)
        return;

      // Initialize quickTo setters
      const xToDot = gsap.quickTo(dotRef.current, "x", {
        duration: 0.08,
        ease: "power2.out",
      });
      const yToDot = gsap.quickTo(dotRef.current, "y", {
        duration: 0.08,
        ease: "power2.out",
      });

      const updateCursor = (e: MouseEvent) => {
        if (!isHovered.current) {
          xToDot(e.clientX);
          yToDot(e.clientY);
          gsap.to(ringRef.current, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else if (activeTargetRef.current) {
          const rect = activeTargetRef.current.getBoundingClientRect();
          const elementCenterX = rect.left + rect.width / 2;
          const elementCenterY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - elementCenterX) * 0.15;
          const deltaY = (e.clientY - elementCenterY) * 0.15;

          gsap.to(ringRef.current, {
            x: rect.left + deltaX,
            y: rect.top + deltaY,
            duration: 0.2,
            overwrite: "auto",
          });

          xToDot(e.clientX);
          yToDot(e.clientY);
        }
      };

      window.addEventListener("mousemove", updateCursor);
      return () => window.removeEventListener("mousemove", updateCursor);
    },
    { scope: containerRef }
  );

  const handleTargetEnter = contextSafe((e: React.MouseEvent<HTMLElement>) => {
    isHovered.current = true;
    const target = e.currentTarget;
    activeTargetRef.current = target;

    const rect = target.getBoundingClientRect();
    const cursorText = target.getAttribute("data-cursor-text") || "";

    // Morph ring to outline card
    gsap.to(ringRef.current, {
      width: rect.width,
      height: rect.height,
      borderRadius: "12px",
      borderWidth: "3px",
      borderColor: "#2a2a2a",
      backgroundColor: "rgba(241, 179, 51, 0.2)",
      boxShadow: "4px 4px 0px #2a2a2a",
      x: rect.left,
      y: rect.top,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    // Shrink dot
    gsap.to(dotRef.current, {
      scale: 0.5,
      backgroundColor: "#e55b3c",
      duration: 0.2,
      overwrite: "auto",
    });

    const labelEl = ringRef.current?.querySelector(".cursor-label");
    if (labelEl) {
      labelEl.innerHTML = cursorText;
      gsap.to(labelEl, {
        opacity: 1,
        scale: 1,
        y: -24,
        duration: 0.2,
        overwrite: "auto",
      });
    }
  });

  const handleTargetLeave = contextSafe(() => {
    isHovered.current = false;
    activeTargetRef.current = null;

    // Reset ring
    gsap.to(ringRef.current, {
      width: 32,
      height: 32,
      borderRadius: "9999px",
      borderWidth: "3px",
      borderColor: "#2a2a2a",
      backgroundColor: "transparent",
      boxShadow: "0px 0px 0px transparent",
      duration: 0.35,
      ease: "back.out(1.5)",
      overwrite: "auto",
    });

    // Reset dot
    gsap.to(dotRef.current, {
      scale: 1,
      backgroundColor: "#2a2a2a",
      duration: 0.2,
      overwrite: "auto",
    });

    const labelEl = ringRef.current?.querySelector(".cursor-label");
    if (labelEl) {
      gsap.to(labelEl, {
        opacity: 0,
        scale: 0.6,
        y: 0,
        duration: 0.2,
        overwrite: "auto",
      });
    }
  });

  // Attach hover helpers recursively to children with custom datasets
  const renderChildren = (node: React.ReactNode): React.ReactNode => {
    return React.Children.map(node, (child) => {
      if (!React.isValidElement(child)) return child;

      // If the child is marked as a magnetic target
      if (child.props["data-cursor-target"] || child.props["data-cursor-text"]) {
        return React.cloneElement(child as React.ReactElement<any>, {
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            if (child.props.onMouseEnter) child.props.onMouseEnter(e);
            handleTargetEnter(e);
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            if (child.props.onMouseLeave) child.props.onMouseLeave(e);
            handleTargetLeave();
          },
          // Force hide standard cursor on hover
          style: { ...child.props.style, cursor: "none" },
        });
      }

      if (child.props.children) {
        return React.cloneElement(child as React.ReactElement<any>, {
          children: renderChildren(child.props.children),
        });
      }

      return child;
    });
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen relative overflow-hidden cursor-none">
      {/* Custom Cursor elements */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 bg-[#2a2a2a] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border-3 border-[#2a2a2a] rounded-full pointer-events-none z-[9998] flex items-center justify-center bg-transparent"
        style={{ transformOrigin: "top left" }}
      >
        <span className="cursor-label absolute pointer-events-none font-mono text-[9px] font-black bg-[#f1b333] text-black border-2 border-[#2a2a2a] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_#2a2a2a] uppercase opacity-0 scale-70 tracking-widest whitespace-nowrap z-50 select-none" />
      </div>

      <div className="w-full h-full cursor-none">
        {renderChildren(children)}
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add fluid-cursor
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
   `file:///your-project/src/components/FluidCursor.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import FluidCursor from "@/components/FluidCursor.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <FluidCursor />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

You can pass the following settings to configure the layout and animation details:

- `children` (ReactNode): The layout children inside which the custom cursor tracks.
- Note: Simply add `data-cursor-text="YOUR LABEL"` on any interactive child to make the cursor morph and snap onto it!

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
