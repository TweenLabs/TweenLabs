# TweenLabs — Component Authoring Guide

> **MANDATORY READING**: Before writing ANY animation component for this project, read this document in full. Then read `gsapskills.md` for GSAP-specific coding rules.
>
> **Cross-reference**: Always read `gsapskills.md` (located at project root) for GSAP animation best practices, plugin usage, performance optimization, and portability rules before writing any animation code.

---

## 1. What This Project Is

TweenLabs is an **open-source library of premium, ready-to-use GSAP animation components** for React 19 / Next.js 16. Users install components via CLI (`npx tweenlabs add ComponentName`) or copy-paste from the `/code/ComponentName` page. Every component **must work instantly** after download — zero configuration, zero external dependencies beyond `gsap` and `@gsap/react`.

---

## 2. The Golden Rules (Non-Negotiable)

These rules are extracted from all 18 existing components and are **absolute requirements**:

### 2.1 Single-File Architecture
Every component MUST be a **single `page.tsx` file** that is 100% self-contained:
- All interfaces, types, data arrays, helper functions, and sub-components MUST be defined **inside the same file**
- **ZERO imports from project files** — no `@/components/...`, no `@/data/...`, no `@/lib/...`
- The ONLY allowed imports are: `react`, `gsap`, `@gsap/react`, `gsap/*` plugins
- When a user downloads this file, it must compile and run in their project with zero modifications

### 2.2 Zero Global CSS Dependencies
- **NEVER** use custom Tailwind theme classes: `bg-wtf-green`, `bg-wtf-orange`, `text-wtf-*`, etc.
- **NEVER** use custom global CSS classes: `.dot-grid`, `.brutalist-btn`, `.tilt-right`, etc.
- **ALWAYS** use exact hex values as Tailwind arbitrary values: `bg-[#0c9367]`, `text-[#2a2a2a]`
- **ALWAYS** use exact shadow values: `shadow-[6px_6px_0px_#2a2a2a]`
- Standard Tailwind utilities (`flex`, `p-4`, `rounded-lg`, etc.) are fine — they ship with every Tailwind install

### 2.3 Zero External Asset Dependencies
- **NEVER** reference local images from `/public/` — users won't have them
- Use hosted URLs from `https://tweenlabs.xyz/` for demo images (e.g., `https://tweenlabs.xyz/showcase-1.webp`)
- For icons, use **inline SVGs** defined directly in JSX — never import from icon libraries
- Provide fallback visuals (colored divs, SVG patterns) for any asset that might not load

### 2.4 SSR Safety
- **ALWAYS** start every `page.tsx` with the `"use client"` directive on line 1
- **NEVER** access `window`, `document`, or `navigator` at module scope — only inside `useGSAP`, `useEffect`, or event handlers
- GSAP plugin registration (`gsap.registerPlugin(...)`) at module scope is safe because GSAP handles SSR internally

---

## 3. File Structure for Every Component

Each component lives in: `src/app/(main)/components/{ComponentName}/`

```
src/app/(main)/components/ComponentName/
├── page.tsx          ← The animation (SINGLE self-contained file)
├── layout.tsx        ← SEO metadata + JSON-LD structured data
└── HOW_TO_USE.md     ← Setup guide shown on /code/ComponentName page
```

### Naming Convention
- **Folder name** = **PascalCase** component name (e.g., `FlipCards`, `MagneticDock`, `BentoGrid`)
- The folder name IS the URL slug: `tweenlabs.xyz/components/ComponentName`
- The folder name IS what the CLI uses: `npx tweenlabs add ComponentName`

---

## 4. page.tsx — Canonical Structure

Every `page.tsx` follows this exact structure. Study this carefully:

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// Import ONLY the plugins you actually use:
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
// Only import useState, useEffect, useCallback IF actually needed

// Register plugins at module scope (SSR-safe)
gsap.registerPlugin(useGSAP);
// gsap.registerPlugin(useGSAP, ScrollTrigger);  ← only if using ScrollTrigger

// ─── DATA & TYPES ─────────────────────────────────────────
// Define ALL interfaces and data arrays HERE, inside the same file.
// Never import from external data files.
interface ItemData {
  id: number;
  title: string;
  color: string;      // Use raw hex: "#e55b3c"
  // ... other fields
}

const itemsData: ItemData[] = [
  {
    id: 1,
    title: "Example Item",
    color: "#e55b3c",
    // ...
  },
];

