# Adding a New Animation Component

Quick reference guide. Follow these 2 steps every time you add a new animation.

---

## Step 1: Create the Folder

Create a new folder inside `src/app/(main)/components/` using PascalCase:

```
src/app/(main)/components/NewComponent/
├── page.tsx
├── layout.tsx
└── HOW_TO_USE.md
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

Open `src/data/components.ts` and add to the array:

```ts
{
  id: "23",
  name: "New Component",                  // Display name on homepage cards
  componentName: "NewComponent",           // Must match folder name exactly
  route: "/components/NewComponent",       // /components/ + componentName
  bgColor: "bg-wtf-green",                // Card background color
  textColor: "text-white",                // Card text color
  description: "Description of the animation.",
  tiltClass: "tilt-left",                 // Card tilt effect
},
```

**That's it. No other files to touch.**

---

## Available Colors

| bgColor | Hex Code | textColor | Preview |
|---|---|---|---|
| `bg-wtf-green` | `#0c9367` | `text-white` | 🟢 Green |
| `bg-wtf-yellow` | `#f1b333` | `text-black` | 🟡 Yellow |
| `bg-wtf-blue` | `#3b82f6` | `text-white` | 🔵 Blue |
| `bg-wtf-orange` | `#e55b3c` | `text-white` | 🟠 Orange |
| `bg-wtf-purple` | `#6758a5` | `text-white` | 🟣 Purple |
| `bg-wtf-red` | `#c53b3a` | `text-white` | 🔴 Red |

> Defined in `src/app/globals.css`:
> ```css
> --wtf-green:  #0c9367;
> --wtf-yellow: #f1b333;
> --wtf-blue:   #3b82f6;
> --wtf-orange: #e55b3c;
> --wtf-purple: #6758a5;
> --wtf-red:    #c53b3a;
> ```

## Tilt Classes

| Class | Effect |
|---|---|
| `tilt-left` | Slight left tilt (−2°) |
| `tilt-right` | Slight right tilt (+2°) |
| `tilt-left-lg` | Large left tilt (−8°) |
| `tilt-right-lg` | Large right tilt (+8°) |

---

## Verify

```bash
npm run build
```

You should see your new route:

```
├ ƒ /components/NewComponent
```

Then test:

- **Demo page:** `localhost:3000/components/NewComponent`
- **Code page:** `localhost:3000/code/NewComponent`
- **API:** `localhost:3000/api/registry/NewComponent`

---

## Quick Checklist

```
[ ] Created src/app/(main)/components/NewComponent/page.tsx
[ ] Created src/app/(main)/components/NewComponent/layout.tsx
[ ] Created src/app/(main)/components/NewComponent/HOW_TO_USE.md
[ ] Added entry in src/data/components.ts
[ ] Ran npm run build — no errors
[ ] Tested /components/NewComponent in browser
[ ] Tested /code/NewComponent in browser
```
