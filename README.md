<!-- SEO Meta Block — paste this in your Next.js layout.tsx or head -->
<!--
title: TweenLabs — Premium Open Source GSAP Component Library for Next.js
description: A free, open-source GSAP animation component library and UI template sandbox built with Next.js 16, React 19, and Lenis. Learn and build modern web animations with reusable, copy-paste ready components.
keywords: TweenLabs, GSAP component library, GSAP Next.js, GSAP animations React, open source animation library, web animation components, Lenis smooth scroll, GSAP ScrollTrigger components, Next.js animation library
-->

# <img src="https://raw.githubusercontent.com/TweenLabs/TweenLabs/master/public/logo.svg" alt="TweenLabs Logo" width="40" height="40" align="center" /> TweenLabs

> The open-source **GSAP animation component library** for Next.js developers — learn, copy, and contribute modern web animation patterns built with **GSAP 3.15**, **Next.js 16**, and **Lenis**.

**[Live Demo](https://tweenlabs.xyz)** • **[Contributing Guide](#contributing)** • **[Roadmap](#roadmap)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![npm](https://img.shields.io/npm/v/tweenlabs?style=flat-square&color=CB3837)

<!-- [Contributors](https://img.shields.io/github/contributors/TweenLabs/TweenLabs?style=flat-square) -->

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

  [1]  .                   All Components
  [2]  gravity-drop        Physics-based falling animations with realistic bounce
  [3]  scroll-assembly     Content reveals synced with scroll position
  [4]  border-reveal       Inward/outward border animations
  ...

👉 Enter the number of the component to add (1-8):
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

## ✨ Animation Components

| Component | Description | GSAP Features Used |
|-----------|-------------|-------------------|
| **Gravity Drop** | Physics-based falling animations with realistic bounce | `gsap.to`, `ease`, stagger |
| **Scroll-Triggered Assemblies** | Content reveals synced with scroll position | ScrollTrigger |
| **Border Reveal Effects** | Inward/outward border animations | Timeline, `clipPath` |
| **Horizontal Card Showcase** | Smooth carousel and card transitions | ScrollTrigger, `x` transforms |
| **Page Transitions** | Seamless route change animations | Timeline, Next.js router |
| **Smooth Scrolling** | Native-feel smooth scroll | Lenis + GSAP ticker |

> More components added with every contribution. [See full list →](https://tweenlabs.xyz)

---

## 🛠 Tech Stack

- **[Next.js 16](https://nextjs.org/)** – React framework with SSR and App Router
- **[GSAP 3.15](https://gsap.com/)** – Industry-standard JavaScript animation library
- **[React 19](https://react.dev/)** – Modern component-based UI
- **[Lenis 1.3](https://github.com/darkroom-digital/lenis)** – Buttery smooth scroll
- **[Tailwind CSS 4](https://tailwindcss.com/)** – Utility-first styling
- **[TypeScript](https://www.typescriptlang.org/)** – Full type safety

---

## 🚀 Quick Start (Playground)

Want to run the full TweenLabs playground locally?

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Clone and run
git clone https://github.com/TweenLabs/TweenLabs.git
cd TweenLabs
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — pick any animation card and start exploring.

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

- Follow the folder pattern: `src/app/XX-component-name/`
- Include a `page.tsx` with your animation
- Add inline comments explaining the GSAP logic
- Reference `gsapskills.md` for best practices

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
- [Lenis Docs](https://lenis.studiofreight.com/) — smooth scroll setup

---

## 📜 License

[MIT](LICENSE) — free to use in personal and commercial projects.

---

## 🌟 Contributors

Thanks to everyone building this together. ❤️

<!-- Add contributor grid here once you have 5+ contributors -->

---

**Built in public. Animated with love. Open to all. 🚀**

<!-- 
SEARCH TAGS (do not remove — improves GitHub discoverability):
tweenlabs, gsap animation library, gsap component library, gsap nextjs, gsap react components,
open source animation, web animation components, lenis smooth scroll, scrolltrigger examples,
next.js animation, gsap copy paste components, gsap learning, gsap playground
-->
