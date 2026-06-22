"use client";

import { useState } from "react";

/* ── tiny copy button (matches code page) ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded border transition-all cursor-pointer ${
        copied
          ? "bg-[#0c9367] text-white border-[#0c9367]"
          : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
      }`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/* ── Code page-style terminal with pkg-manager tabs in the header ── */
const PKG_CMDS = {
  cli: {
    npm:  (name: string) => `npx tweenlabs@latest add ${name}`,
    pnpm: (name: string) => `pnpm dlx tweenlabs@latest add ${name}`,
    yarn: (name: string) => `yarn dlx tweenlabs@latest add ${name}`,
    bun:  (name: string) => `bunx tweenlabs@latest add ${name}`,
  },
  install: {
    npm:  "npm install gsap @gsap/react",
    pnpm: "pnpm add gsap @gsap/react",
    yarn: "yarn add gsap @gsap/react",
    bun:  "bun add gsap @gsap/react",
  },
};

type PkgId = "npm" | "pnpm" | "yarn" | "bun";

function CliTerminal({ name, pkg, setPkg }: { name: string; pkg: PkgId; setPkg: (p: PkgId) => void }) {
  const cmd = PKG_CMDS.cli[pkg](name);
  return (
    <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a] w-full max-w-lg">
      <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-3 py-2 flex items-center justify-between font-mono text-zinc-400 select-none">
        <div className="flex gap-1.5">
          {(["npm", "pnpm", "yarn", "bun"] as PkgId[]).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setPkg(pm)}
              className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-none cursor-pointer ${
                pkg === pm ? "bg-[#e55b3c] text-white" : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {pm === "npm" ? "npx" : pm}
            </button>
          ))}
        </div>
        <CopyBtn text={cmd} />
      </div>
      <div className="p-3 font-mono text-[11px] text-emerald-400 select-all overflow-x-auto leading-relaxed whitespace-pre">
        {cmd}
      </div>
    </div>
  );
}

function InstallTerminal({ pkg, setPkg }: { pkg: PkgId; setPkg: (p: PkgId) => void }) {
  const cmd = PKG_CMDS.install[pkg];
  return (
    <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a] w-full max-w-lg">
      <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-3 py-2 flex items-center justify-between font-mono text-zinc-400 select-none">
        <div className="flex gap-1.5">
          {(["npm", "pnpm", "yarn", "bun"] as PkgId[]).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setPkg(pm)}
              className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-none cursor-pointer ${
                pkg === pm ? "bg-[#e55b3c] text-white" : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
        <CopyBtn text={cmd} />
      </div>
      <div className="p-3 font-mono text-[11px] text-emerald-400 select-all overflow-x-auto leading-relaxed whitespace-pre">
        {cmd}
      </div>
    </div>
  );
}

/* ── plain dark terminal (no tabs) ── */
function PlainTerminal({ label, children }: { label?: string; children: string }) {
  return (
    <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a] w-full max-w-lg">
      <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-3 py-2 flex items-center justify-between font-mono text-zinc-400 select-none">
        <span className="text-[9px] uppercase tracking-widest text-zinc-500">{label ?? "terminal"}</span>
        <CopyBtn text={children} />
      </div>
      <div className="p-3 font-mono text-[11px] text-emerald-400 select-all overflow-x-auto leading-relaxed whitespace-pre">
        {children}
      </div>
    </div>
  );
}

/* ── inline code ── */
function Code({ children }: { children: string }) {
  return (
    <code className="bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold text-[#e55b3c]">
      {children}
    </code>
  );
}

/* ── section divider ── */
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-[#2a2a2a]/12" />
      <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</span>
      <div className="flex-1 h-px bg-[#2a2a2a]/12" />
    </div>
  );
}