// ─── SUB-COMPONENTS (if needed) ───────────────────────────
// Define helper/child components in the SAME file.
// Example: BentoGrid defines BentoTiltCard in the same file.
// function HelperComponent({ ... }: HelperProps) { ... }

// ─── MAIN PAGE COMPONENT ─────────────────────────────────
export default function ComponentNamePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // All GSAP animation code goes here.
      // This replaces useEffect for GSAP — it auto-cleans up.
      // For ScrollTrigger scroll container detection:
      // const scroller = containerRef.current?.closest("#main-scroller") || undefined;
    },
    { scope: containerRef }
    // If animation depends on state: { scope: containerRef, dependencies: [stateVar] }
  );

  // For interactive GSAP (mouse handlers, click handlers):
  const { contextSafe } = useGSAP({ scope: containerRef });
  // const handleSomething = contextSafe((e: React.MouseEvent) => { ... });

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] ... overflow-hidden"
      ref={containerRef}
    >
      {/* Background texture layers (dot grid + noise) */}
      {/* Main content */}
    </div>
  );
}
```

### Import Order (Strict)
```tsx
"use client";                              // Line 1, always

import { useGSAP } from "@gsap/react";    // GSAP React hook first
import gsap from "gsap";                   // GSAP core second
import { ScrollTrigger } from "gsap/ScrollTrigger";  // GSAP plugins third (only if used)
import { useRef, useState } from "react";  // React hooks last
```

### Plugin Registration
```tsx
// Without ScrollTrigger:
gsap.registerPlugin(useGSAP);

// With ScrollTrigger:
gsap.registerPlugin(useGSAP, ScrollTrigger);

// With other plugins (if needed):
gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);
```

---

## 5. GSAP Animation Patterns (From Existing Components)

### 5.1 useGSAP with Scope (Standard)
```tsx
const containerRef = useRef<HTMLDivElement>(null);

useGSAP(
  () => {
    gsap.from(".my-element", { y: 100, opacity: 0, stagger: 0.1 });
  },
  { scope: containerRef }
);
```

### 5.2 ScrollTrigger with Custom Scroller Detection
The app uses a `#main-scroller` container. Components must detect it:
```tsx
useGSAP(
  () => {
    const scroller = containerRef.current?.closest("#main-scroller") || undefined;

    ScrollTrigger.create({
      trigger: containerRef.current,
      scroller: scroller,
      start: "top top",
      end: "bottom bottom",
      pin: true,
      // ...
    });
  },
  { scope: containerRef }
);
```

### 5.3 contextSafe for Event Handlers
**ALL** GSAP code inside React event handlers MUST use `contextSafe`:
```tsx
const { contextSafe } = useGSAP({ scope: containerRef });

const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  // ... calculate values
  gsap.to(card, {
    rotateX: rotX,
    rotateY: rotY,
    transformPerspective: 1000,
    ease: "power1.out",
    duration: 0.3,
    overwrite: "auto",
  });
});

const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
  gsap.to(e.currentTarget, {
    rotateX: 0,
    rotateY: 0,
    ease: "elastic.out(1.1, 0.4)",
    duration: 0.75,
    overwrite: "auto",
  });
});
```

### 5.4 State-Dependent Animations
When animations depend on React state changes:
```tsx
const [triggerKey, setTriggerKey] = useState(0);

useGSAP(
  () => {
    gsap.fromTo(".letter", { y: -400 }, { y: 0, ease: "bounce.out" });
  },
  { scope: containerRef, dependencies: [triggerKey] }
);
```

### 5.5 IntersectionObserver Pattern (Viewport Entry)
```tsx
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(el);
  return () => observer.disconnect();
}, []);
```

---

## 6. Visual Design System (Neo-Brutalist)

Every component MUST follow this design language. These are the exact values used across all 18 components:

### 6.1 Background & Canvas
```tsx
// Main page background (warm sand)
className="bg-[#f0eadf]"

// Primary text color (charcoal)
className="text-[#2a2a2a]"

// Selection highlight (yellow)
className="selection:bg-[#f1b333] selection:text-black"
```

### 6.2 Dot Grid Background (REQUIRED on every component)
Every component page includes this tactile dot-grid overlay:
```tsx
{/* Dot Grid */}
<div
  className="absolute inset-0 pointer-events-none z-0 opacity-15"
  style={{
    backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  }}
/>
```

Optional noise texture overlay (used by most components):
```tsx
{/* Noise Texture */}
<div
  className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
  style={{
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
  }}
/>
```

