"use client";

import React from "react";
import { RotateCcw, Code, Eye } from "lucide-react";

type ThemeType = "default" | "white" | "dark";

interface PlaygroundToolbarProps {
  status: "idle" | "running" | "paused" | "completed" | "error";
  showCode: boolean;
  theme: ThemeType;
  onReplay: () => void;
  onToggleCode: () => void;
  onThemeChange: (theme: ThemeType) => void;
}

export default function PlaygroundToolbar({
  status,
  showCode,
  theme,
  onReplay,
  onToggleCode,
  onThemeChange,
}: PlaygroundToolbarProps) {
  return (
    <div className="border-b-3 border-black bg-white flex items-center shrink-0 z-10 h-[52px]">
      {/* Left: Chatbot name (30% to match chat panel) */}
      <div className="flex items-center gap-2 px-4" style={{ width: '30%' }}>
        <span
          className={`w-3 h-3 rounded-full border-2 border-black ${
            status === "running"
              ? "bg-[#e55b3c] animate-pulse"
              : status === "paused"
                ? "bg-[#f1b333] animate-pulse"
                : status === "completed"
                  ? "bg-[#0c9367]"
                  : "bg-zinc-400"
          }`}
        />
        <h1 className="font-mono text-sm font-black uppercase tracking-tight">
          TWEENBOT
        </h1>
      </div>

      {/* Divider matching the panel split */}
      <div className="self-stretch w-[3px] bg-[#2a2a2a]" />

      {/* Right: Preview Controls (70% to match preview panel) */}
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onReplay}
            title="Replay Animation"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onToggleCode}
            title="Toggle Code View"
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer ${
              showCode ? "bg-[#6758a5] text-white" : "bg-white text-black"
            }`}
          >
            {showCode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>View Code</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center border-2 border-black bg-white rounded divide-x-2 divide-black shadow-[2px_2px_0px_#000] font-mono text-[10px] font-black overflow-hidden">
          {(["default", "white", "dark"] as ThemeType[]).map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`px-3 py-1.5 uppercase transition-colors cursor-pointer ${
                theme === t
                  ? "bg-black text-white"
                  : "hover:bg-zinc-100 text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
