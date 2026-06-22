# Bento Grid

A responsive bento-style card grid where each card tilts toward your mouse cursor in 3D space. Cards spring back to flat when you move away. Includes crosshair tracking lines.


---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add BentoGrid
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
3. In your project, create a new file: `src/components/tweenlabs/BentoGrid.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import BentoGrid from "@/components/tweenlabs/BentoGrid";

export default function MyPage() {
  return (
    <main>
      <BentoGrid />
    </main>
  );
}
```

### Step 4: Register GSAP Plugins

Make sure the top of your component file has these imports:

```tsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
```

---

## How the Animation Works

This section shows the core GSAP animation logic. You don't need to copy this separately — it's already included in the Full Component Code above. This is here to help you understand how it works.

### Core GSAP Animation Code
```javascript
const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  
  // Calculate relative coordinates inside the card
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Set CSS variables for pointer spotlight effect
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);

  // Elegant 3D tilt values (-5 to +5 degrees)
  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
  const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;

  gsap.to(card, {
    rotateX: rotateX,
    rotateY: rotateY,
    transformPerspective: 1000,
    ease: "power1.out",
    duration: 0.3,
    overwrite: "auto",
  });

  // Optional: Dynamic parallax shifts on nested assets/images
  const imgFrame = card.querySelector(".inner-img");
  if (imgFrame) {
    const moveX = ((x - rect.width / 2) / rect.width) * 10;
    const moveY = ((y - rect.height / 2) / rect.height) * 10;
    gsap.to(imgFrame, {
      x: moveX,
      y: moveY,
      scale: 1.05,
      duration: 0.4,
      ease: "power1.out",
      overwrite: "auto",
    });
  }
};

const handleMouseLeave = (e) => {
  const card = e.currentTarget;
  // Smooth elastic return back to flat default state
  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    ease: "elastic.out(1.1, 0.4)",
    duration: 0.75,
    overwrite: "auto",
  });

  const imgFrame = card.querySelector(".inner-img");
  if (imgFrame) {
    gsap.to(imgFrame, {
      x: 0,
      y: 0,
      scale: 1.0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
};
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `Array` | Required | Array of card data (title, description, icon, color). |

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


**Styling looks wrong?**
- This component uses Tailwind CSS utility classes
- Make sure Tailwind is installed and configured in your project
