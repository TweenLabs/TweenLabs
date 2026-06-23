# Contribution Guide — TweenLabs

Thank you for your interest in contributing to TweenLabs! We welcome animations, optimizations, bug fixes, and general improvements to this repository.

By contributing, you help make this playground a premium, production-ready resource for the entire front-end community.

---

## 🛠️ Local Development Setup

1. **Fork the Repository**: Click the **Fork** button at the top-right of this repository's GitHub page.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/your-username/TweenLabs.git
   cd TweenLabs
   ```
3. **Install Dependencies**: We use `pnpm` as the primary package manager:
   ```bash
   pnpm install
   ```
4. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   *(Running `pnpm convex dev` for the first time will auto-generate your Convex variables).*
5. **Run the Development Server**:
   ```bash
   pnpm dev
   ```
6. **Open the App**: Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🎨 Architectural Guidelines

### 1. Single-File Portability (Strict)

Every new animation **must be entirely self-contained** within its own directory under `src/app/(main)/components/YourComponent/page.tsx`.

- **No local helper imports**: Do not import helper files from other route directories.
- **Zero external stylesheet dependencies**: Do not rely on custom classes declared in `globals.css` (like `.dot-grid`, `.brutalist-btn`). Use inline styles or standard Tailwind utility classes.
- **Zero tailwind.config overrides**: Do not use custom theme colors (like `bg-wtf-orange`). Use exact hex values instead (e.g. `bg-[#e55b3c]`).
- **Self-Contained Sub-components**: If your animation uses sub-components, define them inside the same `page.tsx` file.
- **Asset Management**: Place images/icons in `/public/` and reference them using absolute paths (e.g. `/my-asset.svg`), or use inline SVGs.

### 2. Registering Your Component

After creating your `page.tsx`, register the component in `src/data/components.ts`:

```ts
{
  id: "your-animation",              // Unique kebab-case slug (NOT a number)
  name: "Your Animation",            // Display name
  componentName: "YourAnimation",    // PascalCase — must match folder name
  route: "/components/YourAnimation",
  bgColor: "bg-wtf-green",           // Badge color (6 options, see below)
  textColor: "text-white",           // "text-white" or "text-black"
  description: "One sentence describing what this animation does.",
  tiltClass: "tilt-left",            // "tilt-left" or "tilt-right"
  type: ["card", "scroll"],          // Categories: "text" | "scroll" | "card" | "interactive"
  preview: "/previews/YourAnimation.webp",  // Optional: static thumbnail
  embedInteraction: "scroll",        // Optional: "scroll" | "cursor" | "tabs" | "click-sequence"
}
```

> [!NOTE]
> Always use a unique kebab-case slug for `id` (e.g. `"your-animation"`), **not** a sequential number. This prevents merge conflicts. The visual serial numbers (`[01]`, `[02]`, etc.) are computed dynamically.

**Available palette colors:** `bg-wtf-green`, `bg-wtf-orange`, `bg-wtf-purple`, `bg-wtf-blue`, `bg-wtf-yellow`, `bg-wtf-red`

### 3. Preview Image (Optional but Recommended)

Capture a screenshot and save as `public/previews/YourAnimation.webp`:
- Format: `.webp` preferred
- Size: ~800×450px (16:9 aspect ratio)
- If omitted, a "Hover to preview" placeholder is shown automatically

### 4. Preview Interaction Mode

Set `embedInteraction` to control the card hover preview:

| Value | Use When |
|---|---|
| `"scroll"` (default) | ScrollTrigger components, long pages |
| `"cursor"` | Mouse-dependent effects (FluidCursor, BentoGrid, KineticText) |
| `"tabs"` | Tab switching UIs (TabsMotion) |
| `"click-sequence"` | Click-based reveals (Accordion) |

### 5. GSAP Implementation Standards

- Use the `@gsap/react` hook (`useGSAP`) rather than raw `useEffect` blocks.
- Always scope animations to a parent element using the `scope` parameter.
- Clean up event listeners, hover states, and temporary DOM elements on unmount.
- Use `contextSafe` for GSAP callbacks that reference component state or refs.

### 6. Design Aesthetics

- Target a clean, modern **Neo-Brutalist** or high-fidelity look.
- Use our sandbox color palette: Orange `#e55b3c`, Green `#0c9367`, Yellow `#f1b333`, Purple `#6758a5`, Blue `#3b82f6`.
- Incorporate thick dark borders (`border-2 border-[#2a2a2a]`), offset drop shadows (`shadow-[4px_4px_0px_#2a2a2a]`), and monospace font accents.

---

## 🍴 Contribution Workflow

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-animation-name
   ```
2. **Implement & Test**: Write your self-contained React page inside `src/app/(main)/components/YourAnimation/page.tsx`.
3. **Add Registration**: Add your component entry to `src/data/components.ts`.
4. **Add Preview Image**: Save a `.webp` screenshot to `public/previews/YourAnimation.webp`.
5. **Validate Code Cleanliness (Required)**:
   ```bash
   pnpm lint
   pnpm build
   ```
   *We will not merge PRs that fail CI builds or contain lint warnings.*
6. **Commit Changes**: Use clean, descriptive commit messages:
   ```bash
   git commit -m "feat: add [animation name]"
   ```
7. **Push and Submit**: Push to your fork and submit a Pull Request (PR) to our `master` branch.

---

## ✅ What's Automatic (You Don't Need To Touch)

Once you add the folder + data entry, these update automatically:

| Feature | How |
|---|---|
| Home page cards | Reads `animations` array from `components.ts` |
| Components page | Reads `animations` array with filter/search |
| Card numbering | Computed from array index: `[01]`, `[02]`, etc. |
| Badge color name | Auto-derived: `"bg-wtf-green"` → shows `GREEN` |
| Preview iframe | URL auto-built: `/preview/{componentName}?embed=true` |
| Category filters | Based on `type[]` field |
| CLI installation | Reads from API registry automatically |

---

## ✅ Good First Contributions

- Add explanatory comments to existing animations
- Test on mobile/tablet and report issues
- Create animation variants with different easing curves
- Improve accessibility (`prefers-reduced-motion`, ARIA roles)
- Write or improve documentation

---

## 📐 Code Guidelines

- Use CSS transforms (`x`, `y`, `scale`) — never layout properties for animation
- Always respect `prefers-reduced-motion`
- TypeScript only — no `any` types
- Write descriptive commit messages
- Keep components focused and self-contained

---

## 🤝 Code of Conduct

Be kind, be constructive. We're all here to learn and build something great together. Discriminatory or disrespectful behavior will not be tolerated.

---

**Built in public. Animated with love. Open to all. 🚀**
