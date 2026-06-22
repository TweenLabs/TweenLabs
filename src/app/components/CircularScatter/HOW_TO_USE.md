# Circular Scatter Gallery

Cards stack one-by-one at the center of the screen, then scatter outward along a spiral orbit path. After settling, they float gently. Includes a scramble text hero at the bottom.

> [!IMPORTANT]
> This component uses **GSAP ScrollTrigger**. You must import and register it at the top of your component file (see Step 3 below).

---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add CircularScatter
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
3. In your project, create a new file: `src/components/tweenlabs/CircularScatter.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import CircularScatter from "@/components/tweenlabs/CircularScatter";

export default function MyPage() {
  return (
    <main>
      <CircularScatter />
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

## Core GSAP Animation Code (Spiral Orbit)

The entry transition stacks cards one-by-one, then sweeps them out along a synchronized spiral orbit. To prevent overlapping during the transition, all cards start moving simultaneously:

```javascript
// 1. Initial Measurement: Get local coordinates relative to screen center
const cards = gsap.utils.toArray(".scatter-card");
const cardParams = cards.map((card, idx) => {
  const rect = card.getBoundingClientRect();
  const targetCenterX = rect.left + rect.width / 2;
  const screenCenterX = window.innerWidth / 2;
  const targetCenterY = rect.top + rect.height / 2;
  const screenCenterY = window.innerHeight / 2;
  
  const X_c = screenCenterX - targetCenterX;
  const Y_c = screenCenterY - targetCenterY;
  
  const R_final = Math.sqrt(X_c * X_c + Y_c * Y_c);
  const theta_final = Math.atan2(-Y_c, -X_c);
  
  return { card, X_c, Y_c, R_final, theta_final };
});

// Set initial state at screen center
cardParams.forEach((param, idx) => {
  gsap.set(param.card, {
    x: param.X_c,
    y: param.Y_c,
    scale: 0.9,
    rotation: 0,
    opacity: 0,
    zIndex: 10 + idx,
  });
});

const introTl = gsap.timeline({
  defaults: { ease: "power4.out" },
  onComplete: () => {
    startFloatingIdle();
  }
});

// Phase 1: Staggered Center Pile-up (Deliberate & Premium)
talentData.forEach((card, idx) => {
  introTl.to(`.scatter-card-${idx}`, {
    opacity: 1,
    scale: 1.02,
    rotation: (idx % 2 === 0 ? 4 : -4),
    duration: 0.38,
    ease: "back.out(1.2)",
  }, idx * 0.3);
});

const scatterStart = talentData.length * 0.3 + 0.4;

// Phase 2: Synchronized Spiral Orbit Sweep (No crossovers or crossovers)
cardParams.forEach((param, idx) => {
  const loops = 0.6; // Elegant 216-degree orbit path
  const animObj = { p: 0 };
  
  introTl.to(animObj, {
    p: 1,
    duration: 2.8,
    ease: "power3.out",
    onUpdate: () => {
      const t = animObj.p;
      const R_t = param.R_final * t;
      // Archimedean Spiral path: theta(t) sweeps back from final angle
      const theta_t = param.theta_final - (2 * Math.PI * (1 - t) * loops);
      
      const x = param.X_c + R_t * Math.cos(theta_t);
      const y = param.Y_c + R_t * Math.sin(theta_t);
      
      gsap.set(param.card, {
        x,
        y,
        rotation: gsap.utils.interpolate(idx % 2 === 0 ? 4 : -4, talentData[idx].rot, t),
        scale: gsap.utils.interpolate(1.02, 1, t),
      });
    },
  }, scatterStart); // Simultaneous start ensures zero overlapping
});

// Phase 3: Bottom text fades in in parallel
introTl.fromTo(".hero-tagline, .hero-title-scramble, .hero-subtitle, .hero-cta-btn", 
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 },
  scatterStart
);
```

## Continuous Float / Hover Highlight Logic

```javascript
// Floating Drift Idle Loop
function startFloatingIdle() {
  cardParams.forEach((param, idx) => {
    const offset = idx % 2 === 0 ? 1 : -1;
    gsap.to(param.card, {
      y: `+=${10 * offset}`,
      x: `+=${5 * -offset}`,
      rotation: `+=${1.5 * offset}`,
      duration: 3.2 + idx * 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  });
}

// Mouse Hover Event Handlers
const handleCardEnter = (e, color) => {
  gsap.to(e.currentTarget, {
    scale: 1.08,
    borderColor: color,
    boxShadow: `0 15px 35px ${color}20, 6px 6px 0px #2a2a2a`,
    duration: 0.3,
    overwrite: "auto",
  });
};

const handleCardLeave = (e) => {
  gsap.to(e.currentTarget, {
    scale: 1,
    borderColor: "#2a2a2a",
    boxShadow: "4px 4px 0px #2a2a2a",
    duration: 0.3,
    overwrite: "auto",
  });
};
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `Array` | Required | Array of card data with positions and accent colors. |

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
