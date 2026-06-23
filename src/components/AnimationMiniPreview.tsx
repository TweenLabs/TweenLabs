"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface AnimationMiniPreviewProps {
  componentName: string;
  isHovered: boolean;
  previewImage?: string;
  embedInteraction?: "scroll" | "cursor" | "tabs" | "click-sequence";
  embedZoom?: number;
}

/**
 * Production-grade iframe preview:
 * - Shows a static thumbnail by default (attractive, zero cost)
 * - Iframe loads only on hover (debounced 50ms)
 * - Auto-scroll starts once iframe renders
 * - Iframe destroyed on unhover (frees memory + fresh animations next time)
 * - ResizeObserver for efficient scale tracking
 */
export default function AnimationMiniPreview({
  componentName,
  isHovered,
  previewImage,
  embedInteraction = "scroll",
  embedZoom = 1440,
}: AnimationMiniPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.25);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Iframe base dimensions (lower embedZoom = more zoomed in)
  const IFRAME_W = embedZoom;
  const IFRAME_H = Math.round((embedZoom * 9) / 16);

  // ── Scale calculation via ResizeObserver ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 360;
      setScale(width / IFRAME_W);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [IFRAME_W]);

  // ── Hover lifecycle: load on hover, destroy on unhover ──
  useEffect(() => {
    if (isHovered) {
      // Debounce: only load after 50ms of sustained hover
      hoverTimerRef.current = setTimeout(() => {
        setIframeSrc(`/preview/${componentName}?embed=true`);
      }, 50);
    } else {
      // Cancel any pending load
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      // Destroy iframe completely — frees memory, resets all animations
      setIframeSrc(null);
      setIframeReady(false);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [isHovered, componentName]);

  // ── Start interaction once iframe is ready ──
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;

    const commandMap: Record<string, string> = {
      scroll: "auto-scroll-start",
      cursor: "auto-cursor-start",
      tabs: "auto-tabs-start",
      "click-sequence": "auto-click-start",
    };

    // Cursor needs more time: IntersectionObserver + GSAP quickTo setup
    const delay = embedInteraction === "cursor" ? 600 : 400;

    const timer = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "tweenlabs-embed",
          command: commandMap[embedInteraction] || "auto-scroll-start",
        },
        "*",
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [iframeReady, embedInteraction]);

  const handleIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-[#f0eadf] border-2 border-[#2a2a2a] rounded-lg overflow-hidden select-none shadow-[2px_2px_0px_rgba(42,42,42,0.15)]"
    >
      {/* ── Static thumbnail (always rendered, hidden when iframe is ready) ── */}
      {previewImage ? (
        <Image
          src={previewImage}
          alt={`${componentName} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover object-top z-0 transition-opacity duration-300 ${iframeReady ? "opacity-0" : "opacity-100"}`}
          priority={false}
        />
      ) : (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-0 transition-opacity duration-300 ${iframeReady ? "opacity-0" : "opacity-100"}`}
        >
          <div className="dot-grid opacity-15 absolute inset-0 pointer-events-none" />
          <div className="w-8 h-8 rounded-full border-2 border-[#2a2a2a]/20 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-[#2a2a2a]/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-mono text-[9px] text-[#2a2a2a]/30 uppercase tracking-[0.15em] mt-2">
            Hover to preview
          </span>
        </div>
      )}

      {/* ── Loading spinner (iframe created but not yet rendered) ── */}
      {iframeSrc && !iframeReady && previewImage && (
        <div className="absolute bottom-2 right-2 z-30">
          <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {iframeSrc && !iframeReady && !previewImage && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-[#2a2a2a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Live iframe (only exists while hovered) ── */}
      {iframeSrc && (
        <iframe
          ref={iframeRef}
          title={`${componentName} preview`}
          src={iframeSrc}
          onLoad={handleIframeLoad}
          scrolling="no"
          className="absolute top-0 left-0 border-none pointer-events-none select-none z-10 transition-opacity duration-300"
          style={{
            width: `${IFRAME_W}px`,
            height: `${IFRAME_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            opacity: iframeReady ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
