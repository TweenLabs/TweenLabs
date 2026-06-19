"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useAuthModal } from "@/provider/AuthModalProvider";
import { useSession } from "@/provider/SessionProvider";

interface CodePageClientProps {
  slug: string;
  name: string;
  description: string;
  pageCode: string;
  standaloneCode: string | null;
  coreGsapCode: string | null;
  setupGuide: string | null;
  customization: string | null;
}

const componentNamesMap: Record<string, string> = {
  "01-showup-cards": "FlipCards",
  "showup-cards": "FlipCards",
  "02-gravity-drop": "GravityDrop",
  "gravity-drop": "GravityDrop",
  "03-scroll-tags-assembly": "ScrollTags",
  "scroll-tags-assembly": "ScrollTags",
  "04-inward-outward-border-reveal": "BorderReveal",
  "inward-outward-border-reveal": "BorderReveal",
  "05-horizontal-cards-showcase": "HorizontalCards",
  "horizontal-cards-showcase": "HorizontalCards",
  "06-page-change-animation": "PageTransition",
  "page-change-animation": "PageTransition",
  "07-kinetic-typography": "KineticText",
  "kinetic-typography": "KineticText",
  "08-scroll-orbit-gallery": "OrbitGallery",
  "scroll-orbit-gallery": "OrbitGallery",
  "09-blueprint-scatter": "Blueprint",
  "blueprint-scatter": "Blueprint",
  "10-circular-scatter": "CircularScatter",
  "circular-scatter": "CircularScatter",
  "11-screen-skill-fit": "SkillFit",
  "screen-skill-fit": "SkillFit",
  "12-magnetic-dock": "MagneticDock",
  "magnetic-dock": "MagneticDock",
  "13-fluid-cursor": "FluidCursor",
  "fluid-cursor": "FluidCursor",
  "14-bento-grid-flip": "BentoGrid",
  "bento-grid-flip": "BentoGrid",
  "15-3d-carousel": "Carousel3D",
  "3d-carousel": "Carousel3D",
  "16-morphing-accordion": "Accordion",
  "morphing-accordion": "Accordion",
  "17-scroll-cards-01": "ScrollCards",
  "scroll-cards-01": "ScrollCards",
  "18-string-line": "StringLine",
  "string-line": "StringLine",
};

