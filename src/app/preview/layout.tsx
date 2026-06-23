"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useEffect, useRef } from "react";
import PreviewLenis from "./PreviewLenis";

/**
 * EmbedBridge — only renders when ?embed=true is in the URL.
 * Listens for postMessage commands from the parent page
 * to control auto-scroll without cross-origin contentDocument access.
 */
function EmbedBridge() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEmbed) return;

    // Hide back button and scrollbars when in embed mode
    const backBtn = document.getElementById("preview-back-btn");
    if (backBtn) backBtn.style.display = "none";

    const scroller = document.getElementById("main-scroller");
    if (scroller) {
      scroller.style.scrollbarWidth = "none";
      scroller.scrollTop = 0;
    }
    document.documentElement.style.scrollbarWidth = "none";

    // Listen for scroll commands from the parent card component
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "tweenlabs-embed") return;

      const el = document.getElementById("main-scroller");
      if (!el) return;

      switch (e.data.command) {
        case "auto-scroll-start": {
          const maxScroll = el.scrollHeight - el.clientHeight;
          if (maxScroll <= 20) break;

          let direction = 1;
          let position = el.scrollTop;
          const speed = 5; // ~480px/sec at 60fps — fast video-like scroll

          const tick = () => {
            position += speed * direction;
            if (position >= maxScroll) {
              position = maxScroll;
              direction = -1;
            } else if (position <= 0) {
              position = 0;
              direction = 1;
            }
            el.scrollTop = position;
            scrollRafRef.current = requestAnimationFrame(tick);
          };

          if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
          scrollRafRef.current = requestAnimationFrame(tick);
          break;
        }
        case "auto-scroll-stop": {
          if (scrollRafRef.current) {
            cancelAnimationFrame(scrollRafRef.current);
            scrollRafRef.current = null;
          }
          el.scrollTo({ top: 0, behavior: "smooth" });
          break;
        }
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isEmbed]);

  return null;
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";

  return (
    <div className="relative w-full h-svh bg-[#f0eadf] overflow-hidden">
      {/* Floating Brutalist Back Button at Top-Left */}
      <div
        id="preview-back-btn"
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 pointer-events-none"
      >
        <Link
          href={slug === "sandbox" ? "/playground" : `/components/${slug}`}
          className="pointer-events-auto group inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#2a2a2a] bg-white border-2 border-[#2a2a2a] rounded-lg px-4 py-2 shadow-[3px_3px_0px_#2a2a2a] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2a2a2a] active:translate-y-0.5 active:shadow-[1px_1px_0px_#2a2a2a] transition-all duration-150 cursor-pointer no-underline"
        >
          <svg
            className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {slug === "sandbox" ? "Playground" : "Back"}
        </Link>
      </div>

      <main
        id="main-scroller"
        className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#f0eadf] scroll-smooth scrollbar-none"
      >
        {children}
        <PreviewLenis />
      </main>

      {/* Embed bridge — only active when ?embed=true, wrapped in Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <EmbedBridge />
      </Suspense>
    </div>
  );
}
