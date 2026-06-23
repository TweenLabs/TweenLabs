"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import LiveRunner from "@/components/sandbox/LiveRunner";

export default function SandboxPreviewPage() {
  const [code, setCode] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        const storedCode = localStorage.getItem(`tweenbot_sandbox_code_${id}`);
        const storedTheme =
          localStorage.getItem(`tweenbot_sandbox_theme_${id}`) || "default";
        setTheme(storedTheme);
        if (storedCode) {
          setCode(storedCode);
          return;
        }
      }

      // Legacy fallback
      const storedCode = localStorage.getItem("tweenbot_sandbox_code");
      const storedTheme =
        localStorage.getItem("tweenbot_sandbox_theme") || "default";
      setTheme(storedTheme);
      if (storedCode) {
        setCode(storedCode);
      } else {
        setCode("");
      }
    }
  }, []);

  const getThemeBg = () => {
    switch (theme) {
      case "white":
        return "bg-white";
      case "dark":
        return "bg-[#121212]";
      default:
        return "bg-[#f0eadf]";
    }
  };

  if (code === null) {
    return (
      <div className="w-full h-screen bg-[#f0eadf] flex flex-col items-center justify-center gap-4 font-mono text-sm text-[#2a2a2a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6758a5]" />
        <span className="font-bold uppercase tracking-wider text-xs">
          Loading Preview...
        </span>
      </div>
    );
  }

  if (code === "") {
    return (
      <div className="w-full h-screen bg-[#f0eadf] flex flex-col items-center justify-center gap-4 font-mono text-sm text-[#2a2a2a] p-8 text-center">
        <span className="font-bold uppercase tracking-wider text-xs text-red-500">
          No Preview Code Found
        </span>
        <p className="text-[10px] text-zinc-500 max-w-md">
          Please write or generate code in the TweenBot Playground and click
          &ldquo;Web Preview&rdquo; to open this page.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen ${getThemeBg()} overflow-hidden relative`}>
      {/* Floating Theme Switcher at Top-Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 select-none">
        <div className="flex items-center border-2 border-black bg-white rounded divide-x-2 divide-black shadow-[3px_3px_0px_#2a2a2a] font-mono text-[10px] font-black overflow-hidden">
          {(["default", "white", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTheme(t);
                if (typeof window !== "undefined") {
                  const params = new URLSearchParams(window.location.search);
                  const id = params.get("id");
                  if (id) {
                    localStorage.setItem(`tweenbot_sandbox_theme_${id}`, t);
                  } else {
                    localStorage.setItem("tweenbot_sandbox_theme", t);
                  }
                }
              }}
              className={`px-3 py-2 uppercase transition-colors cursor-pointer ${
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

      <LiveRunner code={code} />
    </div>
  );
}