// Helper to convert slug to clean PascalCase component name
const getClassName = (slug: string) => {
  const cleanSlug = slug.toLowerCase().trim();
  if (componentNamesMap[cleanSlug]) {
    return componentNamesMap[cleanSlug];
  }
  const clean = cleanSlug.replace(/^\d+[a-z]?[-_]/, "");
  return clean
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

// File Icon helper to render icons like in real VS Code
const getFileIcon = (fileName: string) => {
  if (fileName.endsWith(".tsx")) {
    return (
      <svg
        className="w-3.5 h-3.5 text-[#00bcd4]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2.5" />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3.5"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(30 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3.5"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(90 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3.5"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(150 12 12)"
        />
      </svg>
    );
  }
  if (fileName.endsWith(".js")) {
    return (
      <span className="w-3.5 h-3.5 bg-[#f1c40f] text-black text-[9px] font-black rounded flex items-center justify-center font-sans">
        JS
      </span>
    );
  }
  if (fileName.endsWith(".css")) {
    return (
      <svg
        className="w-3.5 h-3.5 text-[#e55b3c]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        />
      </svg>
    );
  }
  return (
    <span className="w-3.5 h-3.5 bg-[#3498db] text-white text-[8px] font-bold rounded flex items-center justify-center font-sans">
      MD
    </span>
  );
};

// Custom CopyButton to handle copy triggers inside Setup Guide
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded border transition-all cursor-pointer ${
        copied
          ? "bg-[#0c9367] text-white border-[#0c9367]"
          : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-750"
      }`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
};

// CSS Syntax Highlighter using One Dark Pro theme colors
const highlightCss = (code: string) => {
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Extract comments first to prevent styling collisions
  const comments: string[] = [];
  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
    comments.push(`<span class="text-[#5c6370] italic">${match}</span>`);
    return `___CSS_COMMENT_PLACEHOLDER_${comments.length - 1}___`;
  });

  // 2. Highlight selectors (e.g. .brutalist-card, :root)
  html = html.replace(/([^{}\n]+)\s*(?={)/g, (match) => {
    if (!match.trim()) return match;
    return `<span class="text-[#e06c75] font-semibold">${match}</span>`;
  });

  // 3. Highlight properties (e.g. background, border)
  html = html.replace(/([a-zA-Z-]+)\s*:/g, (match, p1) => {
    return `<span class="text-[#d19a66]">${p1}</span>:`;
  });

  // 4. Highlight values
  html = html.replace(/:\s*([^;{}]+)/g, (match, p1) => {
    return `: <span class="text-[#98c379]">${p1}</span>`;
  });

  // 5. Restore comments
  html = html.replace(/___CSS_COMMENT_PLACEHOLDER_(\d+)___/g, (_, idxStr) => {
    const idx = parseInt(idxStr, 10);
    return comments[idx];
  });

  // 6. Highlight braces
  html = html.replace(/([{};])/g, '<span class="text-[#abb2bf]">$1</span>');

  return html;
};

// CSS compiler extracting needed styling tokens for each animation component
const getRequiredCssForCode = (code: string) => {
  const cssBlocks: string[] = [];
  const rootVars = `/* Theme Custom Properties */
:root {
  --background: #f0eadf;
  --foreground: #2a2a2a;
  --card-bg: #ffffff;
  --border-color: #2a2a2a;
  --shadow-color: #2a2a2a;
  
  /* Accent Colors */
  --wtf-purple: #6758a5;
  --wtf-green: #0c9367;
  --wtf-red: #c53b3a;
  --wtf-orange: #e55b3c;
  --wtf-yellow: #f1b333;
  --wtf-blue: #3b82f6;
}`;

  // Always include CSS theme variables
  cssBlocks.push(rootVars);

  if (code.includes("brutalist-card")) {
    cssBlocks.push(`/* Neo-Brutalist Card Styles */
.brutalist-card {
  background: var(--card-bg);
  border: 3px solid var(--border-color);
  box-shadow: 6px 6px 0px var(--shadow-color);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.brutalist-card-interactive:hover {
  transform: translate(-4px, -4px);
  box-shadow: 10px 10px 0px var(--shadow-color);
}

.brutalist-card-interactive:active {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px var(--shadow-color);
}`);
  }

  if (code.includes("brutalist-btn")) {
    cssBlocks.push(`/* Neo-Brutalist Button Styles */
.brutalist-btn {
  border: 3px solid var(--border-color);
  box-shadow: 4px 4px 0px var(--shadow-color);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.brutalist-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--shadow-color);
}

.brutalist-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--shadow-color);
}`);
  }

  if (code.includes("dot-grid")) {
    cssBlocks.push(`/* Dot Grid Background Pattern */
.dot-grid {
  background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.15;
}`);
  }

  if (code.includes("noise-overlay")) {
    cssBlocks.push(`/* Tactile Noise Grain Overlay */
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
}`);
  }

  if (
    code.includes("preserve-3d") ||
    code.includes("backface-hidden") ||
    code.includes("rotate-y-180")
  ) {
    cssBlocks.push(`/* 3D Card Flip & Perspective Utilities */
.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}`);
  }

  if (code.includes("tilt-right") || code.includes("tilt-left")) {
    cssBlocks.push(`/* Asymmetric Tilt Utilities */
.tilt-right {
  transform: rotate(2deg);
}
.tilt-left {
  transform: rotate(-2deg);
}
.tilt-right-lg {
  transform: rotate(8deg);
}
.tilt-left-lg {
  transform: rotate(-8deg);
}`);
  }

  if (code.includes("scrollbar-none")) {
    cssBlocks.push(`/* Hide Scrollbar Utilities */
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}`);
  }

  // Parse out custom page-specific keyframes and animations inside style tags
  if (code.includes("<style>{`")) {
    const styleMatches = code.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
    if (styleMatches && styleMatches[1]) {
      cssBlocks.push(`/* Custom Inline CSS */\n${styleMatches[1].trim()}`);
    }
  }

  return cssBlocks.join("\n\n");
};

