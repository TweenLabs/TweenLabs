"use client";

/* ─────────────────────────── palette ─────────────────────────── */
const PALETTE: { name: string; hex: string }[] = [
  { name: "green",  hex: "#0c9367" },
  { name: "orange", hex: "#e55b3c" },
  { name: "purple", hex: "#6758a5" },
  { name: "blue",   hex: "#3b82f6" },
  { name: "yellow", hex: "#f1b333" },
  { name: "red",    hex: "#c23b3a" },
];

/* ─────────────────────────── sub-components ─────────────────────────── */

function Badge({ children, bg, color = "white" }: { children: React.ReactNode; bg: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-widest border-2"
      style={{ backgroundColor: bg, color, borderColor: bg }}
    >
      {children}
    </span>
  );
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-[#2a2a2a] rounded-xl bg-white shadow-[4px_4px_0px_#2a2a2a] overflow-hidden w-full">
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 border-[#2a2a2a] bg-[#f0eadf]">
        <span className="text-base sm:text-lg leading-none">{emoji}</span>
        <h2 className="font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest text-[#2a2a2a]">
          {title}
        </h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[#1e1e1e] text-[#e5e5e5] rounded-lg p-3 sm:p-4 text-[10px] sm:text-[11px] font-mono leading-relaxed overflow-x-auto border-2 border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] my-3 whitespace-pre-wrap break-all sm:break-normal">
      <code>{children}</code>
    </pre>
  );
}

function Inline({ children }: { children: string }) {
  return (
    <code className="bg-[#f0eadf] border border-[#2a2a2a]/30 px-1.5 py-0.5 rounded font-mono text-[10px] sm:text-[11px] text-[#2a2a2a] break-all">
      {children}
    </code>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 sm:gap-4 py-4 border-b border-dashed border-[#2a2a2a]/20 last:border-0">
      <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center font-mono font-black text-[10px] sm:text-[11px]">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif font-black text-[12px] sm:text-[13px] text-[#2a2a2a] mb-1">{title}</p>
        <div className="text-[11px] sm:text-[12px] text-zinc-600 font-sans leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-dashed border-[#2a2a2a]/15 last:border-0">
      <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 border-[#0c9367] bg-[#0c9367]/10 flex items-center justify-center">
        <span className="text-[#0c9367] text-[8px] font-black">✓</span>
      </span>
      <p className="text-[11px] sm:text-[12px] font-sans text-zinc-700 leading-relaxed">{children}</p>
    </div>
  );
}

function Guideline({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-dashed border-[#2a2a2a]/15 pt-5 first:border-0 first:pt-0">
      <p className="font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest text-[#2a2a2a] mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded bg-[#2a2a2a] text-white text-[9px] font-black flex items-center justify-center shrink-0">
          {num}
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-[#fff8e6] border-2 border-[#f1b333] rounded-lg p-3 my-3">
      <span className="text-sm shrink-0">⚠️</span>
      <p className="text-[11px] sm:text-[12px] font-sans text-[#2a2a2a] leading-relaxed">{children}</p>
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function ContributePageClient() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-24 pb-20">

        {/* ── Hero ── */}
        <div className="mb-8 sm:mb-10 border-b-3 border-[#2a2a2a] pb-6 sm:pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge bg="#e55b3c">Open Source</Badge>
            <Badge bg="#0c9367">Community Driven</Badge>
            <Badge bg="#6758a5">MIT License</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none mb-3">
            Contribution to<br />
            <span className="text-[#e55b3c]">TweenLabs</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl">
            Help us build the best open-source GSAP component library for Next.js developers.
            We welcome animations, bug fixes, docs, and improvements of all kinds.
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-5">
            <a
              href="https://github.com/TweenLabs/TweenLabs/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-black text-[#2a2a2a] border-2 border-[#2a2a2a] bg-white rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#2a2a2a] hover:bg-[#2a2a2a] hover:text-white transition-all active:translate-y-[1px] active:shadow-[1px_1px_0px_#2a2a2a]"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Fork on GitHub
            </a>
            <a
              href="https://github.com/TweenLabs/TweenLabs/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-black text-[#2a2a2a] border-2 border-[#2a2a2a] bg-white rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#2a2a2a] hover:bg-[#e55b3c] hover:text-white hover:border-[#e55b3c] transition-all active:translate-y-[1px] active:shadow-[1px_1px_0px_#2a2a2a]"
            >
              Open an Issue
            </a>
          </div>
        </div>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-5 sm:gap-6">

          {/* 1. Local Setup */}
          <Section emoji="🛠️" title="Local Development Setup">
            <Step num={1} title="Fork the Repository">
              Click the <strong>Fork</strong> button at the top-right of the{" "}
              <a href="https://github.com/TweenLabs/TweenLabs" target="_blank" rel="noopener noreferrer" className="text-[#e55b3c] underline underline-offset-2 font-bold">
                GitHub page
              </a>.
            </Step>
            <Step num={2} title="Clone your Fork">
              <CodeBlock>{`git clone https://github.com/your-username/TweenLabs.git\ncd TweenLabs`}</CodeBlock>
            </Step>
            <Step num={3} title="Install Dependencies">
              We use <strong>pnpm</strong> as the primary package manager.
              <CodeBlock>{`pnpm install`}</CodeBlock>
              <Note>Do not use npm or yarn — this repo uses a pnpm lockfile. Using a different package manager will cause lock file conflicts.</Note>
            </Step>
            <Step num={4} title="Start the Dev Server">
              <CodeBlock>{`pnpm dev`}</CodeBlock>
              Open{" "}
              <a href="http://localhost:3000" className="text-[#e55b3c] font-bold underline underline-offset-2">
                http://localhost:3000
              </a>{" "}
              and go to <Inline>/components</Inline> to browse all animations.
            </Step>
          </Section>

          {/* 2. Architectural Guidelines */}
          <Section emoji="🎨" title="Architectural Guidelines">
            <div className="space-y-5">

              <Guideline num="1" title="Single-File Portability (Strict)">
                <p className="text-[11px] sm:text-[12px] text-zinc-600 mb-2">
                  Every animation must be <strong>entirely self-contained</strong> in one folder:
                </p>
                <CodeBlock>{`src/app/(main)/components/YourAnimation/\n└── page.tsx   ← entire animation lives here`}</CodeBlock>
                <div className="mt-2 space-y-0.5">
                  {[
                    "No imports from other route directories",
                    "No custom classes from globals.css — inline Tailwind only",
                    "No custom tailwind theme values — use exact hex: bg-[#e55b3c] not bg-wtf-orange",
                    "Sub-components must be defined inside the same page.tsx",
                    "Images go in /public/ and referenced as absolute paths, or use inline SVGs",
                  ].map((r) => <Rule key={r}>{r}</Rule>)}
                </div>
              </Guideline>

              <Guideline num="2" title="Register Your Component">
                <p className="text-[11px] sm:text-[12px] text-zinc-600 mb-2">
                  Add an entry to <Inline>src/data/components.ts</Inline>:
                </p>
                <CodeBlock>{`{
  id: "23",                           // next sequential number as string
  name: "Your Animation",             // human-readable display name
  componentName: "YourAnimation",     // PascalCase — must match folder name exactly
  route: "/components/YourAnimation", // must match componentName
  bgColor: "bg-wtf-green",            // one of the six palette values below
  textColor: "text-white",            // text-white or text-black
  description: "One sentence describing what this animation does.",
  tiltClass: "tilt-left",             // tilt-left | tilt-right | tilt-left-lg | tilt-right-lg
}`}</CodeBlock>
                <p className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-2 mt-3">
                  Available bgColor values:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map(({ name, hex }) => (
                    <div
                      key={name}
                      className="flex items-center gap-1.5 border-2 border-[#2a2a2a] rounded-lg px-2 py-1 bg-white shadow-[1px_1px_0px_#2a2a2a] text-[9px] sm:text-[10px] font-mono font-black text-[#2a2a2a]"
                    >
                      <div className="w-3 h-3 rounded-full border border-[#2a2a2a] shrink-0" style={{ backgroundColor: hex }} />
                      bg-wtf-{name}
                    </div>
                  ))}
                </div>
                <Note>
                  The <strong>componentName</strong> must match your folder name exactly (PascalCase). Mismatches will cause 404 errors.
                </Note>
              </Guideline>

              <Guideline num="3" title="GSAP Implementation Standards">
                <div className="space-y-0.5">
                  {[
                    "Use useGSAP() from @gsap/react — not raw useEffect",
                    "Always pass a scope ref: useGSAP(() => { ... }, { scope: containerRef })",
                    "Clean up event listeners, timelines, and DOM mutations on unmount",
                    "Use contextSafe() for GSAP callbacks that read or write component state/refs",
                    "Register plugins (ScrollTrigger, etc.) at the top of the file — not inside hooks",
                  ].map((r) => <Rule key={r}>{r}</Rule>)}
                </div>
              </Guideline>

              <Guideline num="4" title="Design Aesthetics">
                <div className="space-y-0.5">
                  {[
                    "Target a Neo-Brutalist or high-fidelity modern look — no plain/flat designs",
                    "Thick dark borders: border-2 border-[#2a2a2a]",
                    "Offset drop shadows: shadow-[4px_4px_0px_#2a2a2a]",
                    "Monospace font accents for labels, badges, and IDs",
                    "Component must look polished on both desktop and mobile",
                  ].map((r) => <Rule key={r}>{r}</Rule>)}
                </div>
              </Guideline>

            </div>
          </Section>

          {/* 3. Contribution Workflow */}
          <Section emoji="🍴" title="Contribution Workflow">
            <Step num={1} title="Create a Feature Branch">
              <CodeBlock>{`git checkout -b feat/your-animation-name`}</CodeBlock>
            </Step>
            <Step num={2} title="Build Your Page">
              Create your file at:
              <CodeBlock>{`src/app/(main)/components/YourAnimation/page.tsx`}</CodeBlock>
              Then register it in <Inline>src/data/components.ts</Inline> so it appears in the sidebar and gallery.
            </Step>
            <Step num={3} title="Validate — Required Before Submitting">
              <CodeBlock>{`pnpm lint\npnpm build`}</CodeBlock>
              <Note>We will <strong>not merge</strong> PRs that fail CI or have ESLint / TypeScript errors. Fix all warnings first.</Note>
            </Step>
            <Step num={4} title="Commit with a Descriptive Message">
              <CodeBlock>{`git commit -m "feat: add [your animation name]"`}</CodeBlock>
              Use conventional commits: <Inline>feat:</Inline> for new components, <Inline>fix:</Inline> for bug fixes, <Inline>docs:</Inline> for documentation.
            </Step>
            <Step num={5} title="Push & Open a Pull Request">
              <CodeBlock>{`git push origin feat/your-animation-name`}</CodeBlock>
              Open a PR targeting the <Inline>master</Inline> branch. Include a short demo GIF or screenshot in your PR description.
            </Step>
          </Section>

          {/* 4. Good First Contributions */}
          <Section emoji="✅" title="Good First Contributions">
            <p className="text-[11px] sm:text-[12px] text-zinc-500 font-mono mb-3">New here? Start with these:</p>
            <div className="space-y-0.5">
              {[
                "Add inline comments to existing animations explaining the GSAP logic",
                "Test components on mobile and tablet — report or fix layout issues",
                "Create animation variants using different easing curves or timing",
                "Add prefers-reduced-motion support to existing components",
                "Fix typos or improve the documentation",
                "Report broken routes, missing assets, or console errors via GitHub Issues",
              ].map((r) => <Rule key={r}>{r}</Rule>)}
            </div>
          </Section>

          {/* 5. Code Guidelines */}
          <Section emoji="📐" title="Code Guidelines">
            <div className="space-y-0.5">
              {[
                "Use CSS transforms (x, y, scale, rotation) — never width/height/margin/padding for animation",
                "Always respect prefers-reduced-motion: wrap animations in a media query or GSAP matchMedia",
                "TypeScript only — no any types, no implicit any",
                "Write descriptive, conventional commit messages",
                "One animation concept per component — keep them focused",
                "Add comments above complex GSAP timelines or ScrollTrigger setups",
              ].map((r) => <Rule key={r}>{r}</Rule>)}
            </div>
          </Section>

          {/* 6. Code of Conduct */}
          <Section emoji="🤝" title="Code of Conduct">
            <p className="text-[11px] sm:text-[12px] text-zinc-600 leading-relaxed">
              Be kind, be constructive. We&apos;re all here to learn and build something great together.
              Discriminatory, harassing, or disrespectful behavior will not be tolerated in issues, PRs, or any community interaction.
            </p>
          </Section>

          {/* ── CTA ── */}
          <div className="border-2 border-[#2a2a2a] rounded-xl bg-[#2a2a2a] shadow-[4px_4px_0px_#e55b3c] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-mono font-black text-[10px] sm:text-[11px] uppercase tracking-widest text-[#f1b333] mb-1">Ready to ship?</p>
              <p className="font-serif font-black text-base sm:text-lg text-white leading-snug">
                Built in public.<br className="sm:hidden" /> Animated with love. Open to all.
              </p>
            </div>
            <a
              href="https://github.com/TweenLabs/TweenLabs/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 font-mono text-[10px] sm:text-[11px] font-black text-[#2a2a2a] bg-white border-2 border-white rounded-lg px-4 py-2.5 shadow-[2px_2px_0px_#e55b3c] hover:bg-[#e55b3c] hover:text-white hover:border-[#e55b3c] transition-all active:translate-y-[1px] active:shadow-[1px_1px_0px_#e55b3c]"
            >
              🚀 Fork & Start Contributing
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
