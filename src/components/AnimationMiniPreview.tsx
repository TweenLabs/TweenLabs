"use client";

import { useEffect, useRef, useState } from "react";

interface AnimationMiniPreviewProps {
  componentName: string;
  isHovered: boolean;
}

export default function AnimationMiniPreview({
  componentName,
  isHovered,
}: AnimationMiniPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.3);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Dynamically calculate scale to fit the card container width
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        // clientWidth = inner width without border, so the iframe fills edge-to-edge
        const width = containerRef.current.clientWidth || 360;
        setScale(width / 1440);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Send postMessage commands to the iframe
  const sendCommand = (command: string) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage({ type: "tweenlabs-embed", command }, "*");
  };

  // On iframe load, mark as loaded (UI hiding is handled by ?embed=true in the preview layout)
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // On hover change, tell the iframe to start/stop auto-scrolling via postMessage
  useEffect(() => {
    if (!iframeLoaded) return;

    if (isHovered) {
      sendCommand("auto-scroll-start");
    } else {
      sendCommand("auto-scroll-stop");
    }
  }, [isHovered, iframeLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-[#f0eadf] border-2 border-[#2a2a2a] rounded-lg overflow-hidden select-none shadow-[2px_2px_0px_rgba(42,42,42,0.15)]"
    >
      {/* Background dot grid visible while loading */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none z-0" />

      {/* Real live iframe: loads /preview/ComponentName?embed=true */}
      <iframe
        ref={iframeRef}
        title={`${componentName} preview`}
        src={`/preview/${componentName}?embed=true`}
        onLoad={handleIframeLoad}
        loading="lazy"
        scrolling="no"
        className="absolute top-0 left-0 border-none pointer-events-none select-none z-10 transition-opacity duration-500"
        style={{
          width: "1440px",
          height: "810px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: iframeLoaded ? 1 : 0,
        }}
      />

      {/* Loading spinner */}
      {!iframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-[#2a2a2a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
