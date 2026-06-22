# Contributing to TweenLabs

Thank you for your interest in contributing to TweenLabs! We welcome animations, optimizations, bug fixes, and general improvements to this repository.

By contributing, you help make this playground a premium, production-ready resource for the entire front-end community.

---

## 🛠️ Local Development Setup

To get started, follow these instructions to set up the codebase on your local machine:

1. **Fork the Repository**: Click the **Fork** button at the top-right of this repository's GitHub page.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/your-username/TweenLabs.git
   cd TweenLabs
   ```
3. **Install Dependencies**: We use `pnpm` as the primary package manager. Run:
   ```bash
   pnpm install
   ```
4. **Run the Development Server**:
   ```bash
   pnpm dev
   ```
5. **Open the App**: Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Architectural Guidelines

To maintain the high-fidelity standard of this repository, all contributions must adhere to the following principles:

### 1. Single-File Portability (Strict)

Every new animation **must be entirely self-contained** within its own directory under `src/app/(main)/components/YourComponent/page.tsx`.

- **No local helper imports**: Do not import helper files from other route directories.
- **Zero external stylesheet dependencies**: Do not rely on custom classes declared in `globals.css` (like `.dot-grid`, `.brutalist-btn`). Any custom styling must be declared inline or via standard Tailwind utility classes.
- **Zero tailwind.config overrides**: Do not use custom theme colors (like `bg-wtf-orange`) that require changes to `tailwind.config.ts`. Use exact hex values instead (e.g. `bg-[#e55b3c]`).
- **Self-Contained Sub-components**: If your animation uses sub-components, define them inside the same `page.tsx` file.
- **Asset Management**: Place images/icons in `/public/` and reference them using absolute paths (e.g. `/my-asset.svg`), or use inline SVGs.

### 2. Registering Your Component

After creating your `page.tsx`, register the component in `src/data/components.ts`:

```ts
{
  id: "23",                          // next sequential number
  name: "Your Animation",            // display name
  componentName: "YourAnimation",    // PascalCase — matches folder name
  route: "/components/YourAnimation",
  bgColor: "bg-wtf-green",           // pick one of the palette colors
  textColor: "text-white",
  description: "One sentence describing what this animation does.",
  tiltClass: "tilt-left",            // tilt-left | tilt-right | tilt-left-lg | tilt-right-lg
}
```

**Available palette colors:** `bg-wtf-green`, `bg-wtf-orange`, `bg-wtf-purple`, `bg-wtf-blue`, `bg-wtf-yellow`, `bg-wtf-red`

### 3. GSAP Implementation Standards

- Use the `@gsap/react` hook (`useGSAP`) rather than raw `useEffect` blocks.
- Always scope animations to a parent element using the `scope` parameter in `useGSAP`.
- Clean up event listeners, hover states, and temporary DOM elements on unmount.
- Use `contextSafe` for GSAP callbacks that reference component state or refs.

### 4. Design Aesthetics

- Target a clean, modern **Neo-Brutalist** or high-fidelity look.
- Use our sandbox color palette: Orange `#e55b3c`, Green `#0c9367`, Yellow `#f1b333`, Purple `#6758a5`, Blue `#3b82f6`.
- Incorporate thick dark borders (`border-2 border-[#2a2a2a]`), offset drop shadows (`shadow-[4px_4px_0px_#2a2a2a]`), and monospace font accents where appropriate.

---

## 🍴 Contribution Workflow

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-animation-name
   ```
2. **Implement & Test**: Write your self-contained React page inside `src/app/(main)/components/YourAnimation/page.tsx`. Make sure your new route is accessible at `/components/YourAnimation`.
3. **Validate Code Cleanliness (Required)**: Before committing, ensure the linter runs cleanly:
   ```bash
   pnpm lint
   pnpm build
   ```
   *We will not merge PRs that fail CI builds or contain ESLint warnings.*
4. **Commit Changes**: Use clean, descriptive commit messages:
   ```bash
   git commit -m "feat: add [animation name]"
   ```
5. **Push and Submit**: Push to your fork and submit a Pull Request (PR) to our `master` branch.

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
