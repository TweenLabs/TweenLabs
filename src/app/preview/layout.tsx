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
  const cursorRafRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isEmbed) return;

    // Hide back button and scrollbars when in embed mode
    const backBtn = document.getElementById("preview-back-btn");
    if (backBtn) backBtn.style.display = "none";

    const scroller = document.getElementById("main-scroller");
    if (scroller) {
      scroller.style.scrollbarWidth = "none";
      scroller.classList.remove("scroll-smooth");
      scroller.scrollTop = 0;
    }
    document.documentElement.style.scrollbarWidth = "none";

    // ── Cleanup helper ──
    const stopAll = () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      if (cursorRafRef.current) {
        cancelAnimationFrame(cursorRafRef.current);
        cursorRafRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // ── Interaction: Auto-scroll (bounce up/down) ──
    const startAutoScroll = (el: HTMLElement) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 20) return;

      let direction = 1;
      let position = el.scrollTop;
      const speed = 5;

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

      scrollRafRef.current = requestAnimationFrame(tick);
    };

    // ── Interaction: Auto-cursor (waypoint-based, React-compatible) ──
    const startAutoCursor = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Priority targets: elements that have cursor-specific interactivity
      const cursorTargets = document.querySelectorAll<HTMLElement>(
        "[data-cursor-text], [data-cursor-target]",
      );
      // Fallback: general interactive elements
      const generalEls = document.querySelectorAll<HTMLElement>(
        "button, a, .brutalist-card",
      );

      type WP = { x: number; y: number; pauseMs: number; el?: HTMLElement };
      const waypoints: WP[] = [];

      // Build waypoints from cursor targets first (longer pause)
      cursorTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 10 && rect.height > 10) {
          waypoints.push({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            pauseMs: 1200,
            el,
          });
        }
      });

      // Then add general elements with shorter pause
      if (waypoints.length === 0) {
        generalEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 10 && rect.height > 10) {
            waypoints.push({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              pauseMs: 800,
              el,
            });
          }
        });
      }

      // Fallback ambient points
      if (waypoints.length === 0) {
        waypoints.push(
          { x: w * 0.3, y: h * 0.3, pauseMs: 500 },
          { x: w * 0.7, y: h * 0.4, pauseMs: 500 },
          { x: w * 0.5, y: h * 0.7, pauseMs: 500 },
        );
      }

      const selected = waypoints.slice(0, 8);

      let wpIdx = 0;
      let fromX = w / 2;
      let fromY = h / 2;
      let toX = selected[0].x;
      let toY = selected[0].y;
      let moveStartTime = performance.now();
      const moveDuration = 700;
      let isPausing = false;
      let pauseEnd = 0;
      let lastHoveredEl: HTMLElement | null = null;

      // Find the interactive ancestor (the element with the event handler)
      const findInteractive = (el: Element | null): HTMLElement | null => {
        let node = el;
        while (node && node !== document.body) {
          if (
            node instanceof HTMLElement &&
            (node.hasAttribute("data-cursor-text") ||
              node.hasAttribute("data-cursor-target"))
          ) {
            return node;
          }
          node = node.parentElement;
        }
        return null;
      };

      const dispatchCursor = (x: number, y: number) => {
        const hitEl = document.elementFromPoint(x, y);
        const interactiveEl = findInteractive(hitEl);

        // React hover: use mouseover/mouseout which React's delegation catches
        if (interactiveEl !== lastHoveredEl) {
          if (lastHoveredEl) {
            // Trigger mouseout → React processes this as onMouseLeave
            lastHoveredEl.dispatchEvent(
              new MouseEvent("mouseout", {
                clientX: x,
                clientY: y,
                bubbles: true,
                relatedTarget: interactiveEl || document.body,
              }),
            );
          }
          if (interactiveEl) {
            // Trigger mouseover → React processes this as onMouseEnter
            interactiveEl.dispatchEvent(
              new MouseEvent("mouseover", {
                clientX: x,
                clientY: y,
                bubbles: true,
                relatedTarget: lastHoveredEl || document.body,
              }),
            );
          }
          lastHoveredEl = interactiveEl;
        }

        // Always dispatch mousemove on window for cursor tracking (GSAP quickTo)
        window.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: x,
            clientY: y,
            bubbles: true,
          }),
        );
      };

      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

      const tick = () => {
        const now = performance.now();

        if (isPausing) {
          dispatchCursor(toX, toY);
          if (now >= pauseEnd) {
            isPausing = false;
            fromX = toX;
            fromY = toY;
            wpIdx = (wpIdx + 1) % selected.length;
            toX = selected[wpIdx].x;
            toY = selected[wpIdx].y;
            moveStartTime = now;
          }
        } else {
          const elapsed = now - moveStartTime;
          const progress = Math.min(elapsed / moveDuration, 1);
          const eased = ease(progress);

          const x = fromX + (toX - fromX) * eased;
          const y = fromY + (toY - fromY) * eased;
          dispatchCursor(x, y);

          if (progress >= 1) {
            isPausing = true;
            pauseEnd = now + selected[wpIdx].pauseMs;
          }
        }

        cursorRafRef.current = requestAnimationFrame(tick);
      };

      cursorRafRef.current = requestAnimationFrame(tick);
    };

    // ── Interaction: Auto-tabs (click tab buttons sequentially) ──
    const startAutoTabs = () => {
      const tabBtns = document.querySelectorAll<HTMLElement>(
        ".tab-btn, [role='tab'], [data-tab-trigger]",
      );
      if (tabBtns.length === 0) return;

      let index = 0;

      // Click first tab immediately
      tabBtns[0]?.click();

      intervalRef.current = setInterval(() => {
        index = (index + 1) % tabBtns.length;
        tabBtns[index]?.click();
      }, 1800);
    };

    // ── Interaction: Auto-click (click through interactive elements) ──
    const startAutoClick = () => {
      // Find clickable accordion/interactive triggers
      const triggers = document.querySelectorAll<HTMLElement>(
        "button.cursor-pointer, [data-accordion-trigger]",
      );

      // Filter to meaningful interactive buttons (not nav/utility buttons)
      const mainContent = document.querySelector("main") || document.body;
      const contentBtns = mainContent.querySelectorAll<HTMLElement>(
        "button.cursor-pointer",
      );
      const btns = contentBtns.length > 0 ? contentBtns : triggers;
      if (btns.length === 0) return;

      let index = 0;

      // Click first item after a brief pause
      setTimeout(() => btns[0]?.click(), 500);

      intervalRef.current = setInterval(() => {
        index = (index + 1) % btns.length;
        btns[index]?.click();
      }, 2200);
    };

    // ── Message handler ──
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "tweenlabs-embed") return;

      const el = document.getElementById("main-scroller");
      if (!el) return;

      // Stop any previous interaction before starting a new one
      stopAll();

      switch (e.data.command) {
        case "auto-scroll-start":
          startAutoScroll(el);
          break;
        case "auto-cursor-start":
          startAutoCursor();
          break;
        case "auto-tabs-start":
          startAutoTabs();
          break;
        case "auto-click-start":
          startAutoClick();
          break;
        case "auto-scroll-stop":
          el.scrollTop = 0;
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
      stopAll();
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
