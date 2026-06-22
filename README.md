<!-- SEO Meta Block — paste this in your Next.js layout.tsx or head -->
<!--
title: TweenLabs — Premium Open Source GSAP Component Library for Next.js
description: A free, open-source GSAP animation component library and UI template sandbox built with Next.js 16, React 19, and Lenis. Learn and build modern web animations with reusable, copy-paste ready components.
keywords: TweenLabs, GSAP component library, GSAP Next.js, GSAP animations React, open source animation library, web animation components, Lenis smooth scroll, GSAP ScrollTrigger components, Next.js animation library
-->

# <img src="https://raw.githubusercontent.com/TweenLabs/TweenLabs/master/public/logo.svg" alt="TweenLabs Logo" width="40" height="40" align="center" /> TweenLabs

> The open-source **GSAP animation component library** for Next.js developers — learn, copy, and contribute modern web animation patterns built with **GSAP 3.15**, **Next.js 16**, and **Lenis**.

**[Live Demo](https://tweenlabs.xyz)** • **[All Components](https://tweenlabs.xyz/components)** • **[Playground](https://tweenlabs.xyz/playground)** • **[Contributing Guide](#contributing)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![npm](https://img.shields.io/npm/v/tweenlabs?style=flat-square&color=CB3837)

---

## What is TweenLabs?

**TweenLabs** is a community-driven, open-source collection of reusable GSAP animation components for Next.js and React. Every component is production-ready, well-documented, and built to help developers understand *how* advanced web animations work — not just copy code blindly.

No paid plugins. No locked content. Just clean, modern animation patterns anyone can learn from and build on.

> 🔍 **Looking for a GSAP component library for Next.js?** You found it.

---

## ⚡ CLI — Install Components Instantly

TweenLabs ships with a **zero-dependency CLI** that lets you pull components directly into your codebase — no copy-paste required.

### Initialize configuration

Run the `init` command to configure your preferred installation path. This creates a `tweenlabs.config.json` file in the root of your project, meaning you won't be prompted for the path when adding components in the future.

```bash
npx tweenlabs@latest init
```

By default, it will detect your project setup and suggest `./src/components/tweenlabs` or `./components/tweenlabs`.

### Add a component

```bash
npx tweenlabs@latest add <component-slug>
```

This will:
1. Fetch the component files from the TweenLabs registry
2. Detect your project layout (supports `src/` and non-`src/` setups)
3. Automatically resolve the install path to `src/components/tweenlabs/`
4. Create the directory if it doesn't exist
5. Detect and install any missing npm dependencies

### Browse & install interactively

Run `add` without a slug to get an interactive picker:

```bash
npx tweenlabs@latest add
```

```
▲  tweenlabs  v0.1.6

Select a component to install:

  [1]  .                    All Components
  [2]  flip-cards           Interactive 3D fanning + scroll-pinned card flip
  [3]  carousel-3d          Mathematical 3D wheel with drag inertia
  [4]  gravity-drop         Physics-based falling letters with realistic bounce
  [5]  border-reveal        Horizontal text scroll with fly-in letter borders
  [6]  morphing-text        SVG threshold filter text morphing animation
  ...

👉 Enter the number of the component to add (1-22):
```

### List all available components

```bash
npx tweenlabs@latest list
```

### Install all components at once

```bash
npx tweenlabs@latest add .
```

---

## 📁 Output Structure

After installation, components land here by default:

```
your-project/
└── src/
    └── components/
        └── tweenlabs/
            ├── GravityDrop.tsx
            ├── BorderReveal.tsx
            ├── MorphingText.tsx
            └── ...
```

> **tweenlabs.config.json:** If a `tweenlabs.config.json` exists in your project's root, the CLI reads the `path` option and installs components there. This takes highest precedence.
>
> **shadcn UI users:** If no `tweenlabs.config.json` exists but your project has a `components.json`, TweenLabs reads the `aliases.components` field and installs into the matching directory under a `tweenlabs/` subfolder automatically.

---

## 🚩 CLI Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--yes` | `-y` | Skip all prompts; accept all defaults and auto-install dependencies |
| `--path <dir>` | `-p` | Override the install directory |
| `--overwrite` | `-o` | Overwrite existing files without prompting |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show CLI version |

### Examples

```bash
# Install with a custom path
npx tweenlabs@latest add gravity-drop --path src/ui/animations

# Install all, skip all prompts, overwrite existing files
npx tweenlabs@latest add . --yes --overwrite

# Install with pnpm dlx
pnpm dlx tweenlabs add border-reveal
```

---

## ✨ Animation Components (22 total)

Browse all at **[tweenlabs.xyz/components](https://tweenlabs.xyz/components)**

### Text Animations

| Component | Route | Description | GSAP Features |
|-----------|-------|-------------|---------------|
| **Kinetic Text** | [`/components/KineticText`](https://tweenlabs.xyz/components/KineticText) | Liquid wave, character scramble, and magnetic motion sandbox | `gsap.to`, SplitText, pointer events |
| **Parallax Hero** | [`/components/ParallaxHero`](https://tweenlabs.xyz/components/ParallaxHero) | Multi-layer parallax hero with SplitText character scatter entrance | SplitText, ScrollTrigger, parallax |
| **Reveal Text** | [`/components/RevealText`](https://tweenlabs.xyz/components/RevealText) | Premium line-by-line text reveal with staggered choreography | SplitText, Timeline, stagger |
| **Morphing Text** | [`/components/MorphingText`](https://tweenlabs.xyz/components/MorphingText) | Smooth auto-cycling text morphing with SVG threshold filter | SVG filter, Timeline, CSS vars |

### Scroll Effects

| Component | Route | Description | GSAP Features |
|-----------|-------|-------------|---------------|
| **Scroll Cards** | [`/components/ScrollCards`](https://tweenlabs.xyz/components/ScrollCards) | Vertical scroll-pinned stacked cards with y-transform parallax | ScrollTrigger, pin, stagger |
| **Scroll Tags** | [`/components/ScrollTags`](https://tweenlabs.xyz/components/ScrollTags) | Tags fly into a grid board from all offscreen directions on scroll | ScrollTrigger, fromTo, stagger |
| **Horizontal Cards** | [`/components/HorizontalCards`](https://tweenlabs.xyz/components/HorizontalCards) | Neo-Brutalist cards slide, float, and exit with horizontal scroll | ScrollTrigger, x-transform |
| **Page Transition** | [`/components/PageTransition`](https://tweenlabs.xyz/components/PageTransition) | Stacked color-themed sections peel up with dynamic skewing | ScrollTrigger, skewY, pin |
| **Border Reveal** | [`/components/BorderReveal`](https://tweenlabs.xyz/components/BorderReveal) | Letters fly in/out from top/bottom borders on horizontal scroll | ScrollTrigger, clipPath |

### Cards & Grids

| Component | Route | Description | GSAP Features |
|-----------|-------|-------------|---------------|
| **Flip Cards** | [`/components/FlipCards`](https://tweenlabs.xyz/components/FlipCards) | Interactive fanning cards and scroll-pinned 3D perspective flip | ScrollTrigger, rotateY, stagger |
| **Bento Grid** | [`/components/BentoGrid`](https://tweenlabs.xyz/components/BentoGrid) | Neo-Brutalist 3D perspective mouse tilt with spring physics | `gsap.quickTo`, pointer events |
| **3D Carousel** | [`/components/Carousel3D`](https://tweenlabs.xyz/components/Carousel3D) | 3D mathematical wheel rotation with drag inertia and keyboard nav | Timeline, rotateY, inertia |
| **Circular Scatter** | [`/components/CircularScatter`](https://tweenlabs.xyz/components/CircularScatter) | Cards stack at center then scatter to outer edges with hero text | ScrollTrigger, scatter, stagger |
| **Orbit Gallery** | [`/components/OrbitGallery`](https://tweenlabs.xyz/components/OrbitGallery) | Orbiting cards converge into a sleek horizontal timeline on scroll | ScrollTrigger, x/y transforms |

### Interactive

| Component | Route | Description | GSAP Features |
|-----------|-------|-------------|---------------|
| **Fluid Cursor** | [`/components/FluidCursor`](https://tweenlabs.xyz/components/FluidCursor) | Elastic lagging cursor that snaps and morphs around buttons | `gsap.quickTo`, pointer events |
| **Magnetic Dock** | [`/components/MagneticDock`](https://tweenlabs.xyz/components/MagneticDock) | Floating menu bar where buttons pull toward cursor dynamically | `gsap.quickTo`, spring physics |
| **Gravity Drop** | [`/components/GravityDrop`](https://tweenlabs.xyz/components/GravityDrop) | Staggered letters fall onto a shelf with realistic physics bounce | `ease`, bounce, stagger |
| **String Line** | [`/components/StringLine`](https://tweenlabs.xyz/components/StringLine) | ScrollTriggered SVG network line drawing with node proximity scale | ScrollTrigger, SVG draw, scale |
| **Tabs Motion** | [`/components/TabsMotion`](https://tweenlabs.xyz/components/TabsMotion) | Animated tab navigation with sliding indicator and directional crossfade | Timeline, clip, crossfade |

### Layout & UI

| Component | Route | Description | GSAP Features |
|-----------|-------|-------------|---------------|
| **Blueprint** | [`/components/Blueprint`](https://tweenlabs.xyz/components/Blueprint) | Page-load exploding cards + text scramble matching blueprintapps.io | Timeline, stagger, scramble |
| **Skill Fit** | [`/components/SkillFit`](https://tweenlabs.xyz/components/SkillFit) | Candidate profile showcase with vertical ScrollTrigger pinning | ScrollTrigger, pin, stagger |
| **Accordion** | [`/components/Accordion`](https://tweenlabs.xyz/components/Accordion) | Selection morphs page background and staggers content reveal | Timeline, background morph |

---

## 🛠 Tech Stack

- **[Next.js 16.2.7](https://nextjs.org/)** – React framework with SSR and App Router
- **[GSAP 3.15](https://gsap.com/)** – Industry-standard JavaScript animation library
- **[React 19.2.4](https://react.dev/)** – Modern component-based UI
- **[Lenis 1.3](https://github.com/darkroom-digital/lenis)** – Buttery smooth scroll
- **[Tailwind CSS 4](https://tailwindcss.com/)** – Utility-first styling
- **[Convex](https://convex.dev/)** – Real-time backend and auth
- **[TypeScript 5](https://www.typescriptlang.org/)** – Full type safety

---

## 🚀 Quick Start (Run Locally)

Want to run the full TweenLabs playground locally?

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Clone the repo
git clone https://github.com/TweenLabs/TweenLabs.git
cd TweenLabs

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

| URL | Page |
|-----|------|
| `http://localhost:3000` | Home / Landing |
| `http://localhost:3000/components` | All Components gallery |
| `http://localhost:3000/components/MorphingText` | Individual component view |
| `http://localhost:3000/playground` | AI-powered animation playground |
| `http://localhost:3000/code/MorphingText` | Source code viewer (auth required) |

---

## 🤝 Contributing

TweenLabs grows with the community. We welcome new components, bug fixes, docs, performance improvements, and accessibility enhancements.

### Steps

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/TweenLabs.git

# 2. Create a branch
git checkout -b feat/your-animation-name

# 3. Install & run
pnpm install && pnpm dev

# 4. Make changes, then commit
git commit -m "feat: add [animation name]"

# 5. Push and open a PR
git push origin feat/your-animation-name
```

### Adding a New Component

- Create a folder: `src/app/(main)/components/YourComponent/`
- Add `page.tsx` with your animation
- Register it in `src/data/components.ts` with `id`, `name`, `componentName`, `route`, `bgColor`, `textColor`, `description`, and `tiltClass`
- Add inline comments explaining the GSAP logic

### Good First Contributions

- ✅ Add explanatory comments to existing animations
- ✅ Test on mobile/tablet and report issues
- ✅ Create animation variants with different easing curves
- ✅ Improve accessibility (`prefers-reduced-motion`, ARIA)
- ✅ Write or improve docs

### Code Guidelines

- Use CSS transforms (`x`, `y`, `scale`) — never layout properties
- Always respect `prefers-reduced-motion`
- TypeScript only — no `any` types
- Write descriptive commit messages

---

## 🗺 Roadmap

- [x] CLI — install components via `npx tweenlabs add`
- [x] Auto-detect package manager (npm, pnpm, yarn, bun)
- [x] Auto-install missing dependencies
- [x] Interactive component picker
- [x] `components.json` / path resolution
- [x] 22 production-ready GSAP components
- [x] AI Playground (Beta)
- [ ] Export as npm package (`@tweenlabs/components`)
- [ ] Storybook integration for isolated component previews
- [ ] Unit tests for animation logic
- [ ] FLIP, Draggable, MorphSVG animation patterns
- [ ] Community showcase gallery
- [ ] Animation starter templates for common use cases

---

## 📚 Learn More

New to GSAP? These resources pair perfectly with this repo:

- [GSAP Official Docs](https://gsap.com/docs/) — start here
- [GSAP + React Guide](https://gsap.com/resources/React/) — useGSAP hook
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — scroll animations
- [Next.js Docs](https://nextjs.org/docs) — framework reference
- [Lenis Docs](https://github.com/darkroom-digital/lenis) — smooth scroll setup

---

## 📜 License

[MIT](LICENSE) — free to use in personal and commercial projects.

---

## 🌟 Contributors

<!-- Add contributor grid here once you have 5+ contributors -->

---

**Built in public. Animated with love. Open to all. 🚀**

<!--
SEARCH TAGS (do not remove — improves GitHub discoverability):
tweenlabs, gsap animation library, gsap component library, gsap nextjs, gsap react components,
open source animation, web animation components, lenis smooth scroll, scrolltrigger examples,
next.js animation, gsap copy paste components, gsap learning, gsap playground
-->
