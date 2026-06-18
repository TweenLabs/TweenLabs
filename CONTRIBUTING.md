# Contributing to TweenLabs

Thank you for your interest in contributing to TweenLabs! We welcome animations, optimizations, bug fixes, and general improvements to this sandbox repository. 

By contributing, you help make this playground a premium, production-ready resource for the entire front-end community.

---

## 🛠️ Local Development Setup

To get started, follow these instructions to set up the codebase on your local machine:

1. **Fork the Repository**: Click the **Fork** button at the top-right of this repository's GitHub page.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/your-username/gsap-playground.git
   cd gsap-playground
   ```
3. **Install Dependencies**: We use `pnpm` as the primary package manager. Run:
   ```bash
   pnpm install
   ```
4. **Run the Development Server**:
   ```bash
   pnpm dev
   ```
5. **Open Sandbox Dashboard**: Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🎨 Architectural Guidelines

To maintain the high-fidelity standard of this repository, all contributions must adhere to the following principles:

### 1. Single-File Portability (Strict)
Every new animation route/component **must be entirely self-contained** within its own directory and single `page.tsx` file under `/src/app/` (e.g. `/src/app/19-your-creative-animation/page.tsx`).
*   **No local helper imports**: Do not import helper files from other route directories.
*   **Zero local CSS/CSS modules**: All styles must be styled inline using Tailwind utility classes or custom tailwind.config features, or standard global CSS classes if they are in `globals.css`.
*   **Self-Contained Sub-components**: If your animation uses sub-components (like a card item or button widget), define them inside the *same* `page.tsx` file.
*   **Asset Management**: If you require images/icons, place them in `/public/` and reference them using absolute URLs (e.g., `/my-asset.svg`).

### 2. GSAP Implementation Standards
*   Use the `@gsap/react` hook (`useGSAP`) rather than raw `useEffect` blocks to manage animation lifecycles.
*   Always scope animations to a parent element using the `scope` parameter in `useGSAP`.
*   Clean up event listeners, hover states, and temporary DOM elements on component unmount.
*   If you define GSAP callbacks that read or write component state or refs, use a standard function structure and wrap inside `contextSafe` internally rather than declaring the hook wrapper directly on render.

### 3. Design Aesthetics
*   We target a clean, modern **Neo-Brutalist** or high-fidelity **glassmorphic** look.
*   Use custom curated colors matching the playground design system (e.g., `bg-wtf-orange`, `bg-wtf-green`, `bg-wtf-yellow`, `bg-wtf-purple`, `bg-wtf-blue`).
*   Incorporate thick dark borders (`border-3 border-[#2a2a2a]`), offset drop shadows (`shadow-[4px_4px_0px_#2a2a2a]`), and monospace font accents where appropriate.

---

## 🍴 Contribution Workflow

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-awesome-animation
   ```
2. **Implement & Test**: Write your self-contained React page inside `/src/app/`. Make sure your new route is accessible!
3. **Validate Code Cleanliness (Required)**: Before committing, ensure the linter runs cleanly and the TypeScript compiler compiles without error:
   ```bash
   pnpm lint
   pnpm build
   ```
   *We will not merge PRs that fail CI builds or contain ESLint warnings.*
4. **Commit Changes**: Use clean, descriptive commit messages:
   ```bash
   git commit -m "feat: add interactive mouse-inertia coverflow carousel"
   ```
5. **Push and Submit**: Push to your fork and submit a Pull Request (PR) to our `master` branch.

---

## 🤝 Code of Conduct
Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.
