"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service in production
    console.error("Captured Render Error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex items-center justify-center p-4 selection:bg-wtf-yellow selection:text-black">
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 dot-grid pointer-events-none z-0"
        style={{ opacity: 0.2 }}
      />

      {/* Centered Brutalist Error Card */}
      <div className="z-10 w-full max-w-md brutalist-card p-8 md:p-10 bg-white flex flex-col items-center gap-6 text-center relative overflow-hidden">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 bg-wtf-red border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Application Error</span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#2a2a2a] leading-none uppercase"
          style={{ textShadow: "3px 3px 0px #c53b3a" }}
        >
          Something Went Wrong
        </h1>

        {/* Message and Debug details */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
            An unexpected error occurred during rendering. This might be due to
            web animation compatibility or canvas context loss.
          </p>
          <div className="p-3 bg-zinc-50 border-2 border-dashed border-zinc-350 rounded-lg text-left overflow-auto max-h-24">
            <code className="text-[10px] font-mono text-[#c53b3a] break-all">
              {error.message || "Unknown render crash"}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 brutalist-btn bg-white hover:bg-zinc-100 text-[#2a2a2a] border-2 border-[#2a2a2a] font-mono font-bold text-sm py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
          >
            ← Home
          </button>
        </div>
      </div>
    </div>
  );
}
