"use client";

import { useState } from "react";

/* ── palette ── */
const PALETTE = [
  { name: "green", hex: "#0c9367", text: "white" },
  { name: "orange", hex: "#e55b3c", text: "white" },
  { name: "purple", hex: "#6758a5", text: "white" },
  { name: "blue", hex: "#3b82f6", text: "white" },
  { name: "yellow", hex: "#f1b333", text: "black" },
  { name: "red", hex: "#c23b3a", text: "white" },
];

/* ── primitives ── */

function Tag({
  children,
  color = "#2a2a2a",
  bg = "#f0eadf",
}: {
  children: string;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest border-2 shrink-0"
      style={{ color, backgroundColor: bg, borderColor: color }}
    >
      {children}
    </span>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="bg-[#2a2a2a] text-white px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
      {children}
    </code>
  );
}

/* ── VS Code / GitHub syntax highlighter ── */
function highlight(raw: string): React.ReactNode[] {
  const lines = raw.split("\n");
  return lines.map((line, li) => {
    // tokenise each line into segments
    const segments: React.ReactNode[] = [];
    const rest = line;
    let key = 0;

    // comment at end of line or full-line comment (supporting // and #)
    let commentIdx = rest.indexOf("//");
    if (commentIdx === -1) {
      commentIdx = rest.indexOf("#");
    }
    const beforeComment = commentIdx !== -1 ? rest.slice(0, commentIdx) : rest;
    const commentPart = commentIdx !== -1 ? rest.slice(commentIdx) : null;

    // Highlight environment variables (KEY=value)
    const eqIdx = beforeComment.indexOf("=");
    if (
      eqIdx !== -1 &&
      !beforeComment.includes(" ") &&
      !beforeComment.includes("(")
    ) {
      const envKey = beforeComment.slice(0, eqIdx);
      const envVal = beforeComment.slice(eqIdx + 1);
      segments.push(
        <span key={key++} className="text-[#9cdcfe] font-semibold">
          {envKey}
        </span>,
      );
      segments.push(
        <span key={key++} className="text-[#d4d4d4] mx-0.5">
          =
        </span>,
      );
      segments.push(
        <span key={key++} className="text-[#d4d4d4]">
          {envVal}
        </span>,
      );
    } else {
      // tokenise beforeComment into: strings, numbers, keywords, properties, punctuation, plain
      const tokenRe =
        /("[^"]*"|'[^']*'|\b(id|name|route|bgColor|textColor|description|tiltClass|componentName|type)\b(?=\s*:)|\b(git|pnpm|npm|npx|yarn|bun|cd|feat|fix|docs|chore|origin|checkout|push|commit|install|dev|lint|build|master|bash)\b|\b\d+\b|[{}()[\],:;])/g;
      let lastIndex = 0;
      let m: RegExpExecArray | null;
      // eslint-disable-next-line no-cond-assign
      while ((m = tokenRe.exec(beforeComment)) !== null) {
        // plain text before match
        if (m.index > lastIndex) {
          segments.push(
            <span key={key++} className="text-[#d4d4d4]">
              {beforeComment.slice(lastIndex, m.index)}
            </span>,
          );
        }
        const tok = m[0];
        if (tok.startsWith('"') || tok.startsWith("'")) {
          // string — light blue (GitHub)
          segments.push(
            <span key={key++} className="text-[#a5d6ff]">
              {tok}
            </span>,
          );
        } else if (m[2]) {
          // property — light blue (GitHub)
          segments.push(
            <span key={key++} className="text-[#9cdcfe]">
              {tok}
            </span>,
          );
        } else if (m[3]) {
          // shell / git keyword — red/orange (GitHub)
          segments.push(
            <span key={key++} className="text-[#ff7b72] font-semibold">
              {tok}
            </span>,
          );
        } else if (/^\d+$/.test(tok)) {
          // number — light blue (GitHub)
          segments.push(
            <span key={key++} className="text-[#79c0ff]">
              {tok}
            </span>,
          );
        } else {
          // punctuation — light gray
          segments.push(
            <span key={key++} className="text-[#abb2bf]">
              {tok}
            </span>,
          );
        }
        lastIndex = m.index + tok.length;
      }
      // remaining plain text
      if (lastIndex < beforeComment.length) {
        segments.push(
          <span key={key++} className="text-[#d4d4d4]">
            {beforeComment.slice(lastIndex)}
          </span>,
        );
      }
    }

    // comment — GitHub / VS Code green comment style
    if (commentPart) {
      segments.push(
        <span key={key++} className="text-[#6a9955] italic">
          {commentPart}
        </span>,
      );
    }

    return (
      <span key={li}>
        {segments}
        {li < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function Callout({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 bg-[#fff8e6] border-l-4 border-[#f1b333] rounded-r-lg pl-3 pr-4 py-3 my-3">
      <span className="text-base shrink-0 mt-0.5">{icon}</span>
      <p className="text-[11px] sm:text-[12px] font-sans text-[#2a2a2a] leading-relaxed">
        {children}
      </p>
    </div>
  );
}

/* ── Terminal — compact macOS style ── */
function Terminal({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="border-2 border-[#2a2a2a] rounded-xl overflow-hidden bg-[#0d1117] shadow-[2.5px_2.5px_0px_#2a2a2a] w-fit max-w-full my-3">
      <div className="flex items-center justify-between bg-[#161b22] border-b border-white/8 px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(children.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`font-mono font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border transition-all cursor-pointer ${
            copied
              ? "bg-[#0c9367] text-white border-[#0c9367]"
              : "text-zinc-500 border-transparent hover:text-zinc-300"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 font-mono text-[11px] sm:text-[12px] overflow-x-auto whitespace-pre leading-relaxed select-text">
        <code>{highlight(children)}</code>
      </pre>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 py-2.5 border-b border-dashed border-[#2a2a2a]/12 last:border-0">
      <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-[#0c9367] flex items-center justify-center">
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      <span className="text-[12px] sm:text-[13px] font-sans text-zinc-700 leading-relaxed">
        {children}
      </span>
    </li>
  );
}

function Step({
  num,
  accent,
  title,
  children,
}: {
  num: string;
  accent: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4 sm:gap-5 pb-8 last:pb-0">
      {/* vertical line */}
      <div className="flex flex-col items-center">
        <div
          className="w-9 h-9 shrink-0 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center font-mono font-black text-[13px] text-white shadow-[2px_2px_0px_#2a2a2a]"
          style={{ backgroundColor: accent }}
        >
          {num}
        </div>
        <div className="flex-1 w-[2px] bg-[#2a2a2a]/12 mt-2 last:hidden" />
      </div>
      {/* content */}
      <div className="flex-1 min-w-0 pt-1.5 pb-4">
        <h3 className="font-serif font-black text-[14px] sm:text-[15px] text-[#2a2a2a] mb-2">
          {title}
        </h3>
        <div className="text-[12px] sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  emoji,
  accent = "#2a2a2a",
  children,
}: {
  title: string;
  emoji: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border-2 border-[#2a2a2a] bg-white overflow-hidden shadow-[4px_4px_0px_#2a2a2a]">
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-[#2a2a2a]"
        style={{ backgroundColor: `${accent}18` }}
      >
        <span className="text-xl leading-none">{emoji}</span>
        <h2 className="font-mono font-black text-[11px] sm:text-[12px] uppercase tracking-widest text-[#2a2a2a]">
          {title}
        </h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* ── page ── */

export default function ContributePageClient() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] selection:bg-[#f1b333] selection:text-black">
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-14 sm:pt-18 md:pt-20 lg:pt-24 pb-24">
        {/* ── HERO ── */}
        <div className="mb-12 sm:mb-16">
          {/* two-col: text left, code card right — vertically centered */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
            {/* ── LEFT: text ── */}
            <div className="flex-1 min-w-0">
              {/* badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag color="white" bg="#e55b3c">
                  Open Source
                </Tag>
                <Tag color="white" bg="#0c9367">
                  Community Driven
                </Tag>
                <Tag color="white" bg="#6758a5">
                  MIT License
                </Tag>
              </div>

              {/* headline */}
              <h1 className="font-serif font-black uppercase leading-[0.9] tracking-tight text-[#2a2a2a] mb-6 text-[clamp(1.8rem,4.8vw,3.8rem)] whitespace-nowrap">
                Contribution <span className="text-[#e55b3c]">Guidelines</span>
              </h1>

              {/* description */}
              <p className="font-sans text-[14px] sm:text-[15px] lg:text-base text-zinc-600 leading-[1.7] mb-8">
                TweenLabs is a community-driven, open-source GSAP component
                library. Whether you&apos;re adding a new animation, fixing a
                bug, or improving docs — every contribution makes this library
                better for everyone.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <a
                  href="https://github.com/TweenLabs/TweenLabs/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] font-black bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] rounded-xl px-5 py-3 shadow-[3px_3px_0px_#4f46e5] hover:-translate-y-px hover:shadow-[5px_5px_0px_#4f46e5] transition-all duration-150 active:translate-y-px active:shadow-[1px_1px_0px_#4f46e5]"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Fork on GitHub
                </a>
                <a
                  href="https://github.com/TweenLabs/TweenLabs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] font-black bg-white text-[#2a2a2a] border-2 border-[#2a2a2a] rounded-xl px-5 py-3 shadow-[3px_3px_0px_#2a2a2a] hover:bg-[#0c9367] hover:text-white hover:border-[#0c9367] hover:-translate-y-px hover:shadow-[3px_4px_0px_#2a2a2a] transition-all duration-150 active:translate-y-px"
                >
                  Open an Issue
                </a>
                <a
                  href="https://github.com/TweenLabs/TweenLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-black text-zinc-500 hover:text-[#f1b333] transition-colors duration-150"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  ⭐ Star on GitHub
                </a>
              </div>

              {/* stat strip with dividers */}
              <div className="flex items-stretch gap-0 divide-x-2 divide-[#2a2a2a]/10">
                {[
                  { label: "Steps", val: "5" },
                  { label: "Lines to add", val: "~10" },
                  { label: "Time", val: "< 5 min" },
                  { label: "License", val: "MIT" },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="flex flex-col px-4 first:pl-0 last:pr-0"
                  >
                    <span className="font-mono font-black text-[17px] sm:text-[20px] lg:text-[22px] text-[#2a2a2a] leading-none mb-1">
                      {val}
                    </span>
                    <span className="font-sans text-[10px] text-zinc-400 uppercase tracking-wide">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#2a2a2a]/12" />
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Getting Started
          </span>
          <div className="flex-1 h-px bg-[#2a2a2a]/12" />
        </div>

        {/* ── SECTIONS ── */}
        <div className="flex flex-col gap-6">
          {/* 1. Local Setup */}
          <Card emoji="🛠️" title="Local Development Setup" accent="#0c9367">
            <div className="space-y-0">
              <Step num="1" accent="#0c9367" title="Fork the Repository">
                Click the <strong>Fork</strong> button on the top-right of the{" "}
                <a
                  href="https://github.com/TweenLabs/TweenLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e55b3c] font-bold underline underline-offset-2"
                >
                  GitHub page
                </a>{" "}
                to create your own copy.
              </Step>

              <Step num="2" accent="#0c9367" title="Clone & Enter">
                <Terminal>{`git clone https://github.com/YOUR_USERNAME/TweenLabs.git\ncd TweenLabs`}</Terminal>
              </Step>

              <Step num="3" accent="#0c9367" title="Install with pnpm">
                <Terminal>{`pnpm install`}</Terminal>
                <Callout icon="⚠️">
                  This repo uses a <Code>pnpm</Code> lockfile. Do{" "}
                  <strong>not</strong> use npm or yarn — it will break the lock
                  file and conflict with CI.
                </Callout>
              </Step>

              <Step
                num="4"
                accent="#0c9367"
                title="Configure Environment Variables"
              >
                Create a <Code>.env.local</Code> file in the root directory and
                add the required environment variables:
                <Terminal>{`# Deployment used by \`npx convex dev\`
CONVEX_DEPLOYMENT=your_convex_deployment_name

# Convex DB Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CONVEX_SITE_URL=your_convex_site_url

# Better Auth Configuration
BETTER_AUTH_SECRET=your_32_character_secret
SITE_URL=http://localhost:3000

# OAuth Credentials (Optional for local play)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret`}</Terminal>
              </Step>

              <Step num="5" accent="#0c9367" title="Start the Dev Server">
                <Terminal>{`pnpm dev`}</Terminal>
                Open{" "}
                <a
                  href="http://localhost:3000"
                  className="text-[#e55b3c] font-bold underline underline-offset-2"
                >
                  localhost:3000
                </a>{" "}
                and go to <Code>/components</Code> to browse all animations.
              </Step>
            </div>
          </Card>

          {/* 2. Add a new component */}
          <Card emoji="➕" title="Adding a New Component" accent="#e55b3c">
            <p className="text-[12px] sm:text-[13px] text-zinc-600 mb-5 leading-relaxed">
              Every animation must be <strong>100% self-contained</strong>{" "}
              inside its own folder. No shared imports. No cross-component
              dependencies.
            </p>

            <div className="space-y-0">
              <Step num="1" accent="#e55b3c" title="Create Your Folder & Page">
                <Terminal>{`src/app/(main)/components/YourAnimation/\n└── page.tsx   ← your entire animation lives here`}</Terminal>
                <ul className="mt-2 space-y-0">
                  {[
                    <>No imports from other route directories</>,
                    <>
                      No custom classes from <Code>globals.css</Code> — use
                      inline Tailwind
                    </>,
                    <>
                      No custom theme values — use exact hex:{" "}
                      <Code>bg-[#e55b3c]</Code> not <Code>bg-wtf-orange</Code>
                    </>,
                    <>
                      Sub-components go inside the same <Code>page.tsx</Code>
                    </>,
                    <>
                      Assets go in <Code>/public/</Code> as absolute paths, or
                      use inline SVGs
                    </>,
                  ].map((item, i) => (
                    <CheckItem key={i}>{item}</CheckItem>
                  ))}
                </ul>
              </Step>

              <Step num="2" accent="#e55b3c" title="Register in components.ts">
                Add your entry to <Code>src/data/components.ts</Code>:
                <Terminal>{`{
  id: "your-animation",               // Unique slug ID (kebab-case, e.g. "your-animation")
  name: "Your Animation",             // display name
  componentName: "YourAnimation",     // PascalCase — must match folder
  route: "/components/YourAnimation",
  bgColor: "bg-wtf-green",            // see palette below
  textColor: "text-white",
  description: "One sentence describing what this animation does.",
  tiltClass: "tilt-left",
  type: ["card", "scroll"],           // text | scroll | card | interactive (supports multiple)
  preview: "/previews/YourAnimation.webp",   // Optional: static thumbnail
  embedInteraction: "scroll",         // Optional: scroll | cursor | tabs | click-sequence
}`}</Terminal>
                <Callout icon="⚡">
                  Always use a unique kebab-case slug (e.g.{" "}
                  <Code>your-animation</Code>) for the <Code>id</Code> field. Do{" "}
                  <strong>not</strong> use sequential numbers to avoid Git merge
                  conflicts. Visual numbers are calculated dynamically by the
                  application.
                </Callout>
                <Callout icon="⚡">
                  <Code>componentName</Code> must match your folder name exactly
                  (case-sensitive). A mismatch causes a 404 and breaks the
                  sidebar link.
                </Callout>
                <Callout icon="📸">
                  <Code>preview</Code> is optional. If provided, save a{" "}
                  <Code>.webp</Code> screenshot to{" "}
                  <Code>public/previews/YourAnimation.webp</Code>. If missing, a
                  &quot;Hover to preview&quot; placeholder is shown
                  automatically.
                </Callout>
                {/* palette swatches */}
                <p className="font-mono text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 mt-4">
                  bgColor options:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PALETTE.map(({ name, hex, text }) => (
                    <div
                      key={name}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-full h-8 rounded-lg border-2 border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] flex items-center justify-center"
                        style={{ backgroundColor: hex }}
                      >
                        <span
                          className="font-mono text-[8px] font-black"
                          style={{ color: text }}
                        >
                          {name}
                        </span>
                      </div>
                      <span className="font-mono text-[7px] text-zinc-500 text-center leading-none">
                        bg-wtf-{name}
                      </span>
                    </div>
                  ))}
                </div>
                {/* embedInteraction options */}
                <p className="font-mono text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 mt-5">
                  embedInteraction options:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "scroll", desc: "Auto-scroll (default)" },
                    { val: "cursor", desc: "Mouse movement" },
                    { val: "tabs", desc: "Tab clicks" },
                    { val: "click-sequence", desc: "Sequential clicks" },
                  ].map(({ val, desc }) => (
                    <div
                      key={val}
                      className="flex items-center gap-2 bg-[#f0eadf] border border-[#2a2a2a]/10 rounded-lg px-3 py-2"
                    >
                      <Code>{val}</Code>
                      <span className="text-[10px] text-zinc-500 font-sans">
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </Step>

              <Step num="3" accent="#e55b3c" title="GSAP Standards">
                <ul className="space-y-0">
                  {[
                    <>
                      <Code>useGSAP()</Code> from <Code>@gsap/react</Code> —
                      never raw <Code>useEffect</Code>
                    </>,
                    <>
                      Always pass a scope ref:{" "}
                      <Code>{`{ scope: containerRef }`}</Code>
                    </>,
                    <>Register plugins at file top, not inside hooks</>,
                    <>
                      Use <Code>contextSafe()</Code> for callbacks that touch
                      state/refs
                    </>,
                    <>Clean up timelines and listeners on unmount</>,
                  ].map((item, i) => (
                    <CheckItem key={i}>{item}</CheckItem>
                  ))}
                </ul>
              </Step>
            </div>
          </Card>

          {/* 3. Workflow */}
          <Card emoji="🍴" title="Contribution Workflow" accent="#6758a5">
            <div className="space-y-0">
              <Step num="1" accent="#6758a5" title="Create a Feature Branch">
                <Terminal>{`git checkout -b feat/your-animation-name`}</Terminal>
              </Step>

              <Step num="2" accent="#6758a5" title="Build & Verify in Browser">
                Make sure the route renders correctly at{" "}
                <Code>/components/YourAnimation</Code> and appears in the
                sidebar and gallery at <Code>/components</Code>.
              </Step>

              <Step num="3" accent="#6758a5" title="Validate — Required">
                <Terminal>{`pnpm lint\npnpm build`}</Terminal>
                <Callout icon="🚫">
                  PRs that fail CI, have TypeScript errors, or contain ESLint
                  warnings <strong>will not be merged</strong>. Fix all warnings
                  before opening a PR.
                </Callout>
              </Step>

              <Step num="4" accent="#6758a5" title="Commit">
                <Terminal>{`git commit -m "feat: add [your animation name]"`}</Terminal>
                Use conventional commits: <Code>feat:</Code> for new components
                · <Code>fix:</Code> for bugs · <Code>docs:</Code> for
                documentation.
              </Step>

              <Step num="5" accent="#6758a5" title="Push & Open PR">
                <Terminal>{`git push origin feat/your-animation-name`}</Terminal>
                Open a PR targeting <Code>master</Code>. Include a{" "}
                <strong>short GIF or screenshot</strong> of your animation in
                the PR description.
              </Step>
            </div>
          </Card>

          {/* 4. Good first contributions + code guidelines side-by-side on md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <Card emoji="✅" title="Good First Contributions" accent="#0c9367">
              <ul className="space-y-0">
                {[
                  "Add inline comments explaining GSAP logic",
                  "Test on mobile/tablet — report layout bugs",
                  "Create variants with different easing curves",
                  "Add prefers-reduced-motion support",
                  "Fix typos or improve docs",
                  "Report broken routes or console errors",
                ].map((r) => (
                  <CheckItem key={r}>{r}</CheckItem>
                ))}
              </ul>
            </Card>

            <Card emoji="📐" title="Code Guidelines" accent="#3b82f6">
              <ul className="space-y-0">
                {[
                  <>
                    Use transforms (<Code>x</Code>, <Code>y</Code>,{" "}
                    <Code>scale</Code>) — not layout props
                  </>,
                  <>
                    Respect <Code>prefers-reduced-motion</Code>
                  </>,
                  <>
                    TypeScript only — no <Code>any</Code> types
                  </>,
                  "Descriptive conventional commit messages",
                  "One animation concept per component",
                  "Comment complex timelines & ScrollTriggers",
                ].map((r, i) => (
                  <CheckItem key={i}>{r}</CheckItem>
                ))}
              </ul>
            </Card>
          </div>

          {/* 5. Code of Conduct */}
          <Card emoji="🤝" title="Code of Conduct" accent="#f1b333">
            <p className="text-[12px] sm:text-[13px] text-zinc-600 leading-relaxed">
              Be kind and constructive. We&apos;re here to learn and build
              something great together. Discriminatory, harassing, or
              disrespectful behavior will not be tolerated in issues, PRs, or
              any community interaction.
            </p>
          </Card>

          {/* ── FOOTER CTA ── */}
          <div className="relative rounded-2xl border-2 border-[#2a2a2a] bg-[#2a2a2a] overflow-hidden shadow-[5px_5px_0px_#e55b3c]">
            {/* subtle grid */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="font-mono font-black text-[10px] uppercase tracking-widest text-[#f1b333] mb-1.5">
                  Ready to ship?
                </p>
                <p className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-white leading-tight mb-1">
                  Built in public.
                </p>
                <p className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-[#e55b3c] leading-tight">
                  Animated with love. Open to all.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="https://github.com/TweenLabs/TweenLabs/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center inline-flex items-center justify-center gap-2 font-mono text-[11px] font-black text-[#2a2a2a] bg-white border-2 border-white rounded-xl px-5 py-3 shadow-[2px_2px_0px_#e55b3c] hover:bg-[#e55b3c] hover:text-white hover:border-[#e55b3c] transition-all duration-150"
                >
                  🚀 Fork & Contribute
                </a>
                <a
                  href="https://github.com/TweenLabs/TweenLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center inline-flex items-center justify-center gap-2 font-mono text-[11px] font-black text-white border-2 border-white/30 rounded-xl px-5 py-3 hover:border-white transition-all duration-150"
                >
                  ⭐ Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
