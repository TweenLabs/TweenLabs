"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ComponentData {
  id: string;
  name: string;
  slug: string;
  pageCode: string;
  howToMd: string;
}

export default function LlmFullClient({
  components,
}: {
  components: ComponentData[];
}) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  // Sync active component with URL hash on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      const found = components.some((c) => c.slug === hash);
      if (found) {
        setActiveSlug(hash);
      } else if (components[0]) {
        setActiveSlug(components[0].slug);
      }
    }
  }, [components]);

  const activeComp = components.find((c) => c.slug === activeSlug) || components[0];

  // Helper function to update active slug and hash
  const handleSelect = (slug: string) => {
    setActiveSlug(slug);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#${slug}`);
    }
  };

  // Basic MD parser for the component guidelines
  const parseMarkdown = (md: string) => {
    if (!md) return "";
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#2a2a2a]">$1</strong>');
    
    // Replace Code tags
    html = html.replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-zinc-100 border border-zinc-200 rounded px-1 text-wtf-orange font-bold">$1</code>');

    // Replace headings
    html = html.replace(/^### (.*)$/gm, '<h4 class="text-sm font-mono font-bold uppercase text-[#2a2a2a] mt-4 mb-2">$1</h4>');
    html = html.replace(/^## (.*)$/gm, '<h3 class="text-base font-serif font-black uppercase text-[#2a2a2a] mt-6 border-b border-zinc-200 pb-1 mb-3">$1</h3>');

    // Replace bullet points
    html = html.replace(/^  -[ \t]+(.*)$/gm, '<li class="ml-6 list-circle text-xs text-zinc-650 my-0.5">$1</li>');
    html = html.replace(/^-[ \t]+(.*)$/gm, '<li class="ml-3 list-disc text-xs text-zinc-650 my-1">$1</li>');

    // Paragraph split
    const paragraphs = html.split(/\n\n+/);
    return paragraphs.map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      if (trimmed.match(/^<(h3|h4|li|ul|ol|pre)/)) {
        return trimmed;
      }
      return `<p class="text-xs md:text-sm text-zinc-650 leading-relaxed font-medium mb-3">${trimmed.replace(/\n/g, "<br />")}</p>`;
    }).join("\n");
  };

  if (!activeComp) {
    return <div className="p-8 text-center font-mono">Loading laboratory index...</div>;
  }

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center pt-24 pb-16 selection:bg-wtf-yellow selection:text-black">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <main className="w-full max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-10 z-10">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-3 border-[#2a2a2a] pb-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex self-start items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a] rotate-1">
              <span>Full Repository Context</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black uppercase text-[#2a2a2a] tracking-tight">
              TweenLabs Consolidated Codebase
            </h1>
            <p className="text-xs md:text-sm text-zinc-600 max-w-2xl font-medium">
              This registry provides the full, ready-to-copy sandbox code and documentation for all 
              18 components. Styled like a documentation hub.
            </p>
          </div>
          <div className="flex gap-3 self-stretch md:self-auto justify-end">
            <a
              href="/llms-full.txt"
              target="_blank"
              className="brutalist-btn bg-white hover:bg-wtf-purple hover:text-white text-xs font-mono font-bold px-4 py-2 rounded-md uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center"
            >
              Raw File ↗
            </a>
            <Link
              href="/"
              className="brutalist-btn bg-wtf-yellow text-black text-xs font-mono font-bold px-4 py-2 rounded-md uppercase tracking-wider cursor-pointer text-center flex items-center"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Responsive Mobile Dropdown */}
        <div className="w-full lg:hidden brutalist-card bg-white p-4 shadow-[4px_4px_0px_#2a2a2a] flex flex-col gap-2">
          <label className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-purple">
            Select Component
          </label>
          <select
            value={activeSlug}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full border-3 border-[#2a2a2a] px-3 py-2 font-mono font-bold rounded-lg focus:outline-none focus:bg-[#fafaf9] shadow-[3px_3px_0px_#2a2a2a] text-xs bg-white cursor-pointer"
          >
            {components.map((comp) => (
              <option key={comp.id} value={comp.slug}>
                {comp.id} // {comp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sidebar & Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents Sidebar */}
          <aside className="lg:col-span-3 brutalist-card bg-white p-6 shadow-[4px_4px_0px_#2a2a2a] sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto hidden lg:block">
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-purple border-b-2 border-zinc-200 pb-2 mb-4">
              Component Index
            </h3>
            <nav className="flex flex-col gap-2">
              {components.map((comp) => {
                const isActive = comp.slug === activeSlug;
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleSelect(comp.slug)}
                    className={`font-mono text-[10px] font-bold text-left p-2 rounded-md transition-all duration-100 uppercase truncate cursor-pointer w-full ${
                      isActive
                        ? "border-2 border-[#2a2a2a] bg-wtf-yellow text-black shadow-[2px_2px_0px_#2a2a2a] -translate-x-[2px] -translate-y-[2px]"
                        : "text-zinc-500 hover:text-wtf-purple hover:translate-x-1 border-2 border-transparent"
                    }`}
                  >
                    {comp.id} // {comp.name}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Active Content Panel */}
          <section className="lg:col-span-9">
            <article className="brutalist-card bg-white p-6 md:p-8 shadow-[6px_6px_0px_#2a2a2a] flex flex-col gap-6 relative">
              {/* ID Badge */}
              <div className="absolute top-4 right-4 font-mono font-bold text-xs text-zinc-400">
                [ COMPONENT {activeComp.id} ]
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-serif font-black uppercase text-[#2a2a2a]">
                  {activeComp.name}
                </h2>
                <div className="flex flex-wrap gap-4 mt-2 font-mono text-[10px] font-bold">
                  <Link href={`/${activeComp.slug}`} className="text-wtf-orange hover:underline uppercase">
                    → Live Sandbox Demo
                  </Link>
                  <Link href={`/code/${activeComp.slug}`} className="text-wtf-purple hover:underline uppercase">
                    → Interactive Code Page
                  </Link>
                </div>
              </div>

              {/* Collapsible Sandbox Code */}
              {activeComp.pageCode && (
                <details className="group border-2 border-[#2a2a2a] rounded-xl bg-zinc-50 overflow-hidden shadow-[2px_2px_0px_#2a2a2a] transition-all" open>
                  <summary className="font-mono font-bold text-xs uppercase px-4 py-3 bg-zinc-100 hover:bg-zinc-200 cursor-pointer select-none flex justify-between items-center border-b-2 border-transparent group-open:border-[#2a2a2a]">
                    <span>Toggle Sandbox Code ({activeComp.slug}/page.tsx)</span>
                    <span className="font-bold text-wtf-orange transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 overflow-x-auto max-h-[500px] text-xs font-mono text-zinc-700 bg-zinc-900 border-t border-zinc-200">
                    <pre className="text-zinc-200 whitespace-pre leading-relaxed">{activeComp.pageCode}</pre>
                  </div>
                </details>
              )}

              {/* HOW TO USE MD instructions */}
              {activeComp.howToMd && (
                <div className="border-t-2 border-zinc-150 pt-6">
                  <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-orange mb-3">
                    Integration Instructions
                  </h3>
                  <div
                    className="markdown-block text-xs md:text-sm"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(activeComp.howToMd) }}
                  />
                </div>
              )}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
