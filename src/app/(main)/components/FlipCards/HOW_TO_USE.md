# Flip Cards

Cards with two sides (front and back) that flip in 3D when triggered. Includes both a fanning mode (cards spread out on hover) and a scroll-triggered 3D flip mode.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add FlipCards
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
3. In your project, create a new file: `src/components/tweenlabs/FlipCards.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import FlipCards from "@/components/tweenlabs/FlipCards";

export default function MyPage() {
  return (
    <main>
      <FlipCards />
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



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `Array` | Required | Array of card data for front and back content. |
| `mode` | `string` | 'fan' | Animation mode: 'fan' for hover fanning, 'scroll' for scroll-triggered flips. |

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
