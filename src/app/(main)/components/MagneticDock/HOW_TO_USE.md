# Magnetic Dock

A floating menu bar (like macOS Dock) where buttons magnetically pull toward your cursor. The closer your mouse gets, the stronger the pull. Buttons snap back when you move away.


---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add MagneticDock
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
3. In your project, create a new file: `src/components/tweenlabs/MagneticDock.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import MagneticDock from "@/components/tweenlabs/MagneticDock";

export default function MyPage() {
  return (
    <main>
      <MagneticDock />
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



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | Required | Array of dock items (icon, label, color). |
| `magnetStrength` | `number` | 0.3 | How strongly items pull toward the cursor (0-1). |

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