### 6.3 Color Palette (Use HEX Arbitrary Values Only)
| Color Name | Hex | Tailwind Usage |
|---|---|---|
| Orange | `#e55b3c` | `bg-[#e55b3c]` / `text-[#e55b3c]` |
| Green | `#0c9367` | `bg-[#0c9367]` / `text-[#0c9367]` |
| Yellow | `#f1b333` | `bg-[#f1b333]` / `text-[#f1b333]` |
| Blue | `#3b82f6` | `bg-[#3b82f6]` / `text-[#3b82f6]` |
| Purple | `#6758a5` | `bg-[#6758a5]` / `text-[#6758a5]` |
| Red | `#c53b3a` | `bg-[#c53b3a]` / `text-[#c53b3a]` |
| Charcoal | `#2a2a2a` | `text-[#2a2a2a]` / `border-[#2a2a2a]` |
| Canvas | `#f0eadf` | `bg-[#f0eadf]` |

### 6.4 Borders, Shadows & Cards
```tsx
// Standard card border
className="border-3 border-[#2a2a2a]"

// Standard drop shadow (tactile offset)
className="shadow-[6px_6px_0px_#2a2a2a]"

// Hover-elevated shadow
className="hover:shadow-[10px_10px_0px_#2a2a2a]"

// Small elements / inner frames
className="shadow-[2px_2px_0px_#2a2a2a]"
className="shadow-[4px_4px_0px_#2a2a2a]"

// Status badge / pill
className="inline-block border border-[#2a2a2a] px-2 py-0.5 rounded-full text-[8px] font-mono font-bold text-white uppercase bg-[#0c9367]"

// Status indicator dot
className="h-2.5 w-2.5 rounded-full border border-black animate-pulse bg-[#e55b3c]"
```

### 6.5 Typography
```tsx
// Title headings (serif, black weight, uppercase)
className="font-serif font-black uppercase tracking-tight text-[#2a2a2a]"

// Mono labels (tiny, uppercase, tracked)
className="font-mono text-[9px] font-bold text-zinc-400"

// Body text
className="font-sans font-medium text-zinc-650 text-xs leading-relaxed"

// Section subtitle label
className="font-mono text-[9px] font-black text-zinc-400"
```

### 6.6 Container Patterns
```tsx
// Full-page wrapper (standard on all components)
<div
  className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-8 selection:bg-[#f1b333] selection:text-black overflow-hidden"
  ref={containerRef}
>
```

For scroll-length components:
```tsx
className="relative min-h-[280vh] bg-[#f0eadf] text-[#2a2a2a] ... overflow-x-hidden"
```

---

## 7. layout.tsx — Exact Template

Every component needs a `layout.tsx` for SEO. Copy this template and fill in the values:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP {Component Display Name} Effect | TweenLabs",
  description:
    "{One-line description of the animation}. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP {Component Display Name}",
    "{Component Display Name} animation",
    "TweenLabs",
    "React 19",
    "Next.js 16",
    "interactive UI",
    "Tailwind CSS",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TweenLabs {Component Display Name} Component",
    description:
      "{One-line description of the animation}.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Browser",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "TweenLabs",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
```

---

## 8. HOW_TO_USE.md — Exact Structure

The code page (`/code/ComponentName`) parses this file by detecting headers. The parser looks for these exact header patterns:

### Required Sections (IN THIS ORDER)

```markdown
# How to Use: {Component Display Name}

{One-line intro describing the component.}

### Core GSAP Animation Code
```javascript
// Paste the CORE animation logic here.
// This is the raw GSAP code WITHOUT React wrappers.
// Users who don't use React can adapt this.
```

### Standalone Component Code
```tsx
// Paste the FULL standalone React component here.
// This must be a DIFFERENT version from page.tsx:
//   - Default export function with PROPS (not page data)
//   - Accepts configurable data via props interface
//   - No page-level styling (no min-h-screen, no backgrounds)
//   - User wraps this in their own layout
//
// Example:
// export default function ComponentName({ items }: ComponentNameProps) { ... }
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add {ComponentName}
```

---

### 🛠️ Option B: Manual Installation

### ⚡ Step 1: Install Dependencies
Open your project terminal and install the required GreenSock libraries:
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create a new component file inside your React/Next.js folder structure, for example:
   `your-project/src/components/{ComponentName}.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import {ComponentName} from "@/components/{ComponentName}.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <{ComponentName} />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

> [!NOTE]
> This component is fully customizable and ready to use.

{Describe each configurable prop.}

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
```

### Critical HOW_TO_USE.md Rules

