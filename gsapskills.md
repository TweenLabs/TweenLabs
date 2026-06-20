# GSAP Agent Skills Reference

This document serves as a prompt helper/reference for AI coding assistants (like Antigravity, Claude Code, Cline, etc.) working on this project. By referencing these local paths, the agent can use best practices for GSAP animations without wasting tokens downloading or re-reading rules.

## Local Installation Path
The GSAP skills are installed locally on the system at:
`C:\Users\rox\.agents\skills\`

---

## Available GSAP Skills & Rules

### 1. Core Animations (`gsap-core`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-core\`
- **Key Guidelines:** Basics of tweens, proper easing functions (e.g., `"power2.out"`), and avoiding plain string ease definitions. Ensure staggers are configured efficiently.

### 2. Timelines (`gsap-timeline`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-timeline\`
- **Key Guidelines:** Creating nested timelines, sequencing, and using relative labels (`"<"` or `"+=0.5"`) instead of absolute delays.

### 3. ScrollTrigger (`gsap-scrolltrigger`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-scrolltrigger\`
- **Key Guidelines:** Implementing scroll-driven animations, pinning, scroll scrub, toggleActions, and optimizing scroll performance. Ensure correct cleanup of ScrollTrigger instances when components unmount.

### 4. Next.js & TypeScript Integration (`gsap-react` & `gsap-frameworks`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-react\` & `gsap-frameworks\`
- **Key Guidelines:** Integrating GSAP with Next.js and TypeScript correctly:
  - **SSR Safety:** Next.js is SSR-by-default. Any component using GSAP must include the `"use client"` directive at the top.
  - **Use `useGSAP()` Hook:** Always use the `@gsap/react` hook `useGSAP()` for context/scope-safe animations.
  - **Strict Mode Compatibility:** Avoid using standard `useEffect` for GSAP initialization to prevent double-initialization bugs in Next.js/React Strict Mode.
  - **TypeScript Typing:**
    - Type DOM container refs properly, e.g., `const container = useRef<HTMLDivElement>(null);`.
    - Pass the typed scope ref to the hook: `useGSAP(() => { ... }, { scope: container });`.
    - Type persistent timelines correctly: `const tl = useRef<gsap.core.Timeline | null>(null);`.

### 5. Performance Optimization (`gsap-performance`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-performance\`
- **Key Guidelines:** Animating CSS transforms (`x`, `y`, `rotation`, `scale`) instead of layout properties (`top`, `left`, `width`, `height`). Utilizing `autoAlpha` instead of `opacity` for performance and hiding invisible elements.

### 6. Plugins (`gsap-plugins`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-plugins\`
- **Key Guidelines:** Configuration and usage of GSAP plugins (e.g., DrawSVG, SplitText, MotionPath).

### 7. Frameworks & Next.js Specifics (`gsap-frameworks`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-frameworks\`
- **Key Guidelines:** Framework integrations. For Next.js, ensure any registry and plugin registration (`gsap.registerPlugin(...)`) only runs on the client-side, and ensure animations target hydration-safe elements.

### 8. Utilities (`gsap-utils`)
- **Location:** `C:\Users\rox\.agents\skills\gsap-utils\`
- **Key Guidelines:** Leveraging GSAP utility methods (e.g., `gsap.utils.mapRange()`, `gsap.utils.interpolate()`).

### 9. Component Portability & Reusability
- **Key Guidelines:** Making sandbox components 100% self-contained and ready to copy-paste or download.
  - **Zero Global CSS Dependencies:** Do not rely on custom classes declared in `globals.css` (e.g., `.dot-grid`, `.brutalist-btn`, `.tilt-right`). All custom styling, background patterns, or visual elements must be inlined or designed with standard Tailwind utility classes.
  - **Zero Tailwind Config Dependencies:** Avoid custom theme colors (like `bg-wtf-orange`, `wtf-yellow`) or custom shadow/border definitions. Use exact hex values (e.g., `bg-[#e55b3c]`, `bg-[#f1b333]`, `shadow-[4px_4px_0px_#2a2a2a]`) to ensure the file runs cleanly in projects using standard Tailwind configurations.
  - **Self-Contained Sub-components:** Define all helper components or utility functions inside the same page/component file.
  - **Asset Portability:** Use robust fallback elements (like standard inline SVGs or public placeholders) for icons or images so they don't break when downloaded.

---

## AI Agent Instruction
> [!IMPORTANT]
> **AI Coding Agent:** When writing, editing, or refactoring animations in this project, do not make network requests or guess the rules. Refer directly to the Markdown guidelines located in the local folders above to ensure clean, performant, and standard-compliant GSAP code. All sandbox pages/components must adhere strictly to the **Component Portability & Reusability** guidelines to guarantee single-file compatibility upon download.
