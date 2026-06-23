"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useEffect, useRef } from "react";
import PreviewLenis from "./PreviewLenis";

/**
 * EmbedBridge — Only active when `?embed=true` is present.
 * Receives postMessage commands from the parent AnimationMiniPreview
 * and drives automated interactions inside the iframe.
 *
 * Interaction modes:
 * - auto-scroll-start: Bounce scroll up/down (ScrollTrigger components)
 * - auto-cursor-start: Waypoint-based cursor simulation (FluidCursor, BentoGrid, etc.)
 * - auto-tabs-start:   Click tabs sequentially (TabsMotion)
 * - auto-click-start:  Click interactive buttons in order (Accordion)
 */
function EmbedBridge() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";
  const scrollRafRef = useRef<number | null>(null);
  const cursorRafRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isEmbed) return;

    // Hide back button and scrollbars in embed mode
    try {
      const backBtn = document.getElementById("preview-back-btn");
      if (backBtn) backBtn.style.display = "none";

      const scroller = document.getElementById("main-scroller");
      if (scroller) {
        scroller.style.scrollbarWidth = "none";
        scroller.classList.remove("scroll-smooth");
        scroller.scrollTop = 0;
      }
      document.documentElement.style.scrollbarWidth = "none";
    } catch {
      // SSR guard — DOM may not be available
    }

    /** Cancel all running interactions and free resources */
    const stopAll = () => {
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      if (cursorRafRef.current != null) {
        cancelAnimationFrame(cursorRafRef.current);
        cursorRafRef.current = null;
      }
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // ── Auto-scroll: bounce up/down ──
    const startAutoScroll = (el: HTMLElement) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 20) return;

      let dir = 1;
      let pos = el.scrollTop;
      const speed = 5; // ~300px/s at 60fps

      const tick = () => {
        pos += speed * dir;
        if (pos >= maxScroll) {
          pos = maxScroll;
          dir = -1;
        } else if (pos <= 0) {
          pos = 0;
          dir = 1;
        }
        el.scrollTop = pos;
        scrollRafRef.current = requestAnimationFrame(tick);
      };

      scrollRafRef.current = requestAnimationFrame(tick);
    };

    // ── Auto-cursor: waypoint-based, React-compatible ──
    const startAutoCursor = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return; // Hidden/collapsed iframe guard

      // Priority: elements with cursor-specific data attributes (FluidCursor)
      const cursorTargets = document.querySelectorAll<HTMLElement>(
        "[data-cursor-text], [data-cursor-target]",
      );

      // General: card/button surfaces (BentoGrid, MagneticDock, KineticText)
      const generalEls = document.querySelectorAll<HTMLElement>(
        "main > div, main button, [class*='grid'] > div, [class*='flex'] > button",
      );

      type WP = { x: number; y: number; pauseMs: number };
      const waypoints: WP[] = [];

      // Cursor targets get longer dwell time
      cursorTargets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 30 && r.height > 30) {
          waypoints.push({
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            pauseMs: 1200,
          });
        }
      });

      // Fallback to visible interactive surfaces
      if (waypoints.length === 0) {
        generalEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (
            r.width > 40 &&
            r.height > 40 &&
            r.top >= 0 &&
            r.bottom <= h &&
            r.left >= 0 &&
            r.right <= w
          ) {
            waypoints.push({
              x: r.left + r.width / 2,
              y: r.top + r.height / 2,
              pauseMs: 800,
            });
          }
        });
      }

      // Last resort: sweep viewport
      if (waypoints.length === 0) {
        waypoints.push(
          { x: w * 0.25, y: h * 0.3, pauseMs: 500 },
          { x: w * 0.75, y: h * 0.3, pauseMs: 500 },
          { x: w * 0.5, y: h * 0.6, pauseMs: 500 },
          { x: w * 0.25, y: h * 0.7, pauseMs: 500 },
          { x: w * 0.75, y: h * 0.7, pauseMs: 500 },
        );
      }

      const selected = waypoints.slice(0, 8);
      if (selected.length === 0) return;

      let wpIdx = 0;
      let fromX = w / 2;
      let fromY = h / 2;
      let toX = selected[0].x;
      let toY = selected[0].y;
      let moveStart = performance.now();
      const moveDur = 700; // ms between waypoints
      let pausing = false;
      let pauseEnd = 0;
      let lastHoverEl: HTMLElement | null = null;

      /** Walk up from hit element to find a cursor-interactive ancestor */
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

      /** Dispatch synthetic mouse events at (x, y) */
      const dispatch = (x: number, y: number) => {
        // Clamp to viewport
        const cx = Math.max(0, Math.min(x, w - 1));
        const cy = Math.max(0, Math.min(y, h - 1));

        const hitEl = document.elementFromPoint(cx, cy);
        if (!hitEl) return;

        const interEl = findInteractive(hitEl);

        // mouseover/mouseout for React onMouseEnter/onMouseLeave
        if (interEl !== lastHoverEl) {
          if (lastHoverEl) {
            lastHoverEl.dispatchEvent(
              new MouseEvent("mouseout", {
                clientX: cx,
                clientY: cy,
                bubbles: true,
                relatedTarget: interEl || document.body,
              }),
            );
          }
          if (interEl) {
            interEl.dispatchEvent(
              new MouseEvent("mouseover", {
                clientX: cx,
                clientY: cy,
                bubbles: true,
                relatedTarget: lastHoverEl || document.body,
              }),
            );
          }
          lastHoverEl = interEl;
        }

        // mousemove on element — bubbles to React onMouseMove handlers
        hitEl.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: cx,
            clientY: cy,
            bubbles: true,
            cancelable: true,
          }),
        );

        // mousemove on window — for global listeners (FluidCursor)
        window.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: cx,
            clientY: cy,
            bubbles: true,
          }),
        );
      };

      /** Cubic ease-in-out */
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

      const tick = () => {
        const now = performance.now();

        if (pausing) {
          dispatch(toX, toY);
          if (now >= pauseEnd) {
            pausing = false;
            fromX = toX;
            fromY = toY;
            wpIdx = (wpIdx + 1) % selected.length;
            toX = selected[wpIdx].x;
            toY = selected[wpIdx].y;
            moveStart = now;
          }
        } else {
          const progress = Math.min((now - moveStart) / moveDur, 1);
          const e = ease(progress);
          dispatch(fromX + (toX - fromX) * e, fromY + (toY - fromY) * e);

          if (progress >= 1) {
            pausing = true;
            pauseEnd = now + selected[wpIdx].pauseMs;
          }
        }

        cursorRafRef.current = requestAnimationFrame(tick);
      };

      cursorRafRef.current = requestAnimationFrame(tick);
    };

    // ── Auto-tabs: cycle tab buttons ──
    const startAutoTabs = () => {
      const tabBtns = document.querySelectorAll<HTMLElement>(
        ".tab-btn, [role='tab'], [data-tab-trigger]",
      );
      if (tabBtns.length === 0) return;

      let idx = 0;
      tabBtns[0]?.click();

      intervalRef.current = setInterval(() => {
        idx = (idx + 1) % tabBtns.length;
        tabBtns[idx]?.click();
      }, 1800);
    };

    // ── Auto-click: click interactive elements sequentially ──
    const startAutoClick = () => {
      const mainEl = document.querySelector("main") || document.body;
      const btns = mainEl.querySelectorAll<HTMLElement>(
        "button.cursor-pointer, [data-accordion-trigger]",
      );
      if (btns.length === 0) return;

      let idx = 0;
      timeoutRef.current = setTimeout(() => btns[0]?.click(), 500);

      intervalRef.current = setInterval(() => {
        idx = (idx + 1) % btns.length;
        btns[idx]?.click();
      }, 2200);
    };

    // ── Message handler ──
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "tweenlabs-embed") return;

      const el = document.getElementById("main-scroller");
      if (!el) return;

      stopAll(); // Always clean up before starting new interaction

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
