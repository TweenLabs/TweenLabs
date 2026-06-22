# Orbit Gallery

Abstract cards orbit around a center point, then as you scroll down, they converge into a clean horizontal timeline layout. Combines floating orbital motion with scroll-driven layout change.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add OrbitGallery
```

This automatically installs the component and all its dependencies. You're done!

---

## Manual Installation (Step-by-Step)

If you prefer to install manually, follow these steps:

### Step 1: Install GSAP

Open your terminal in your project folder and run:

```bash
npm install gsap @gsap/react
```

> [!TIP]
> Using pnpm? Run `pnpm add gsap @gsap/react` instead.
> Using yarn? Run `yarn add gsap @gsap/react` instead.

### Step 2: Copy the Component Code

1. Click the **"Full Component Code"** tab in the code viewer above
2. Click the **"Copy"** button in the top-right corner
3. In your project, create a new file: `src/components/tweenlabs/OrbitGallery.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import OrbitGallery from "@/components/tweenlabs/OrbitGallery";

export default function MyPage() {
  return (
    <main>
      <OrbitGallery />
    </main>
  );
}
```

### Step 4: Register GSAP Plugins

Make sure the top of your component file has these imports:

```tsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
```

---

## How the Animation Works

This section shows the core GSAP animation logic. You don't need to copy this separately — it's already included in the Full Component Code above. This is here to help you understand how it works.

### Core GSAP Animation Code
```javascript
// 1. Initial State: Offset the cards relative to their final horizontal layout position
// They float at the 4 corners of the screen (partially off-screen and rotated)
gsap.set(".orbit-card-0", { x: "-15vw", y: "-35vh", rotation: -18, scale: 0.75 });
gsap.set(".orbit-card-1", { x: "52vw", y: "-38vh", rotation: 12, scale: 0.75 });
gsap.set(".orbit-card-2", { x: "-42vw", y: "38vh", rotation: -12, scale: 0.75 });
gsap.set(".orbit-card-3", { x: "15vw", y: "35vh", rotation: 18, scale: 0.75 });

// Hide playhead and timeline tracks initially
gsap.set(".playhead-line", { scaleY: 0, opacity: 0 });
gsap.set(".timeline-track", { scaleX: 0, opacity: 0 });

// Hide card images initially
gsap.set(".card-image", { opacity: 0, scale: 0.9 });

// 2. Master timeline linked to vertical scroll pinning
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: scrollSectionRef.current,
    pin: true,
    scrub: 0.6,
    start: "top top",
    end: "+=3000",
    invalidateOnRefresh: true,
  },
});

// Phase 1: Convergence
tl.to(".orbit-card-0, .orbit-card-1, .orbit-card-2, .orbit-card-3", {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  duration: 1.2,
  ease: "power2.inOut",
}, 0);

// Fade in timeline track guide
tl.to(".timeline-track", {
  scaleX: 1,
  opacity: 0.15,
  duration: 0.4,
  ease: "power2.out",
}, 0.8);

// Phase 2: Playhead Activation & Sweep
tl.to(".playhead-line", {
  scaleY: 1,
  opacity: 1,
  duration: 0.3,
  ease: "back.out(1.5)",
}, 1.2)
.to(".playhead-line", {
  left: "95vw",
  duration: 2.0,
  ease: "none",
}, 1.5);

// Card 0 active glow & image reveal (timeline time 1.55s to 2.05s)
tl.to(".orbit-card-0", { scale: 1.08, duration: 0.25 }, 1.55)
  .to(".orbit-card-0 .card-inner-box", { borderColor: "#f1b333", boxShadow: "0 12px 36px rgba(241, 179, 51, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-0 .card-image", { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 }, "<")
  .to(".orbit-card-0", { scale: 1, duration: 0.25 }, 1.8)
  .to(".orbit-card-0 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-0 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Card 1 active glow & image reveal (timeline time 2.05s to 2.55s)
tl.to(".orbit-card-1", { scale: 1.08, duration: 0.25 }, 2.05)
  .to(".orbit-card-1 .card-inner-box", { borderColor: "#0c9367", boxShadow: "0 12px 36px rgba(12, 147, 103, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-1 .card-image", { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 }, "<")
  .to(".orbit-card-1", { scale: 1, duration: 0.25 }, 2.3)
  .to(".orbit-card-1 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-1 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Card 2 active glow & image reveal (timeline time 2.55s to 3.05s)
tl.to(".orbit-card-2", { scale: 1.08, duration: 0.25 }, 2.55)
  .to(".orbit-card-2 .card-inner-box", { borderColor: "#8b5cf6", boxShadow: "0 12px 36px rgba(139, 92, 246, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-2 .card-image", { opacity: 1, scale: 1.15, rotation: 4, duration: 0.25 }, "<")
  .to(".orbit-card-2", { scale: 1, duration: 0.25 }, 2.8)
  .to(".orbit-card-2 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-2 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Card 3 active glow & image reveal (timeline time 3.05s to 3.55s)
tl.to(".orbit-card-3", { scale: 1.08, duration: 0.25 }, 3.05)
  .to(".orbit-card-3 .card-inner-box", { borderColor: "#c53b3a", boxShadow: "0 12px 36px rgba(197, 59, 58, 0.35)", duration: 0.25 }, "<")
  .to(".orbit-card-3 .card-image", { opacity: 1, scale: 1.15, rotation: -4, duration: 0.25 }, "<")
  .to(".orbit-card-3", { scale: 1, duration: 0.25 }, 3.3)
  .to(".orbit-card-3 .card-inner-box", { borderColor: "#2a2a2a", boxShadow: "6px 6px 0px #2a2a2a", duration: 0.25 }, "<")
  .to(".orbit-card-3 .card-image", { scale: 1, rotation: 0, duration: 0.25 }, "<");

// Phase 3: Exit Slide-out
tl.to(".playhead-line", { scaleY: 0, opacity: 0, duration: 0.2 }, 3.5)
  .to(".timeline-cards-row", { xPercent: -150, duration: 1.0, ease: "power2.in" }, 3.6);
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | Required | Array of gallery items (image, title). |

### Theme Tokens

This component uses TweenLabs' Neo-Brutalist design tokens:

| Token | Value | What It Does |
|-------|-------|-------------|
| Background | `bg-[#f0eadf]` | Warm sand-colored canvas |
| Borders | `border-3 border-[#2a2a2a]` | Bold charcoal outlines |
| Shadows | `shadow-[6px_6px_0px_#2a2a2a]` | Tactile offset drop shadows |

> [!TIP]
> You can change these values throughout the component to match your own design system. Just search and replace the hex colors.

---

## Troubleshooting

**Animation not playing?**
- Make sure you have `"use client"` at the very top of your component file
- Check that GSAP is installed: `npm list gsap`

**Component not rendering?**
- Verify the import path matches your file location
- Make sure you're using React 18+ or 19

**ScrollTrigger not working?**
- Make sure you imported and registered ScrollTrigger (see Step 4)
- Check that your component has enough scroll height (the page must be scrollable)
- Try adding `ScrollTrigger.refresh()` after dynamic content loads

**Styling looks wrong?**
- This component uses Tailwind CSS utility classes
- Make sure Tailwind is installed and configured in your project
