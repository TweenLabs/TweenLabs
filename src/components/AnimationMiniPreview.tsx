"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIframePool } from "@/hooks/useIframePool";

interface AnimationMiniPreviewProps {
  componentName: string;
  isHovered: boolean;
  /** Static thumbnail path (e.g. "/previews/FlipCards.webp") */
  previewImage?: string;
  /** Interaction mode sent to EmbedBridge via postMessage */
  embedInteraction?: "scroll" | "cursor" | "tabs" | "click-sequence";
}

/**
 * Industry-grade iframe preview with three-layer optimization:
 *
 * Layer 1 — Route prefetch:
 *   <link rel="prefetch"> injected when card enters viewport (~5KB HTML).
 *   No rendering, no JS execution — just browser cache warming.
 *
 * Layer 2 — LRU iframe pool:
 *   Max 4 concurrent iframes globally. Hover requests a pool slot;
 *   LRU eviction destroys the oldest cached iframe when pool is full.
 *   Re-hover within 30s is instant (iframe is still alive in the pool).
 *
 * Layer 3 — GPU compositing:
 *   Quantised scale, will-change, backface-visibility, translate3d
 *   for smooth animations inside scaled iframes.
 */
export default function AnimationMiniPreview({
  componentName,
  isHovered,
  previewImage,
  embedInteraction = "scroll",
}: AnimationMiniPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.25);
  const [iframeReady, setIframeReady] = useState(false);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { hasSlot, requestSlot, releaseSlot } = useIframePool(componentName);

  // ── Scale calculation via ResizeObserver (debounced + quantised) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) {
        if (rafId != null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const raw = width / 1440;
          setScale(Math.ceil(raw * 200) / 200);
        });
      }
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Layer 1: Viewport preload — prefetch HTML + request non-evicting pool slot ──
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let prefetchDone = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Inject <link rel="preload"> — high priority, fetched immediately
          if (!prefetchDone) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.href = `/preview/${componentName}?embed=true`;
            link.as = "document";
            document.head.appendChild(link);
            prefetchDone = true;
          }

          // Request pool slot immediately — pool max (4) prevents excess
          requestSlot(false);
        } else {
          // Release slot when leaving viewport (unless currently hovered)
          if (!isHoveredRef.current) {
            releaseSlot();
          }
        }
      },
      { rootMargin: "500px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [componentName, requestSlot, releaseSlot]);

  // ── Layer 2: Hover lifecycle — force slot on hover (evicts LRU), cache on unhover ──
  useEffect(() => {
    if (isHovered) {
      // Cancel any pending release
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
      // Force-request a slot (evicts LRU if pool is full)
      requestSlot(true);
    } else {
      // Keep cached for 30s after unhover for instant re-hover
      releaseTimerRef.current = setTimeout(() => {
        releaseSlot();
      }, 30_000);
    }

    return () => {
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
    };
  }, [isHovered, requestSlot, releaseSlot]);

  // ── Clean up pool slot on unmount (page navigation) ──
  useEffect(() => {
    return () => releaseSlot();
  }, [releaseSlot]);

  // ── Reset ready state when slot is lost (LRU eviction) ──
  useEffect(() => {
    if (!hasSlot) {
      setIframeReady(false);
    }
  }, [hasSlot]);

  // ── Interaction commands — always restart from fresh state ──
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;

    const win = iframeRef.current.contentWindow;

    if (isHovered) {
      const commandMap: Record<string, string> = {
        scroll: "auto-scroll-start",
        cursor: "auto-cursor-start",
        tabs: "auto-tabs-start",
        "click-sequence": "auto-click-start",
      };

      try {
        win.postMessage(
          {
            type: "tweenlabs-embed",
            command: commandMap[embedInteraction] || "auto-scroll-start",
          },
          window.location.origin,
        );
      } catch {
        // Iframe may have been destroyed
      }
    } else {
      try {
        win.postMessage(
          { type: "tweenlabs-embed", command: "stop-all" },
          window.location.origin,
        );
      } catch {
        // Iframe may have been destroyed
      }
    }
  }, [isHovered, iframeReady, embedInteraction]);

  const [imgError, setImgError] = useState(false);
  const handleIframeLoad = useCallback(() => setIframeReady(true), []);

  // Iframe only mounts when this component has a pool slot
  const iframeSrc = hasSlot
    ? `/preview/${componentName}?embed=true`
    : null;

  // Show iframe at full opacity only when hovered AND ready
  const showIframe = isHovered && iframeReady;

  /** Fallback placeholder shown when no image or image fails to load */
  const placeholder = (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-0 transition-opacity duration-300 ${showIframe ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
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
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-[#f0eadf] border-2 border-[#2a2a2a] rounded-lg overflow-hidden select-none shadow-[2px_2px_0px_rgba(42,42,42,0.15)]"
    >
      {/* ── Static thumbnail (fades when iframe shows) ── */}
      {previewImage && !imgError ? (
        <Image
          src={previewImage}
          alt={`${componentName} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover object-top z-0 transition-opacity duration-300 ${showIframe ? "opacity-0" : "opacity-100"}`}
          priority={false}
          onError={() => setImgError(true)}
        />
      ) : (
        placeholder
      )}

      {/* ── Loading indicator (only when hovered and iframe still loading) ── */}
      {iframeSrc && isHovered && !iframeReady && previewImage && !imgError && (
        <div className="absolute bottom-2 right-2 z-30">
          <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {iframeSrc && isHovered && !iframeReady && !previewImage && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-[#2a2a2a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Live iframe (pool-controlled, shown on hover) ── */}
      {iframeSrc && (
        <iframe
          ref={iframeRef}
          title={`${componentName} preview`}
          src={iframeSrc}
          onLoad={handleIframeLoad}
          scrolling="no"
          className="absolute top-0 left-0 border-none pointer-events-none select-none z-10"
          style={{
            width: "1440px",
            height: "810px",
            zoom: scale,
            opacity: showIframe ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
