"use client";

import React, { useState, useEffect } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import AgentChartPanel from "./AgentChartPanel";
import PreviewPanel from "./PreviewPanel";
import { useAgentSSE } from "@/hooks/useAgentSSE";

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
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Sync mount state to avoid SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Instantiate SSE Agent Hook
  const {
    messages,
    status,
    activeNode,
    runAgent,
    stopExecution,
  } = useAgentSSE((generatedCode) => {
    console.log("Successfully received new generated code from agent!");
    setCode(generatedCode);
  });

  const handleCompileStart = () => {
    setIsCompiling(true);
  };

  const handleCompileSuccess = (logs: string[]) => {
    setIsCompiling(false);
    setCompileLogs(logs);
  };

  const handleCompileError = (err: Error) => {
    setIsCompiling(false);
  };

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[#f0eadf] flex items-center justify-center font-mono text-sm text-[#2a2a2a]">
        LOADING PLATFORM CORE...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Visual noise overlay to match the premium neo-brutalist styling */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-50 mix-blend-overlay opacity-40" />

      <Allotment defaultSizes={[40, 60]} className="h-full">
        {/* Left pane: Agent Workspace Chat */}
        <Allotment.Pane preferredSize="40%" minSize={320}>
          <AgentChartPanel
            messages={messages}
            status={status}
            activeNode={activeNode}
            runAgent={runAgent}
            stopExecution={stopExecution}
          />
        </Allotment.Pane>

        {/* Right pane: Execution Sandbox Canvas & Editor */}
        <Allotment.Pane minSize={400}>
          <PreviewPanel
            code={code}
            onCodeChange={setCode}
            onCompileStart={handleCompileStart}
            onCompileSuccess={handleCompileSuccess}
            onCompileError={handleCompileError}
          />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
