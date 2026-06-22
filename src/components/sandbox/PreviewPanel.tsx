"use client";

import React from "react";
import LiveRunner from "./LiveRunner";

interface PreviewPanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onCompileStart?: () => void;
  onCompileSuccess?: (logs: string[]) => void;
  onCompileError?: (err: Error) => void;
  remountKey: number;
  showCode: boolean;
  theme: "default" | "white" | "dark";
}

export default function PreviewPanel({
  code,
  onCodeChange,
  onCompileStart,
  onCompileSuccess,
  onCompileError,
  remountKey,
  showCode,
  theme,
}: PreviewPanelProps) {
  const getThemeBg = () => {
    switch (theme) {
      case "white":
        return "bg-white text-black";
      case "dark":
        return "bg-[#121212] text-white";
      case "default":
      default:
        return "bg-[#f0eadf] text-[#2a2a2a]";
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden relative select-none">
      {/* Main Container Area */}
      <div
        className={`flex-1 relative overflow-auto ${getThemeBg()} transition-colors duration-500`}
      >
        {showCode ? (
          /* Inline Code Editor */
          <div className="w-full h-full flex flex-col bg-[#1e1e1e] relative text-zinc-300">
            {/* Header info */}
            <div className="bg-[#121212] px-4 py-2 border-b-2 border-black flex items-center justify-between text-zinc-500 font-mono text-[9px] select-none">
              <span>src/sandbox-component.tsx</span>
              <span>UTF-8 • TSX</span>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative flex overflow-hidden">
              {/* Simulated Line Numbers */}
              <div className="w-10 bg-[#121212] text-zinc-600 font-mono text-xs text-right py-4 pr-2 select-none border-r border-zinc-800">
                {Array.from({
                  length: Math.max(code.split("\n").length, 1),
                }).map((_, i) => (
                  <div key={i} className="leading-5 h-5">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                className="flex-1 bg-transparent text-[#e4e4e7] font-mono text-xs p-4 leading-5 h-full focus:outline-none resize-none overflow-y-auto whitespace-pre tab-size-2 select-text"
                style={{ tabSize: 2 }}
                spellCheck={false}
              />
            </div>

            {/* Warning footer */}
            <div className="p-2.5 bg-zinc-900 border-t border-black text-[9px] font-mono text-zinc-500">
              💡 Editing compiles your GSAP changes automatically in real-time.
            </div>
          </div>
        ) : (
          /* Compiled Component Canvas */
          <div key={remountKey} className="w-full h-full relative z-10">
            <LiveRunner
              code={code}
              onCompileStart={onCompileStart}
              onCompileSuccess={onCompileSuccess}
              onCompileError={onCompileError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
