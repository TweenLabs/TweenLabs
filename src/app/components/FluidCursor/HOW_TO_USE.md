# Fluid Cursor

A custom cursor that follows your mouse with a smooth elastic lag. When you hover over buttons or interactive elements, the cursor snaps to their shape and morphs to fit.


---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add FluidCursor
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
3. In your project, create a new file: `src/components/tweenlabs/FluidCursor.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import FluidCursor from "@/components/tweenlabs/FluidCursor";

export default function MyPage() {
  return (
    <main>
      <FluidCursor />
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



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | 20 | Default cursor size in pixels. |
| `color` | `string` | '#e55b3c' | Cursor color. |
| `elasticity` | `number` | 0.15 | How stretchy the cursor following feels (0-1). |

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