1. **Header patterns matter** — The code page parser matches these exact patterns:
   - `### Core GSAP Animation Code` or `### Core Animation Code`
   - `### Standalone Component Code` or `### Standalone React Component`
   - `## Setup & Integration Guide` or `## Setup and Integration Guide`
   - `## Customization` or `## Properties` or `## Props`

2. **Standalone code MUST differ from page.tsx** — The standalone version:
   - Accepts data through **props** (not hardcoded data arrays)
   - Exports a **named component** function (not a page)
   - Has **no page-level styling** (no `min-h-screen`, no dot grid backgrounds)
   - Is a **drop-in component** the user wraps in their own layout

3. **Core GSAP code** is the raw animation logic without React hooks — for vanilla JS users

---

## 9. animations.ts — Registration

After creating the component files, add an entry to `src/data/components.ts`:

```ts
{
  id: "{NN}",                                    // Zero-padded: "19", "20", etc.
  name: "{Display Name}",                        // Human-readable: "Flip Cards"
  componentName: "{ComponentName}",              // PascalCase: "FlipCards" — MUST match folder name
  route: "/components/{ComponentName}",          // MUST be /components/ + componentName
  bgColor: "bg-wtf-green",                       // Card color on homepage (pick from available)
  textColor: "text-white",                       // Card text color
  description: "{One-line description of animation.}",
  tiltClass: "tilt-left",                        // Card tilt on homepage
},
```

### AnimationItem Interface
```ts
export interface AnimationItem {
  id: string;
  name: string;
  componentName: string;
  route: string;
  bgColor: string;
  textColor: string;
  description: string;
  tiltClass: string;
}
```

> **NOTE**: `bgColor`, `textColor`, and `tiltClass` use project-level custom classes because they are ONLY used on the homepage cards (which is a project page, not a downloadable component). This is the ONE exception to the "no custom classes" rule.

---

## 10. Performance Rules

Read `gsapskills.md` Section 5 (Performance) for full details. Key points:

1. **Animate transforms, not layout properties**: Use `x`, `y`, `rotation`, `scale`, `opacity` — NEVER `top`, `left`, `width`, `height`
2. **Use `autoAlpha` instead of `opacity`** when hiding elements (sets `visibility: hidden` at 0)
3. **Use `overwrite: "auto"`** on interactive animations (mouse, click) to prevent tween conflicts
4. **Use `will-change-transform`** class on elements that animate frequently
5. **Use `transform-gpu`** class to force GPU acceleration on persistent animations
6. **Use `gsap.set()`** for instant property changes (not `gsap.to()` with `duration: 0`)
7. **Properly scope all animations** via `{ scope: containerRef }` — this auto-cleans on unmount

---

## 11. What the Agent Receives After Download

When a user runs `npx tweenlabs add ComponentName`, the CLI:
1. Hits `GET /api/registry/ComponentName`
2. The API reads `src/app/(main)/components/ComponentName/page.tsx` from disk
3. Returns `{ name, className, dependencies: ["gsap", "@gsap/react"], files: [{ name: "ComponentName.tsx", content: <file contents> }] }`
4. CLI writes the file to the user's `src/components/tweenlabs/ComponentName.tsx`
5. CLI auto-installs missing dependencies (`gsap`, `@gsap/react`)

**This means**: The `page.tsx` file IS the downloaded file. It must work as-is in any React/Next.js project.

---

## 12. Complete Checklist for Every New Component

```
[ ] 1. Read this guide.md in full
[ ] 2. Read gsapskills.md for GSAP coding rules
[ ] 3. Choose a PascalCase name (e.g., "ParallaxHero")
[ ] 4. Create folder: src/app/(main)/components/ParallaxHero/
[ ] 5. Write page.tsx following Section 4 structure
    [ ] "use client" on line 1
    [ ] Correct import order (useGSAP → gsap → plugins → react)
    [ ] gsap.registerPlugin() at module scope
    [ ] All data/types/sub-components in the SAME file
    [ ] useGSAP with { scope: containerRef }
    [ ] contextSafe for ALL event handlers
    [ ] No custom Tailwind classes — hex values only
    [ ] No project imports — fully self-contained
    [ ] Dot grid background included
    [ ] Neo-Brutalist design tokens applied
    [ ] All icons are inline SVGs
    [ ] Images use tweenlabs.xyz URLs or placeholders
    [ ] Responsive (mobile + desktop)
[ ] 6. Write layout.tsx following Section 7 template
[ ] 7. Write HOW_TO_USE.md following Section 8 structure
    [ ] Core GSAP Animation Code section
    [ ] Standalone Component Code section (with props)
    [ ] Setup & Integration Guide section
    [ ] Customization & Props section
[ ] 8. Add entry to src/data/components.ts (Section 9)
[ ] 9. Run `npm run build` — verify no errors
[ ] 10. Test /components/ComponentName in browser
[ ] 11. Test /code/ComponentName in browser
[ ] 12. Test /api/registry/ComponentName returns valid JSON
```