// Custom RegExp syntax highlighter utilizing VS Code One Dark Pro scheme
const highlightCode = (code: string, fileName: string) => {
  if (fileName.endsWith(".css")) {
    return highlightCss(code);
  }
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const insertedTags: string[] = [];
  const wrap = (content: string, className: string) => {
    insertedTags.push(`<span class="${className}">${content}</span>`);
    return `___TAG_PLACEHOLDER_${insertedTags.length - 1}___`;
  };

  const tokenPlaceholders: { type: "comment" | "string"; content: string }[] =
    [];

  // Match comments and strings in a single pass to avoid collisions
  const tokenRegex =
    /(\/\/.*|\/\*[\s\S]*?\*\/|&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|`[\s\S]*?`)/g;

  html = html.replace(tokenRegex, (match) => {
    const isComment = match.startsWith("//") || match.startsWith("/*");
    tokenPlaceholders.push({
      type: isComment ? "comment" : "string",
      content: match,
    });
    return `___TOKEN_PLACEHOLDER_${tokenPlaceholders.length - 1}___`;
  });

  // Highlight numbers (purple)
  html = html.replace(/\b(\d+)\b/g, (match) => wrap(match, "text-[#d19a66]"));

  // Keywords (high-contrast magenta)
  const keywords = [
    "import",
    "export",
    "default",
    "const",
    "let",
    "var",
    "function",
    "return",
    "interface",
    "type",
    "extends",
    "implements",
    "from",
    "as",
    "true",
    "false",
    "null",
    "undefined",
    "async",
    "await",
    "new",
    "typeof",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "class",
  ];
  const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  html = html.replace(keywordPattern, (_, match) =>
    wrap(match, "text-[#c678dd]"),
  );

  // React component and core hook names (cyan)
  const hooks = [
    "useGSAP",
    "useRef",
    "useState",
    "useEffect",
    "contextSafe",
    "ScrollTrigger",
    "gsap",
  ];
  const hooksPattern = new RegExp(`\\b(${hooks.join("|")})\\b`, "g");
  html = html.replace(hooksPattern, (_, match) =>
    wrap(match, "text-[#56b6c2] font-semibold"),
  );

  // Built-in functions and methods (blue)
  const builtins = [
    "registerPlugin",
    "timeline",
    "fromTo",
    "kill",
    "revert",
    "split",
    "map",
    "forEach",
    "find",
    "push",
    "addEventListener",
    "removeEventListener",
    "getBoundingClientRect",
    "querySelector",
    "querySelectorAll",
  ];
  const builtinsPattern = new RegExp(`\\b(${builtins.join("|")})\\b`, "g");
  html = html.replace(builtinsPattern, (_, match) =>
    wrap(match, "text-[#61afef]"),
  );

  // JSX tag names (red/pink)
  html = html.replace(/(&lt;\/?[a-zA-Z0-9-]+)/gi, (match) =>
    wrap(match, "text-[#e06c75]"),
  );

  // HTML/JSX Attributes (gold)
  html = html.replace(
    /\b(className|ref|onClick|onChange|style|key|id|type|placeholder|value|maxLength|initialText|bgColor|textColor|tiltClass|route|name|description)\b=/g,
    (match, p1) => {
      return `${wrap(p1, "text-[#d19a66]")}=`;
    },
  );

  // Highlight brackets and punctuation (light gray)
  html = html.replace(
    /([{}[\]().,:])|(?<!&(lt|gt|amp|quot|#39));/g,
    (match) => {
      return wrap(match, "text-[#abb2bf]");
    },
  );

  // Re-insert tag placeholders
  const tagPlaceholderRegex = /___TAG_PLACEHOLDER_(\d+)___/g;
  html = html.replace(tagPlaceholderRegex, (_, idxStr) => {
    const idx = parseInt(idxStr, 10);
    return insertedTags[idx];
  });

  // Re-insert comments & strings (green and dim gray)
  const tokenPlaceholderRegex = /___TOKEN_PLACEHOLDER_(\d+)___/g;
  html = html.replace(tokenPlaceholderRegex, (_, indexStr) => {
    const idx = parseInt(indexStr, 10);
    const token = tokenPlaceholders[idx];
    if (token.type === "comment") {
      return `<span class="text-[#5c6370] italic">${token.content}</span>`;
    } else {
      return `<span class="text-[#98c379]">${token.content}</span>`;
    }
  });

  return html;
};

// Custom Markdown renderer
function renderMarkdown(md: string) {
  if (!md) return null;

  const lines = md.split("\n");
  const filteredLines = [];
  let skipCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      skipCodeBlock = !skipCodeBlock;
      continue;
    }
    if (skipCodeBlock) continue;

    if (
      line.startsWith("# ") ||
      line.toLowerCase().includes("setup &amp; dependencies") ||
      line.toLowerCase().includes("setup & dependencies")
    ) {
      continue;
    }

    filteredLines.push(line);
  }

  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listType: "ordered" | "unordered" | null = null;

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      if (listType === "ordered") {
        elements.push(
          <ol
            key={`ol-${key}`}
            className="list-decimal pl-6 my-3 space-y-2 font-sans font-medium text-zinc-700"
          >
            {currentList}
          </ol>,
        );
      } else {
        elements.push(
          <ul
            key={`ul-${key}`}
            className="list-disc pl-6 my-3 space-y-2 font-sans font-medium text-zinc-700"
          >
            {currentList}
          </ul>,
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const parseInlineMarkdown = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-black text-[#2a2a2a]">$1</strong>',
    );
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-zinc-100 border border-zinc-350 px-1.5 py-0.5 rounded font-mono text-xs font-bold text-wtf-orange">$1</code>',
    );

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  for (let i = 0; i < filteredLines.length; i++) {
    const line = filteredLines[i];

    if (line.startsWith("## ")) {
      flushList(String(i));
      const val = line.slice(3).trim();
      elements.push(
        <h3
          key={`h2-${i}`}
          className="text-xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] mt-8 mb-4 border-b border-zinc-200 pb-2"
        >
          {parseInlineMarkdown(val)}
        </h3>,
      );
    } else if (line.startsWith("### ")) {
      flushList(String(i));
      const val = line.slice(4).trim();
      elements.push(
        <h4
          key={`h3-${i}`}
          className="text-lg font-serif font-black uppercase tracking-tight text-[#2a2a2a] mt-6 mb-3"
        >
          {parseInlineMarkdown(val)}
        </h4>,
      );
    } else if (line.trim().match(/^\d+\.\s+(.+)$/)) {
      if (listType !== "ordered") {
        flushList(String(i));
        listType = "ordered";
      }
      const val = line.trim().replace(/^\d+\.\s+/, "");
      currentList.push(
        <li key={`li-${i}`} className="pl-1 leading-relaxed">
          {parseInlineMarkdown(val)}
        </li>,
      );
    } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      if (listType !== "unordered") {
        flushList(String(i));
        listType = "unordered";
      }
      const val = line.trim().slice(2);
      currentList.push(
        <li key={`li-${i}`} className="pl-1 leading-relaxed">
          {parseInlineMarkdown(val)}
        </li>,
      );
    } else if (line.trim() === "") {
      flushList(String(i));
    } else {
      flushList(String(i));
      elements.push(
        <p
          key={`p-${i}`}
          className="my-2.5 font-sans font-medium text-zinc-700 leading-relaxed text-sm"
        >
          {parseInlineMarkdown(line)}
        </p>,
      );
    }
  }

  flushList("end");
  return <div className="markdown-body mt-2">{elements}</div>;
}

