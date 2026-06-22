"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface LiveRunnerProps {
  code: string;
  onCompileStart?: () => void;
  onCompileSuccess?: (logs: string[]) => void;
  onCompileError?: (err: Error) => void;
}

export default function LiveRunner({
  code,
  onCompileStart,
  onCompileSuccess,
  onCompileError,
}: LiveRunnerProps) {
  const [isBabelLoaded, setIsBabelLoaded] = useState(false);
  const [babelError, setBabelError] = useState<string | null>(null);
  const [transpiledCode, setTranspiledCode] = useState<string | null>(null);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const compileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Babel Standalone from CDN
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Babel is already loaded
    if ((window as any).Babel) {
      setIsBabelLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@babel/standalone@7.24.0/babel.min.js";
    script.async = true;
    script.onload = () => {
      setIsBabelLoaded(true);
    };
    script.onerror = () => {
      setBabelError("Failed to load Babel compiler from CDN. Please check your internet connection.");
    };

    document.head.appendChild(script);
  }, []);

  // Compile TSX to JS when code changes and Babel is loaded
  useEffect(() => {
    if (!isBabelLoaded) return;

    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    // Debounce compilation to avoid thrashing CPU on keypresses
    compileTimeoutRef.current = setTimeout(() => {
      compileCode();
    }, 400);

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [code, isBabelLoaded]);

  const compileCode = () => {
    onCompileStart?.();
    const startTime = performance.now();
    const logs: string[] = [];

    try {
      logs.push(`[Compiler] Initializing transpilation...`);
      const Babel = (window as any).Babel;
      if (!Babel) {
        throw new Error("Babel standalone compiler is not ready.");
      }

      // Transpile JSX/TSX code
      logs.push(`[Compiler] Parsing TSX syntax trees...`);
      const transformed = Babel.transform(code, {
        presets: ["env", "react", "typescript"],
        filename: "dynamic-component.tsx",
      }).code;

      if (!transformed) {
        throw new Error("Transpilation yielded empty code.");
      }

      const duration = (performance.now() - startTime).toFixed(1);
      logs.push(`[Compiler] Success! Component compiled in ${duration}ms.`);

      setTranspiledCode(transformed);
      setCompileLogs(logs);
      onCompileSuccess?.(logs);
    } catch (err: any) {
      logs.push(`[Compiler Error] ${err.message}`);
      setCompileLogs(logs);
      onCompileError?.(err);
      // Inject standard error throw in iframe
      setTranspiledCode(`throw new Error(${JSON.stringify(err.message)});`);
    }
  };

  if (babelError) {
    return (
      <div className="p-6 bg-[#1a1a1a] text-red-500 border-3 border-red-500 font-mono text-sm shadow-[4px_4px_0px_#000]">
        <p className="font-bold">❌ BABEL ERROR:</p>
        <p className="mt-2 text-red-400">{babelError}</p>
      </div>
    );
  }

  if (!isBabelLoaded) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#f0eadf] border-3 border-dashed border-[#2a2a2a] p-8">
        <Loader2 className="w-10 h-10 animate-spin text-[#6758a5] mb-4" />
        <p className="font-mono text-xs font-bold text-[#2a2a2a] uppercase tracking-wider">
          Fetching Client-Side Compiler Engine...
        </p>
        <p className="font-mono text-[10px] text-zinc-500 mt-1">
          Downloading @babel/standalone (2.4MB)
        </p>
      </div>
    );
  }

  // Create isolated iframe page document
  const srcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18.2.0/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js" crossorigin></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/EasePack.min.js"></script>
  <script>
    window.require = function(name) {
      if (name === 'react') return window.React;
      if (name === 'gsap') return window.gsap;
      throw new Error("Module '" + name + "' is not available in sandbox.");
    };
  </script>
  <script src="https://unpkg.com/@gsap/react@2.1.1/dist/index.js"></script>
  <script src="https://unpkg.com/lucide@0.344.0/dist/umd/lucide.min.js"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow: auto;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* Hide scrollbars inside canvas wrapper */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // CommonJS module mock registry inside Sandbox IFrame
    const modules = {
      "react": window.React,
      "react-dom": window.ReactDOM,
      "gsap": window.gsap,
      "gsap/ScrollTrigger": { ScrollTrigger: window.ScrollTrigger, default: window.ScrollTrigger },
      "gsap/ScrollToPlugin": { ScrollToPlugin: window.ScrollToPlugin, default: window.ScrollToPlugin },
      "gsap/MotionPathPlugin": { MotionPathPlugin: window.MotionPathPlugin, default: window.MotionPathPlugin },
      "gsap/TextPlugin": { TextPlugin: window.TextPlugin, default: window.TextPlugin },
      "gsap/EasePack": { EasePack: window.EasePack, default: window.EasePack },
      "gsap/all": {
        gsap: window.gsap,
        ScrollTrigger: window.ScrollTrigger,
        ScrollToPlugin: window.ScrollToPlugin,
        MotionPathPlugin: window.MotionPathPlugin,
        TextPlugin: window.TextPlugin,
        EasePack: window.EasePack,
        default: window.gsap
      },
      "@gsap/react": { useGSAP: window.useGSAP, default: window.useGSAP },
      "lucide-react": window.lucide
    };

    window.require = function(name) {
      if (modules[name]) return modules[name];
      if (name.startsWith("lucide-react")) {
        return window.lucide;
      }
      throw new Error("Module '" + name + "' is not available in sandbox.");
    };

    window.exports = {};
    window.module = { exports: window.exports };
  </script>
  <script>
    try {
      ${transpiledCode}
      
      const Component = window.exports.default || window.module.exports.default || window.module.exports;
      if (Component) {
        // Automatically register standard GSAP plugins inside Sandbox context
        if (window.gsap) {
          window.gsap.registerPlugin(
            window.ScrollTrigger, 
            window.ScrollToPlugin, 
            window.MotionPathPlugin, 
            window.TextPlugin, 
            window.EasePack
          );
        }
        
        const root = window.ReactDOM.createRoot(document.getElementById("root"));
        root.render(window.React.createElement(Component));
      } else {
        throw new Error("The compiled code did not export a default React Component.");
      }
    } catch(err) {
      document.body.innerHTML = \`
        <div style="color: #ef4444; padding: 16px; font-family: monospace; font-size: 11px; border: 2px dashed #ef4444; background: #fef2f2; max-width: 90%; margin: 20px auto; border-radius: 6px; box-shadow: 2px 2px 0px rgba(0,0,0,1);">
          <h3 style="margin-top: 0; text-transform: uppercase;">Sandbox Runtime Error</h3>
          <p>\${err.message}</p>
        </div>
      \`;
    }
  </script>
</body>
</html>`;

  return (
    <div className="w-full h-full flex items-center justify-center p-1 overflow-auto">
      {transpiledCode ? (
        <iframe
          key={transpiledCode} // Remount and reload IFrame on every code modification
          srcDoc={srcDoc}
          title="Sandbox Execution Window"
          className="w-full h-full border-none bg-transparent"
          sandbox="allow-scripts"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#f0eadf] text-zinc-400 font-mono text-xs">
          Compiling workspace components...
        </div>
      )}
    </div>
  );
}
