# Adding a New Animation Component

Quick reference guide. Follow these steps every time you add a new animation.

---

## Step 1: Create the Component Folder

Create a new folder inside `src/app/(main)/components/` using PascalCase:

```
src/app/(main)/components/NewComponent/
├── page.tsx         ← Your animation (REQUIRED)
├── layout.tsx       ← SEO metadata (REQUIRED)
└── HOW_TO_USE.md    ← Setup guide for /code page (REQUIRED)
```

The folder name = the component name = the URL slug. That's it.

**URL will be:** `tweenlabs.xyz/components/NewComponent`

### page.tsx — Your Animation

```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function NewComponentPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Your GSAP animation code here
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen w-full">
      {/* Your component JSX here */}
    </div>
  );
}
```

### layout.tsx — SEO Metadata

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP New Component Effect | TweenLabs",
  description:
    "One-line description of your animation. Explore this interactive GSAP animation component on TweenLabs.",
  keywords: [
    "GSAP",
    "GSAP New Component",
    "New Component animation",
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
    name: "TweenLabs New Component",
    description: "One-line description of your animation.",
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

### HOW_TO_USE.md — Setup Guide

This is shown on the `/code/NewComponent` page:

```md
# How to Use: New Component

### Core GSAP Animation Code
(paste the core gsap logic here)

### Standalone Component Code
(paste the full copy-paste component here)

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
npx tweenlabs@latest add NewComponent

### 🛠️ Option B: Manual Installation

### ⚡ Step 1: Install Dependencies
npm install gsap @gsap/react

### 📁 Step 2: Save the Component File
Create src/components/NewComponent.tsx and paste the Standalone Component Code.

### 🚀 Step 3: Import and Render
Import and use in any page.

## 🛠️ Customization & Component Properties (Props)
Describe configurable props.
```

---

## Step 2: Add Entry in `components.ts`

Open `src/data/components.ts` and add to the `animations` array:

```ts
{
  id: "new-component",                    // Unique slug ID (kebab-case)
  name: "New Component",                  // Display name on cards
  componentName: "NewComponent",          // Must match folder name exactly
  route: "/components/NewComponent",      // /components/ + componentName
  bgColor: "bg-wtf-green",               // Card badge color (see color table)
  textColor: "text-white",               // Badge text color
  description: "Description of the animation.",
  tiltClass: "tilt-left",                // Card tilt effect
  type: ["card", "scroll"],              // Categories (see type table)
  preview: "/previews/NewComponent.webp", // Optional: static thumbnail
  embedInteraction: "scroll",            // Optional: preview interaction mode
},
```

### Field Reference

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique kebab-case slug (e.g. `"new-component"`) — **NOT** a number |
| `name` | ✅ | Display name shown on cards |
| `componentName` | ✅ | PascalCase — must match folder name exactly |
| `route` | ✅ | Always `/components/{componentName}` |
| `bgColor` | ✅ | Badge color (see color table below) |
| `textColor` | ✅ | Badge text: `"text-white"` or `"text-black"` |
| `description` | ✅ | One-line description of the animation |
| `tiltClass` | ✅ | `"tilt-left"` or `"tilt-right"` |
| `type` | ✅ | Array of categories: `"text"`, `"scroll"`, `"card"`, `"interactive"` |
| `preview` | ❌ | Path to `.webp` thumbnail in `/public/previews/` |
| `embedInteraction` | ❌ | How the card preview animates on hover (see below) |

> [!NOTE]
> Always use a unique kebab-case slug for `id`. Do **NOT** use sequential numbers. This prevents merge conflicts when multiple contributors submit PRs. The visual serial numbers (`[01]`, `[02]`, etc.) are computed dynamically.

---

## Step 3: Add Preview Thumbnail (Optional but Recommended)

Capture a screenshot of your component and save as:

```
public/previews/NewComponent.webp
```

**Recommended specs:**
- Format: `.webp` (preferred) or `.png`
- Size: ~800×450px (16:9 aspect ratio)
- Content: Show the component in its "best moment"

If no preview image is provided, a "Hover to preview" placeholder is shown — no crash.

---

## Preview Interaction Modes

The `embedInteraction` field controls what happens when a user hovers over the card preview:

| Value | Behavior | Best For |
|---|---|---|
| `"scroll"` (default) | Auto-scrolls the page up/down | ScrollTrigger components, long pages |
| `"cursor"` | Simulates mouse movement across interactive elements | FluidCursor, BentoGrid, MagneticDock, KineticText |
| `"tabs"` | Clicks tab buttons sequentially | TabsMotion, tab-based UIs |
| `"click-sequence"` | Clicks buttons/triggers in order | Accordion, expandable elements |

If omitted, defaults to `"scroll"`.

---

## Available Colors

| bgColor | Hex Code | textColor | Badge Shows |
|---|---|---|---|
| `bg-wtf-green` | `#0c9367` | `text-white` | GREEN |
| `bg-wtf-yellow` | `#f1b333` | `text-black` | YELLOW |
| `bg-wtf-blue` | `#3b82f6` | `text-white` | BLUE |
| `bg-wtf-orange` | `#e55b3c` | `text-white` | ORANGE |
| `bg-wtf-purple` | `#6758a5` | `text-white` | PURPLE |
| `bg-wtf-red` | `#c53b3a` | `text-white` | RED |

## Tilt Classes

| Class | Effect |
|---|---|
| `tilt-left` | Slight left tilt (−2°) |
| `tilt-right` | Slight right tilt (+2°) |
| `tilt-left-lg` | Large left tilt (−8°) |
| `tilt-right-lg` | Large right tilt (+8°) |

---

## What Happens Automatically

Once you complete the steps above, the following are **fully automatic** — no extra files to edit:

- ✅ **Home page** picks up the new card
- ✅ **Components page** shows it with filters and search
- ✅ **Card numbering** updates (`[23]`, `[24]`, etc.)
- ✅ **Preview iframe** works on hover (`/preview/[slug]` dynamic import)
- ✅ **Category filter** includes it based on `type[]`
- ✅ **CLI** can install it (`npx tweenlabs add new-component`)

---

## Verify

```bash
pnpm build
```

You should see your new route:

```
├ ƒ /components/NewComponent
```

Then test:

- **Demo page:** `localhost:3000/components/NewComponent`
- **Preview page:** `localhost:3000/preview/NewComponent`
- **Code page:** `localhost:3000/code/NewComponent`
- **API:** `localhost:3000/api/registry/NewComponent`

---

## Quick Checklist

```
[ ] Created src/app/(main)/components/NewComponent/page.tsx
[ ] Created src/app/(main)/components/NewComponent/layout.tsx
[ ] Created src/app/(main)/components/NewComponent/HOW_TO_USE.md
[ ] Added entry in src/data/components.ts
[ ] Added preview image: public/previews/NewComponent.webp (optional)
[ ] Ran pnpm build — no errors
[ ] Tested /components/NewComponent in browser
[ ] Tested /code/NewComponent in browser
```