const getInstallCommand = (pm: "npm" | "pnpm" | "yarn" | "bun") => {
  switch (pm) {
    case "npm":
      return "npm install gsap @gsap/react";
    case "pnpm":
      return "pnpm add gsap @gsap/react";
    case "yarn":
      return "yarn add gsap @gsap/react";
    case "bun":
      return "bun add gsap @gsap/react";
  }
};

const getCliCommand = (pm: "npm" | "pnpm" | "yarn" | "bun", slug: string) => {
  const cleanSlug = slug.replace(/^\d+[a-z]?[-_]/, "");
  switch (pm) {
    case "npm":
      return `npx tweenlabs@latest add ${cleanSlug}`;
    case "pnpm":
      return `pnpm dlx tweenlabs@latest add ${cleanSlug}`;
    case "yarn":
      return `yarn dlx tweenlabs@latest add ${cleanSlug}`;
    case "bun":
      return `bunx tweenlabs@latest add ${cleanSlug}`;
  }
};

export default function CodePageClient({
  slug,
  name,
  description,
  pageCode,
  standaloneCode,
  coreGsapCode,
  customization,
}: CodePageClientProps) {
  const { session, isPending } = useSession();
  const { openModal, closeModal } = useAuthModal();
  const router = useRouter();
  const isAuthenticated = !!session;
  const isPlaceholder = pageCode.includes("Please sign in to view the code.");

  const blurClass = !isAuthenticated
    ? "blur-md pointer-events-none select-none"
    : "";
  // Determine available tabs
  const tabs = [];
  tabs.push({
    id: "page",
    label: "Full Sandbox Page",
    code: pageCode,
    file: "page.tsx",
  });
  if (standaloneCode) {
    tabs.push({
      id: "standalone",
      label: "Standalone React Component",
      code: standaloneCode,
      file: `${getClassName(slug)}.tsx`,
    });
  }
  if (coreGsapCode) {
    tabs.push({
      id: "core",
      label: "Core GSAP Timeline",
      code: coreGsapCode,
      file: "animation.js",
    });
  }

  // Compile required CSS styles dynamically based on classes used in code
  const codeToAnalyze = standaloneCode || pageCode;
  const cssCode = getRequiredCssForCode(codeToAnalyze);
  if (cssCode) {
    tabs.push({
      id: "css",
      label: "Required CSS",
      code: cssCode,
      file: "styles.css",
    });
  }

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);
  const [pkgManager, setPkgManager] = useState<"npm" | "pnpm" | "yarn" | "bun">(
    "npm",
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const highlighted = highlightCode(activeTab.code, activeTab.file);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        openModal(`/code/${slug}`, false); // isClosable = false
      } else {
        closeModal();
        if (isPlaceholder && !hasRefreshed) {
          setHasRefreshed(true);
          router.refresh();
        }
      }
    }
  }, [
    session,
    isPending,
    slug,
    openModal,
    closeModal,
    isPlaceholder,
    router,
    hasRefreshed,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeTab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  const handleDownload = () => {
    const downloadFile = (codeStr: string, nameStr: string) => {
      const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nameStr;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    let fileName = activeTab.file;
    if (activeTab.id === "page") {
      fileName = `${getClassName(slug)}.tsx`;
    }

    downloadFile(activeTab.code, fileName);
  };

  const usesScrollTrigger = activeTab.code.includes("ScrollTrigger");
  const componentName = getClassName(slug);

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center selection:bg-wtf-yellow selection:text-black pb-20 w-full">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Navigation Breadcrumb / Header */}
      <header className="w-full max-w-6xl px-4 md:px-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
            <Link href="/" className="hover:text-wtf-orange transition-colors">
              TweenLabs
            </Link>
            <span>/</span>
            <Link
              href={`/${slug}`}
              className="hover:text-wtf-orange transition-colors"
            >
              Components
            </Link>
            <span>/</span>
            <span className="text-wtf-orange font-black">Source Code</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
            {name} Code
          </h1>
        </div>

        <div className="flex gap-4">
          <Link href={`/${slug}`}>
            <button className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer shadow-[3.5px_3.5px_0px_#2a2a2a]">
              ← View Sandbox
            </button>
          </Link>
          <Link href="/">
            <button className="brutalist-btn bg-white hover:bg-zinc-50 text-[#2a2a2a] border-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer shadow-[3.5px_3.5px_0px_#2a2a2a]">
              All Components
            </button>
          </Link>
        </div>
      </header>

      {/* Info Card */}
      <section className="w-full max-w-6xl px-4 md:px-8 z-10 mb-8">
        <div className="brutalist-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a]">
          <div className="flex-1 flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-2 border-2 border-[#2a2a2a] px-3.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-wtf-orange text-white shadow-[1.5px_1.5px_0px_#2a2a2a] tilt-right">
              Endpoint: /{slug}
            </div>
            <p className="text-sm font-sans font-medium text-zinc-700 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 border-t-2 md:border-t-0 md:border-l-2 border-zinc-200 pt-4 md:pt-0 md:pl-6 font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider min-w-[210px]">
            <div>📦 GSAP: ^3.15.0</div>
            <div>📦 @gsap/react: ^2.1.2</div>
            <div>
              ⚙️ ScrollTrigger:{" "}
              {usesScrollTrigger ? "✅ Required" : "❌ Not Used"}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="w-full max-w-6xl px-4 md:px-8 z-10 flex flex-col gap-8">
        {/* VS Code Style Editor Container */}
        <div className="brutalist-card bg-[#121212] overflow-hidden flex flex-col border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a]">
          {/* Top Bar: macOS circles & Actions */}
          <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-4 py-3 flex items-center justify-between">
            {/* Left: Window Dots & Filename */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dfa224]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1a9c2b]" />
              </div>
              <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md flex items-center gap-2 shadow-[1px_1px_0px_rgba(0,0,0,0.2)]">
                {getFileIcon(activeTab.file)}
                {activeTab.file}
              </span>
            </div>

            {/* Right: Copy & Download actions */}
            <div
              className={`flex items-center gap-3 ${!isAuthenticated ? "opacity-50 pointer-events-none" : ""}`}
            >
              <button
                onClick={handleCopy}
                className="brutalist-btn bg-white hover:bg-zinc-50 text-[#2a2a2a] font-mono text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-[2.5px_2.5px_0px_#000] transition-all duration-75 active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
              >
                {copied ? "✓ Copied!" : "📋 Copy Code"}
              </button>
              <button
                onClick={handleDownload}
                className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-black font-mono text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-[2.5px_2.5px_0px_#000] transition-all duration-75 active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
              >
                💾 Download
              </button>
            </div>
          </div>

          {/* VS Code Style Tab Bar */}
          <div className="bg-[#1c1c1c] border-b-2 border-[#2a2a2a] flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setIsExpanded(false);
                  }}
                  className={`font-mono text-xs font-bold px-6 py-3.5 border-r border-[#2a2a2a] relative transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? "bg-[#121212] text-white border-t-2 border-t-wtf-orange font-black"
                      : "bg-[#181818] text-zinc-500 hover:text-zinc-300 hover:bg-[#151515]"
                  }`}
                >
                  {getFileIcon(tab.file)}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Code Body */}
          <div
            className={`relative font-mono text-[13px] bg-[#121212] py-5 px-4 flex items-start transition-all duration-300 ${isExpanded ? "" : "max-h-[380px] overflow-hidden"} ${blurClass}`}
          >
            {/* Line Numbers */}
            <pre className="select-none text-right pr-4 border-r border-zinc-800 text-zinc-650 min-w-[3.5rem] whitespace-pre scrollbar-none">
              {activeTab.code
                .split("\n")
                .map((_, i) => i + 1)
                .join("\n")}
            </pre>

            {/* Highlighted Code */}
            <pre className="pl-5 flex-1 overflow-x-auto text-[#abb2bf] scrollbar-none whitespace-pre select-text selection:bg-wtf-orange selection:text-white">
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>

            {/* Gradient Mask & View Whole Code Button */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent flex items-end justify-center pb-6">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] border-2 border-black font-mono font-bold text-xs py-2.5 px-6 rounded-lg uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_#000] flex items-center gap-2 transition-all duration-75 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
                >
                  <span>👁️ View Whole Code</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapse Button (shown only when expanded) */}
          {isExpanded && (
            <div className="bg-[#121212] py-3.5 flex justify-center border-t border-zinc-900">
              <button
                onClick={() => setIsExpanded(false)}
                className="brutalist-btn bg-white hover:bg-zinc-100 text-[#2a2a2a] border-2 border-black font-mono font-bold text-xs py-2 px-5 rounded-lg uppercase tracking-wider cursor-pointer shadow-[2.5px_2.5px_0px_#000] flex items-center gap-2 transition-all duration-75 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000]"
              >
                <span>Collapse Code</span>
              </button>
            </div>
          )}

          {/* Bottom VS Code Status Bar */}
          <div className="bg-[#007acc] text-white px-4 py-1 flex items-center justify-between text-[11px] font-mono select-none border-t border-[#2a2a2a]">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 hover:bg-[#008be6] px-1.5 py-0.5 rounded cursor-pointer">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.026 15c.538 0 .8-.324.8-.8v-3.06c0-.528-.27-.8-.8-.8H3.01c-.537 0-.8.272-.8.8v3.06c0 .476.263.8.8.8h2.016zM12.01 15c.537 0 .8-.324.8-.8v-3.06c0-.528-.263-.8-.8-.8H9.994c-.538 0-.8.272-.8.8v3.06c0 .476.262.8.8.8H12.01zM8.508 1.3c0-.173-.06-.324-.18-.45a.618.618 0 0 0-.448-.19.624.624 0 0 0-.449.19c-.12.126-.18.277-.18.45V4.31H1.8c-.18 0-.332.062-.455.187A.627.627 0 0 0 1.154 5c0 .182.061.334.184.457.123.123.276.185.457.185H7.25v8.543c0 .173.06.324.18.45.12.126.27.19.449.19a.618.618 0 0 0 .448-.19c.12-.126.18-.277.18-.45V5.642h5.578c.18 0 .332-.062.455-.187.123-.125.184-.277.184-.457s-.061-.334-.184-.457a.627.627 0 0 0-.457-.185H8.508V1.3z" />
                </svg>
                master*
              </span>
              <span className="flex items-center gap-1.5">
                <span>0 ⓧ</span>
                <span>0 ⚠</span>
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <span>Ln {activeTab.code.split("\n").length}, Col 1</span>
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span className="hover:bg-[#008be6] px-1.5 py-0.5 rounded cursor-pointer">
                {activeTab.file.endsWith(".tsx")
                  ? "TypeScript JSX"
                  : activeTab.file.endsWith(".js")
                    ? "JavaScript"
                    : activeTab.file.endsWith(".css")
                      ? "CSS"
                      : "Markdown"}
              </span>
              <span>Prettier</span>
            </div>
          </div>
        </div>

        {/* Setup Guide Container */}
        <div
          className={`brutalist-card p-8 bg-white flex flex-col gap-8 border-3 border-[#2a2a2a] shadow-[6px_6px_0px_#2a2a2a] ${blurClass}`}
        >
          <div className="border-b-3 border-[#2a2a2a] pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
              ⚙️ Setup & Integration Guide
            </h2>
            <p className="text-xs font-mono font-bold text-wtf-orange uppercase tracking-wider mt-1.5">
              How to install, import, and configure this animation in your
              project
            </p>
          </div>

          <div className="flex flex-col gap-8 font-sans font-medium text-zinc-700 leading-relaxed text-sm">
            {/* CLI Option (Recommended) */}
            <div className="flex gap-4 items-start pb-8 border-b-2 border-dashed border-zinc-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wtf-purple border-2 border-[#2a2a2a] text-white font-mono font-bold text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#2a2a2a] mt-1">
                💻
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none mt-1">
                  Option A: Install via CLI (Recommended)
                </h3>
                <p>
                  You can install this component directly into your project via
                  the TweenLabs CLI. It automatically creates the file and
                  configures dependencies:
                </p>
                <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[3px_3px_0px_#2a2a2a] max-w-md mt-1">
                  <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <div className="flex gap-2">
                      {(["npm", "pnpm", "yarn", "bun"] as const).map((pm) => (
                        <button
                          key={pm}
                          onClick={() => setPkgManager(pm)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            pkgManager === pm
                              ? "bg-wtf-orange text-white"
                              : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-350"
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>
                    <CopyButton text={getCliCommand(pkgManager, slug)} />
                  </div>
                  <div className="p-4 font-mono text-xs text-emerald-400 select-all">
                    {getCliCommand(pkgManager, slug)}
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Option */}
            <div className="flex flex-col gap-2 -mb-2 mt-2">
              <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none">
                Option B: Manual Installation
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Follow these steps to integrate the component into your project
                manually:
              </p>
            </div>

            {/* Step 1: Install Dependencies */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wtf-orange border-2 border-[#2a2a2a] text-white font-mono font-bold text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#2a2a2a] mt-1">
                1
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none mt-1">
                  Install Packages
                </h3>
                <p>
                  First, install GSAP and its official React hook helper library
                  (
                  <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-200 rounded font-mono text-xs font-bold text-wtf-orange">
                    @gsap/react
                  </code>
                  ).
                </p>
                <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[3px_3px_0px_#2a2a2a] max-w-md mt-1">
                  <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <div className="flex gap-2">
                      {(["npm", "pnpm", "yarn", "bun"] as const).map((pm) => (
                        <button
                          key={pm}
                          onClick={() => setPkgManager(pm)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            pkgManager === pm
                              ? "bg-wtf-orange text-white"
                              : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-350"
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>
                    <CopyButton text={getInstallCommand(pkgManager)} />
                  </div>
                  <div className="p-4 font-mono text-xs text-emerald-400 select-all">
                    {getInstallCommand(pkgManager)}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Add Required CSS */}
            {cssCode && (
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wtf-purple border-2 border-[#2a2a2a] text-white font-mono font-bold text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#2a2a2a] mt-1">
                  2
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none mt-1">
                    Add Required CSS Styles
                  </h3>
                  <p>
                    Copy the styles from the{" "}
                    <span className="font-bold text-black underline decoration-wtf-purple decoration-2">
                      Required CSS
                    </span>{" "}
                    tab above, or open the{" "}
                    <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-200 rounded font-mono text-xs font-bold text-wtf-purple">
                      styles.css
                    </code>{" "}
                    file that was automatically downloaded with your component.
                    Paste these classes into your global stylesheet (e.g.{" "}
                    <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-200 rounded font-mono text-xs font-bold text-wtf-purple">
                      src/app/globals.css
                    </code>{" "}
                    or similar).
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Add Component File */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wtf-green border-2 border-[#2a2a2a] text-white font-mono font-bold text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#2a2a2a] mt-1">
                3
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none mt-1">
                  Create Component File
                </h3>
                <p>
                  Create a new file in your React or Next.js project (e.g.{" "}
                  <code className="bg-zinc-100 px-1.5 py-0.5 border border-zinc-200 rounded font-mono text-xs font-bold text-[#e55b3c]">
                    src/components/{componentName}.tsx
                  </code>
                  ) and paste the code from the{" "}
                  <span className="font-bold text-black underline decoration-wtf-green decoration-2">
                    Standalone React Component
                  </span>{" "}
                  tab above. If no standalone tab is available, copy the full
                  page file code and adjust the routing logic for your needs.
                </p>
              </div>
            </div>

            {/* Step 4: ScrollTrigger (If needed) */}
            {usesScrollTrigger && (
              <div className="flex gap-4 items-start border-l-4 border-wtf-yellow pl-4 my-2">
                <div className="flex-1 flex flex-col gap-2">
                  <h4 className="font-serif font-black uppercase text-sm text-[#2a2a2a] flex items-center gap-2">
                    ⚠️ ScrollTrigger Plugin Notice
                  </h4>
                  <p className="text-xs text-zinc-650 leading-relaxed">
                    This component uses scroll-triggered timing events. Make
                    sure to register the plugin as shown inside the code:
                  </p>
                  <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[2.5px_2.5px_0px_#2a2a2a] max-w-xl mt-1">
                    <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span>GSAP Registration</span>
                      <CopyButton
                        text={`import { ScrollTrigger } from "gsap/ScrollTrigger";\ngsap.registerPlugin(useGSAP, ScrollTrigger);`}
                      />
                    </div>
                    <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto scrollbar-none">
                      {`import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Import & Render */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wtf-blue border-2 border-[#2a2a2a] text-white font-mono font-bold text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#2a2a2a] mt-1">
                4
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none mt-1">
                  Import & Render
                </h3>
                <p>
                  Import and render the component in your page or view layout:
                </p>
                <div className="border-2 border-[#2a2a2a] rounded-lg overflow-hidden bg-[#121212] shadow-[3px_3px_0px_#2a2a2a] max-w-xl mt-1">
                  <div className="bg-[#181818] border-b-2 border-[#2a2a2a] px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>App Page</span>
                    <CopyButton
                      text={`import ${componentName} from "@/components/${componentName}";\n\nexport default function Page() {\n  return (\n    <main className="min-h-screen p-8 bg-[#f5f5f5] flex items-center justify-center">\n      <${componentName} />\n    </main>\n  );\n}`}
                    />
                  </div>
                  <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto scrollbar-none">
                    {`import ${componentName} from "@/components/${componentName}";

export default function Page() {
  return (
    <main className="min-h-screen p-8 bg-[#f5f5f5] flex items-center justify-center">
      <${componentName} />
    </main>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Custom markdown customization section from HOW_TO_USE.md if present */}
            {customization && customization.trim() !== "" && (
              <div className="mt-8 border-t-2 border-zinc-200 pt-8 flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wtf-purple border-2 border-[#2a2a2a] text-white font-mono font-bold text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#2a2a2a] mt-1">
                  💡
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <h3 className="text-lg font-serif font-black uppercase text-[#2a2a2a] leading-none mt-1">
                    Customization & Component Properties
                  </h3>
                  <div className="prose prose-zinc max-w-none text-zinc-750 font-sans font-medium text-sm">
                    {renderMarkdown(customization)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