/* ── step number badge ── */
function StepBadge({ n, color }: { n: number; color: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-mono font-black text-[11px] shrink-0 border-2 border-[#2a2a2a] shadow-[1.5px_1.5px_0px_#2a2a2a] mr-2.5"
      style={{ backgroundColor: color }}
    >
      {n}
    </span>
  );
}

type Method = "cli" | "manual";

/* ════════════════════════════════════════════ */
export default function InstallationPageClient() {
  const [method, setMethod] = useState<Method>("cli");
  const [pkg, setPkg] = useState<PkgId>("npm");

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 pb-24">

        {/* ── PAGE TITLE ── */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 border-[#2a2a2a] bg-white text-[#2a2a2a]">TweenLabs</span>
            <span className="font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 border-[#0c9367] bg-[#0c9367] text-white">MIT License</span>
          </div>
          <h1 className="font-serif font-black text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.9] tracking-tight text-[#2a2a2a] mb-4">
            Installation <span className="text-[#0c9367]">&amp; Setup</span>
          </h1>
          <p className="font-sans text-[13px] sm:text-[14px] text-zinc-500 leading-relaxed max-w-[52ch]">
            Pick any animation from the gallery. Install it in seconds via the CLI, or copy-paste it manually — no build step, no config.
          </p>
        </div>

        <div className="h-px bg-[#2a2a2a]/12 mb-8" />

        {/* ── METHOD TABS ── */}
        <div className="flex gap-1.5 mb-8 p-1 bg-white rounded-xl border-2 border-[#2a2a2a] shadow-[3px_3px_0px_#2a2a2a] w-fit">
          {(["cli", "manual"] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`font-mono font-black text-[10px] uppercase tracking-widest px-5 py-2 rounded-lg transition-all cursor-pointer ${
                method === m
                  ? "bg-[#2a2a2a] text-white shadow-[1px_1px_0px_#555]"
                  : "text-zinc-400 hover:text-[#2a2a2a]"
              }`}
            >
              {m === "cli" ? "⚡ CLI" : "📋 Manual"}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            CLI METHOD
        ══════════════════════════════════════════ */}
        {method === "cli" && (
          <div>
            <p className="font-sans text-[13px] text-zinc-500 leading-relaxed mb-6 max-w-[52ch]">
              The TweenLabs CLI installs any component directly into your project with a single command. It downloads the file and all required dependencies automatically.
            </p>

            {/* Step 1 */}
            <div className="mb-7">
              <h2 className="font-serif font-black text-[15px] text-[#2a2a2a] flex items-center mb-2">
                <StepBadge n={1} color="#0c9367" />
                Run the CLI
              </h2>
              <p className="font-sans text-[12.5px] text-zinc-500 mb-3 ml-[34px]">
                Replace <Code>ComponentName</Code> with the exact name from the gallery (e.g. <Code>KineticText</Code>, <Code>FlipCards</Code>, <Code>MorphingText</Code>).
              </p>
              <div className="ml-[34px]">
                <CliTerminal name="ComponentName" pkg={pkg} setPkg={setPkg} />
              </div>
              <p className="flex items-start gap-2 text-[11.5px] font-sans text-zinc-500 leading-relaxed mt-2 ml-[34px]">
                <span className="text-[#f1b333] shrink-0">→</span>
                No global install needed — the runner fetches the latest version every time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="mb-7">
              <h2 className="font-serif font-black text-[15px] text-[#2a2a2a] flex items-center mb-2">
                <StepBadge n={2} color="#0c9367" />
                Done
              </h2>
              <p className="font-sans text-[12.5px] text-zinc-500 ml-[34px] leading-relaxed">
                The CLI places the component file in your project and installs <Code>gsap</Code> and <Code>@gsap/react</Code> if they aren&apos;t already present. Import and use it immediately.
              </p>
            </div>

            {/* CLI Notice */}
            <div className="ml-[34px] mb-7 p-3.5 border-2 border-[#2a2a2a] bg-amber-50/70 text-amber-900 rounded-lg shadow-[2.5px_2.5px_0px_#2a2a2a] flex gap-2.5 max-w-lg">
              <span className="text-base select-none shrink-0">⚠️</span>
              <div>
                <div className="font-mono font-black text-[10px] uppercase tracking-wider mb-1">CLI Notice</div>
                <p className="font-sans text-[11.5px] leading-relaxed">
                  Run in your project&apos;s root directory. The CLI creates the file under{" "}
                  <code className="bg-amber-100/50 px-1 py-0.5 border border-amber-300 rounded font-mono text-[10px] font-bold text-[#e55b3c]">
                    src/components/tweenlabs/
                  </code>{" "}
                  and resolves dependencies automatically.
                </p>
              </div>
            </div>
    
            <Divider label="Examples &amp; Requirements" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-7 items-start">

              {/* Examples column */}
              <div>
                <p className="font-mono font-black text-[9px] uppercase tracking-widest text-zinc-400 mb-3">Examples</p>
                <div className="space-y-2.5">
                  {[
                    { name: "KineticText",  desc: "Wave text animation" },
                    { name: "FlipCards",    desc: "3D flip card grid" },
                    { name: "MorphingText", desc: "Colour-morphing headline" },
                    { name: "ScrollCards",  desc: "Scroll-pinned card deck" },
                  ].map(({ name, desc }) => (
                    <div key={name} className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a]">
                      <div className="bg-[#181818] border-b border-white/10 px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-black text-[12px] text-white">{name}</span>
                          <span className="font-sans text-[10px] text-zinc-500">{desc}</span>
                        </div>
                        <CopyBtn text={PKG_CMDS.cli[pkg](name)} />
                      </div>
                      <div className="px-3 py-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-nowrap">
                        {PKG_CMDS.cli[pkg](name)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements column */}
              <div>
                <p className="font-mono font-black text-[9px] uppercase tracking-widest text-zinc-400 mb-3">Requirements</p>
                <div className="bg-white border-2 border-[#2a2a2a] rounded-xl p-5 shadow-[3px_3px_0px_#2a2a2a] space-y-3">
                  {[
                    ["Node.js 18+", <><span className="text-zinc-500">check with </span><Code>node --version</Code></>],
                    ["Next.js App Router", "components use the App Router file convention"],
                    ["Tailwind CSS", "all styles use inline Tailwind classes"],
                    ["TypeScript", "components are fully typed"],
                    ["pnpm (recommended)", <><span className="text-zinc-500">install via </span><Code>npm i -g pnpm</Code></>],
                    ["Git", "for cloning and version control"],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex gap-3 text-[12.5px] font-sans leading-relaxed border-b border-dashed border-[#2a2a2a]/10 pb-3 last:border-0 last:pb-0">
                      <span className="font-mono font-black text-[#0c9367] shrink-0">✓</span>
                      <span><strong className="text-[#2a2a2a]">{title as string}</strong> — {desc as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            MANUAL METHOD
        ══════════════════════════════════════════ */}
        {method === "manual" && (
          <div>
            <p className="font-sans text-[13px] text-zinc-500 leading-relaxed mb-6 max-w-[52ch]">
              No CLI, no magic. Browse the gallery, open any animation&apos;s <strong className="text-[#2a2a2a]">Code</strong> tab, and paste it straight into your project.
            </p>

            {/* Step 1 */}
            <div className="mb-7">
              <h2 className="font-serif font-black text-[15px] text-[#2a2a2a] flex items-center mb-2">
                <StepBadge n={1} color="#e55b3c" />
                Install GSAP
              </h2>
              <p className="font-sans text-[12.5px] text-zinc-500 mb-3 ml-[34px]">
                Every TweenLabs animation only needs these two packages.
              </p>
              <div className="ml-[34px]">
                <InstallTerminal pkg={pkg} setPkg={setPkg} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-7">
              <h2 className="font-serif font-black text-[15px] text-[#2a2a2a] flex items-center mb-2">
                <StepBadge n={2} color="#e55b3c" />
                Copy the component
              </h2>
              <div className="ml-[34px] space-y-2.5 font-sans text-[12.5px] text-zinc-600 leading-relaxed">
                <p>1. Open any component from the <a href="/components" className="text-[#e55b3c] font-bold underline underline-offset-2">Components</a> gallery.</p>
                <p>2. Click the <strong className="text-[#2a2a2a]">Code</strong> tab at the top of the preview.</p>
                <p>3. Copy the entire file and paste it into a new file in your project, for example:</p>
                <PlainTerminal label="path">{"src/app/animations/KineticText/page.tsx"}</PlainTerminal>
                <p className="flex items-start gap-2 text-zinc-500">
                  <span className="text-[#f1b333] shrink-0">→</span>
                  Each component is 100% self-contained — no imports from other TweenLabs files.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-7">
              <h2 className="font-serif font-black text-[15px] text-[#2a2a2a] flex items-center mb-2">
                <StepBadge n={3} color="#e55b3c" />
                Add <Code>&quot;use client&quot;</Code> at the top
              </h2>
              <div className="ml-[34px]">
                <p className="font-sans text-[12.5px] text-zinc-500 mb-3">
                  GSAP requires a browser environment. Every animation file must be a Client Component.
                </p>
                <PlainTerminal label="tsx">{`"use client";\n\nimport gsap from "gsap";\nimport { useGSAP } from "@gsap/react";\n// ... rest of your component`}</PlainTerminal>
              </div>
            </div>

            {/* Step 4 */}
            <div className="mb-7">
              <h2 className="font-serif font-black text-[15px] text-[#2a2a2a] flex items-center mb-2">
                <StepBadge n={4} color="#e55b3c" />
                You&apos;re done
              </h2>
              <p className="font-sans text-[12.5px] text-zinc-500 ml-[34px] leading-relaxed">
                Navigate to the route in your browser. The animation runs immediately — no extra config needed.
              </p>
            </div>

            <Divider label="Rules" />

            <div className="bg-white border-2 border-[#2a2a2a] rounded-xl p-5 shadow-[3px_3px_0px_#2a2a2a] space-y-3 max-w-lg">
              {[
                ["Always use useGSAP()", "Never raw useEffect — it won't clean up properly on unmount."],
                ["Pass a scope ref", "useGSAP(() => { ... }, { scope: containerRef }) scopes selectors to your component."],
                ["Register plugins at file top", "gsap.registerPlugin(ScrollTrigger) goes outside the component function."],
                ["Use inline Tailwind", "No custom CSS classes — use exact hex values like bg-[#e55b3c] directly."],
              ].map(([title, desc]) => (
                <div key={title as string} className="flex gap-3 text-[12px] font-sans leading-relaxed border-b border-dashed border-[#2a2a2a]/10 pb-3 last:border-0 last:pb-0">
                  <span className="font-mono font-black text-[#e55b3c] shrink-0 mt-0.5">→</span>
                  <span>
                    <strong className="text-[#2a2a2a]">{title as string}</strong>
                    <span className="text-zinc-500"> — {desc as string}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider label="Verify &amp; Troubleshoot" />

        {/* ── Verify + Common Issues ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          <div className="bg-white border-2 border-[#2a2a2a] rounded-xl overflow-hidden shadow-[3px_3px_0px_#2a2a2a]">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b-2 border-[#2a2a2a] bg-[#0c9367]/10">
              <span className="text-base">✅</span>
              <span className="font-mono font-black text-[10px] uppercase tracking-widest">Verify Your Setup</span>
            </div>
            <ul className="p-4 space-y-0">
              {[
                <><Code>node --version</Code> → 18.x or 20.x</>,
                <><Code>pnpm --version</Code> → 8.x or 9.x</>,
                <>Dev server starts on port <Code>3000</Code></>,
                <><Code>/components</Code> shows the animation gallery</>,
                <>No TypeScript errors in the console</>,
                <>Animations play on hover / scroll</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 py-2 border-b border-dashed border-[#2a2a2a]/10 last:border-0">
                  <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-[#0c9367] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[12px] font-sans text-zinc-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-2 border-[#2a2a2a] rounded-xl overflow-hidden shadow-[3px_3px_0px_#2a2a2a]">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b-2 border-[#2a2a2a] bg-[#e55b3c]/10">
              <span className="text-base">🔧</span>
              <span className="font-mono font-black text-[10px] uppercase tracking-widest">Common Issues</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                ["GSAP animation not running?", <>Make sure the component has <Code>&quot;use client&quot;</Code> at the top — GSAP requires a browser environment.</>],
                ["ScrollTrigger not firing?", <>Call <Code>gsap.registerPlugin(ScrollTrigger)</Code> <em>outside</em> any component or hook.</>],
                ["Port 3000 already in use?", <>Run <Code>pnpm dev -- -p 3001</Code> to use a different port.</>],
                ["Hydration mismatch errors?", <>Wrap animated elements in a <Code>useEffect</Code>-guarded mount check or use <Code>suppressHydrationWarning</Code>.</>],
              ].map(([title, desc], i) => (
                <div key={i} className="border-b border-dashed border-[#2a2a2a]/10 pb-3 last:border-0 last:pb-0">
                  <p className="font-bold text-[#2a2a2a] text-[12px] mb-1">{title as string}</p>
                  <p className="text-[11.5px] font-sans text-zinc-500 leading-relaxed">{desc as React.ReactNode}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── GSAP Quick Reference ── */}
        <div className="bg-white border-2 border-[#2a2a2a] rounded-xl overflow-hidden shadow-[3px_3px_0px_#2a2a2a] mb-4">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b-2 border-[#2a2a2a] bg-[#3b82f6]/10">
            <span className="text-base">📖</span>
            <span className="font-mono font-black text-[10px] uppercase tracking-widest">GSAP Quick Reference</span>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="font-mono font-black text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Basic Tween</p>
              <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a]">
                <div className="bg-[#181818] border-b border-white/10 px-3 py-2 flex items-center justify-between font-mono text-zinc-400">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500">tsx</span>
                  <CopyBtn text={`import { useGSAP } from "@gsap/react";\nimport { useRef } from "react";\nimport gsap from "gsap";\n\nexport default function Box() {\n  const ref = useRef<HTMLDivElement>(null);\n\n  useGSAP(() => {\n    gsap.to(ref.current, {\n      x: 100,\n      duration: 1,\n      ease: "power2.out",\n    });\n  }, { scope: ref });\n\n  return <div ref={ref} />;\n}`} />
                </div>
                <pre className="p-3 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
{`import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";

export default function Box() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      x: 100,
      duration: 1,
      ease: "power2.out",
    });
  }, { scope: ref });

  return <div ref={ref} />;
}`}
                </pre>
              </div>
            </div>
            <div>
              <p className="font-mono font-black text-[9px] uppercase tracking-widest text-zinc-400 mb-2">ScrollTrigger</p>
              <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a]">
                <div className="bg-[#181818] border-b border-white/10 px-3 py-2 flex items-center justify-between font-mono text-zinc-400">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500">tsx</span>
                  <CopyBtn text={`import { ScrollTrigger } from "gsap/ScrollTrigger";\n\ngsap.registerPlugin(ScrollTrigger);\n\nuseGSAP(() => {\n  gsap.from(".card", {\n    y: 60,\n    opacity: 0,\n    stagger: 0.1,\n    scrollTrigger: {\n      trigger: ".card",\n      start: "top 80%",\n    },\n  });\n}, { scope: containerRef });`} />
                </div>
                <pre className="p-3 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
{`import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  gsap.from(".card", {
    y: 60,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".card",
      start: "top 80%",
    },
  });
}, { scope: containerRef });`}
                </pre>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 px-5 py-3 border-t border-[#2a2a2a]/10 bg-[#eff5ff]/60 text-[11.5px] font-sans text-zinc-500">
            <span className="text-[#3b82f6] shrink-0 mt-0.5">🔗</span>
            <span>
              Full GSAP docs at{" "}
              <a href="https://gsap.com/docs/v3/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] font-bold underline underline-offset-2">gsap.com/docs/v3/</a>
              {" · "}
              <Code>useGSAP</Code> hook at{" "}
              <a href="https://gsap.com/docs/v3/Packages/@gsap/react/" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] font-bold underline underline-offset-2">gsap.com/docs/v3/Packages/@gsap/react</a>
            </span>
          </div>
        </div>

        {/* ── FOOTER CTA ── */}
        <div className="mt-8 rounded-2xl border-2 border-[#2a2a2a] bg-[#2a2a2a] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[4px_4px_0px_#0c9367] overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <p className="font-mono font-black text-[9px] uppercase tracking-widest text-[#f1b333] mb-1">ready?</p>
            <p className="font-serif font-black text-[1.4rem] text-white leading-tight">Browse the components →</p>
          </div>
          <div className="relative flex gap-3 flex-wrap">
            <a href="/components" className="font-mono text-[11px] font-black text-[#2a2a2a] bg-white border-2 border-white rounded-xl px-5 py-2.5 hover:bg-[#0c9367] hover:border-[#0c9367] hover:text-white transition-all duration-150">
              🎨 Components
            </a>
            <a href="/contribution" className="font-mono text-[11px] font-black text-white border-2 border-white/30 rounded-xl px-5 py-2.5 hover:border-white transition-all duration-150">
              🛠 Contribute
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
