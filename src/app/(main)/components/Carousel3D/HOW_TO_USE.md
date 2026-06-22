# 3D Carousel

A circular 3D carousel you can drag to rotate or use arrow keys. Cards are arranged in a circle with perspective, and clicking a card opens a detail panel with smooth animation.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add Carousel3D
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
3. In your project, create a new file: `src/components/tweenlabs/Carousel3D.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import Carousel3D from "@/components/tweenlabs/Carousel3D";

export default function MyPage() {
  return (
    <main>
      <Carousel3D />
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
// Setup loop ticker to smoothly interpolate coverflow positions
const updatePositions = () => {
  const state = dragRef.current;
  const numCards = items.length;

  if (detailIdx === null) {
    if (state.isDragging) {
      state.smoothRotation += (state.rotation - state.smoothRotation) * 0.25;
    } else {
      state.velocity *= 0.92; // Inertia friction
      state.rotation += state.velocity;
      state.rotation = Math.max(0, Math.min(numCards - 1, state.rotation)); // Clamp bounds
      state.smoothRotation += (state.rotation - state.smoothRotation) * 0.15;
    }
  }

  // Calculate 3D transforms for each card
  cardsRef.current.forEach((card, index) => {
    if (!card) return;

    if (detailIdx !== null) {
      // Fade out non-active cards in detail mode
      if (index !== detailIdx) {
        gsap.to(card, {
          opacity: 0,
          scale: 0.5,
          z: -400,
          x: index < detailIdx ? -600 : 600,
          rotationY: index < detailIdx ? -60 : 60,
          pointerEvents: "none",
          duration: 0.6,
          overwrite: "auto",
        });
      }
      return;
    }

    const diff = index - state.smoothRotation;
    const xStep = 260; // horizontal separation
    const zStep = 180; // depth offset
    const maxRotY = 48; // max rotation degrees

    const x = diff * xStep;
    const z = -Math.abs(diff) * zStep;
    const rotY = Math.max(-maxRotY, Math.min(maxRotY, diff * -35));

    const scale = Math.max(0.68, 1 - Math.abs(diff) * 0.08);
    const opacity = Math.max(0.08, 1 - Math.abs(diff) * 0.38);
    const isClickable = Math.abs(diff) < 0.8;

    gsap.set(card, {
      x: x,
      y: 0,
      z: z,
      rotationY: rotY,
      scale: scale,
      opacity: opacity,
      zIndex: Math.round(100 - Math.abs(diff) * 10),
      pointerEvents: isClickable ? "auto" : "none",
    });
  });
};

gsap.ticker.add(updatePositions);
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | Required | Array of carousel items (image, title, description). |
| `radius` | `number` | 400 | Radius of the 3D circle in pixels. |

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
