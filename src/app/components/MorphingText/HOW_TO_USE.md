# Morphing Text

Words auto-cycle with a smooth gooey dissolve effect. One word blurs out while the next blurs in, using an SVG threshold filter for the liquid morph look. Each word has its own accent color.


---

## Quick Start (Recommended)

The fastest way to add this component to your project:

```bash
npx tweenlabs@latest add MorphingText
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
3. In your project, create a new file: `src/components/tweenlabs/MorphingText.tsx`
4. Paste the copied code into that file
5. Save the file

### Step 3: Import and Use It

Open the page where you want to use this component and add:

```tsx
"use client";

import MorphingText from "@/components/tweenlabs/MorphingText";

export default function MyPage() {
  return (
    <main>
      <MorphingText />
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
// ─── Color interpolation helper ───────────────────────────
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

// ─── SVG filter for gooey threshold morph ─────────────────
// Apply filter id="text-morph" to the container wrapping both text layers
//
// <filter id="text-morph">
//   <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
//   <feColorMatrix in="blur" mode="matrix"
//     values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="snap" />
//   <feComposite in="SourceGraphic" in2="snap" operator="atop" />
// </filter>

// ─── Per-frame morph via requestAnimationFrame ────────────
const texts = ["Creative", "Morphing", "Dynamic", "Seamless", "Animated"];
const colors = ["#e55b3c", "#6758a5", "#0c9367", "#3b82f6", "#c53b3a"];
let currentIndex = 0;
let morphing = false;

function startMorph(text1El, text2El) {
  if (morphing) return;
  morphing = true;

  const fromIdx = currentIndex;
  const toIdx = (fromIdx + 1) % texts.length;
  const fromColor = colors[fromIdx];
  const toColor = colors[toIdx];

  // Set text content
  text1El.textContent = texts[fromIdx];
  text2El.textContent = texts[toIdx];

  let fraction = 0;

  function tick() {
    fraction += 0.01;
    if (fraction > 1) fraction = 1;

    // Ease in-out quad
    const t = fraction < 0.5
      ? 2 * fraction * fraction
      : 1 - Math.pow(-2 * fraction + 2, 2) / 2;

    // Single interpolated color — never two colors visible
    const blendedColor = lerpColor(fromColor, toColor, t);

    text1El.style.color = blendedColor;
    text2El.style.color = blendedColor;

    // Text 1 dissolves out
    text1El.style.filter = `blur(${t * 8}px)`;
    text1El.style.opacity = `${Math.pow(1 - t, 0.4)}`;

    // Text 2 dissolves in
    text2El.style.filter = `blur(${(1 - t) * 8}px)`;
    text2El.style.opacity = `${Math.pow(t, 0.4)}`;

    if (fraction < 1) {
      requestAnimationFrame(tick);
    } else {
      morphing = false;
      currentIndex = toIdx;

      // Reset layers for next cycle
      text1El.textContent = texts[toIdx];
      text1El.style.filter = "blur(0px)";
      text1El.style.opacity = "1";
      text1El.style.color = toColor;
      text2El.style.filter = "blur(8px)";
      text2El.style.opacity = "0";
    }
  }

  requestAnimationFrame(tick);
}

// Auto-cycle every 3.2 seconds
setInterval(() => startMorph(text1Element, text2Element), 3200);
```



---

## Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `texts` | `string[]` | Required | Array of words to cycle through (minimum 2). |
| `colors` | `string[]` | TweenLabs palette | Hex color for each word. Cycles if fewer than texts. |
| `interval` | `number` | 3200 | Milliseconds between word transitions. |
| `morphSpeed` | `number` | 0.01 | Per-frame speed (lower = smoother and slower). |
| `className` | `string` | '' | CSS classes for the wrapper (use for text sizing like 'text-6xl'). |

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