---

## 13. Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|---|---|
| `import { animations } from "@/data/..."` | Define data inline in the same file |
| `bg-wtf-green` in page.tsx | `bg-[#0c9367]` |
| `className="dot-grid"` | Inline the radial-gradient style |
| `useEffect(() => { gsap.to(...) })` | `useGSAP(() => { gsap.to(...) }, { scope })` |
| `gsap.to(card, {...})` inside onClick | `contextSafe(() => gsap.to(card, {...}))()` |
| `<img src="/images/hero.png" />` | `<img src="https://tweenlabs.xyz/showcase-1.webp" />` |
| Importing React Icons / Lucide | Inline `<svg>` elements |
| `top: "50px"` animation | `y: 50` animation |
| `gsap.to(el, { duration: 0 })` | `gsap.set(el, { ... })` |
| `document.querySelector(...)` in module scope | `containerRef.current?.querySelector(...)` inside useGSAP |
| Missing `overwrite: "auto"` on mouse handlers | Always include `overwrite: "auto"` |

---

## 14. Expert Recommendations — What Else Is Needed

### 14.1 Accessibility (a11y)
- Add `aria-label` to interactive elements (buttons, clickable cards)
- Respect `prefers-reduced-motion` — wrap intense animations in a media query check:
  ```tsx
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return; // Skip animation
  ```
- Ensure keyboard navigability for interactive components (dock items, accordion buttons)

### 14.2 Mobile-First Responsiveness
- Every component MUST look good on mobile (320px+), tablet, and desktop
- Use responsive Tailwind classes: `text-2xl md:text-4xl`, `p-4 md:p-8`
- Disable drag/tilt interactions on touch devices if they conflict with scroll:
  ```tsx
  const isTouchDevice = 'ontouchstart' in window;
  ```

### 14.3 Error Boundaries
- Gracefully handle missing refs: always null-check before GSAP operations
  ```tsx
  if (!containerRef.current) return;
  ```
- Use optional chaining: `containerRef.current?.querySelector(...)`

### 14.4 Consistent Animation Quality Bar
- **Entrance animations**: Every component should have a polished entrance (stagger reveals, fades, scale-ins)
- **Hover interactions**: Cards and buttons should respond to hover with subtle depth (tilt, shadow growth, scale)
- **Easing**: Use named GSAP eases (`"power2.out"`, `"elastic.out(1.1, 0.4)"`, `"bounce.out"`) — never linear
- **Duration range**: Keep animations between 0.2s–1.2s. Faster for micro-interactions, slower for reveals

### 14.5 Demo Content Quality
- Use realistic, professional demo content (not "Lorem ipsum")
- Titles should feel like real product copy ("Creative Design", "Motion Physics", "Core Mechanics")
- Color-code data items using the palette from Section 6.3

### 14.6 Testing Protocol
After creating any component:
1. `npm run build` — must pass with zero errors
2. Visit `/components/ComponentName` — verify the animation runs
3. Visit `/code/ComponentName` — verify code tabs render (Core, Standalone, Setup)
4. Hit `/api/registry/ComponentName` — verify JSON response with file content
5. Test on mobile viewport (Chrome DevTools device mode)
6. Test with JavaScript disabled — page should show static content, not blank

---

## Quick Reference: File Locations

| File | Purpose |
|---|---|
| `guide.md` | This file — agent instructions |
| `gsapskills.md` | GSAP coding rules and best practices |
| `ADD_NEW_COMPONENT.md` | Abbreviated new component checklist |
| `src/data/components.ts` | Component registry (single source of truth) |
| `src/app/(main)/components/*/page.tsx` | Component source code |
| `src/app/(main)/components/*/layout.tsx` | SEO metadata |
| `src/app/(main)/components/*/HOW_TO_USE.md` | Setup guide |
| `src/app/(main)/code/[slug]/page.tsx` | Code page renderer |
| `src/app/api/registry/[slug]/route.ts` | CLI registry API |
| `bin/cli.js` | CLI tool source |
| `next.config.ts` | Redirects and rewrites |
