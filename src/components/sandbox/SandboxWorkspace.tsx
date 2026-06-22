"use client";

import React, { useState, useEffect } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import AgentChartPanel from "./AgentChartPanel";
import PreviewPanel from "./PreviewPanel";
import PlaygroundToolbar from "./PlaygroundToolbar";
import { useAgentSSE } from "@/hooks/useAgentSSE";

type ThemeType = "default" | "white" | "dark";

const defaultCodeString = `import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function App() {
  const boxRef = useRef(null);

  useGSAP(() => {
    gsap.to(boxRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 8,
      ease: "none"
    });
  });

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 font-mono">
      <div 
        ref={boxRef} 
        className="w-16 h-16 bg-[#6758a5] border-3 border-black shadow-[4px_4px_0px_#000] rounded-lg"
      />
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
        [TweenBot Dynamic Sandbox Canvas]
      </p>
    </div>
  );
}`;

export default function SandboxWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState<string>(defaultCodeString);
  const [, setCompileLogs] = useState<string[]>([]);
  const [, setIsCompiling] = useState(false);

  // Preview panel state (hoisted for unified toolbar)
  const [remountKey, setRemountKey] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [theme, setTheme] = useState<ThemeType>("default");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { messages, status, activeNode, runAgent, stopExecution } = useAgentSSE(
    (generatedCode) => {
      console.log("Successfully received new generated code from agent!");
      setCode(generatedCode);
    },
  );

  const handleCompileStart = () => setIsCompiling(true);
  const handleCompileSuccess = (logs: string[]) => { setIsCompiling(false); setCompileLogs(logs); };
  const handleCompileError = (_err: Error) => setIsCompiling(false);
  const handleReplay = () => setRemountKey((prev) => prev + 1);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[#f0eadf] flex flex-col items-center justify-center gap-4 font-mono text-sm text-[#2a2a2a]">
        <div className="w-10 h-10 border-3 border-black rounded-xl bg-white shadow-[3px_3px_0px_#000] flex items-center justify-center animate-pulse">
          <svg className="w-5 h-5 text-[#6758a5] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-black text-xs uppercase tracking-widest">Loading Platform</span>
          <div className="w-24 h-1 bg-zinc-200 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-[#6758a5] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Visual noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 mix-blend-overlay opacity-40" />

      {/* Unified Toolbar */}
      <PlaygroundToolbar
        status={status}
        showCode={showCode}
        theme={theme}
        onReplay={handleReplay}
        onToggleCode={() => setShowCode(!showCode)}
        onThemeChange={setTheme}
      />

      {/* Split Panels */}
      <div className="flex-1 min-h-0">
        <Allotment defaultSizes={[30, 70]} className="h-full">
          <Allotment.Pane preferredSize="30%" minSize={300}>
            <AgentChartPanel
              messages={messages}
              status={status}
              activeNode={activeNode}
              runAgent={runAgent}
              stopExecution={stopExecution}
            />
          </Allotment.Pane>

          <Allotment.Pane minSize={400}>
            <PreviewPanel
              code={code}
              onCodeChange={setCode}
              onCompileStart={handleCompileStart}
              onCompileSuccess={handleCompileSuccess}
              onCompileError={handleCompileError}
              remountKey={remountKey}
              showCode={showCode}
              theme={theme}
            />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}
