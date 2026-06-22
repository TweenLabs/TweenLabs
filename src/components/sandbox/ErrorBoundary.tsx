"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Terminal, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SandboxErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Sandbox Runtime Error Captured:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex flex-col p-6 bg-[#1a1a1a] text-red-400 font-mono border-3 border-red-500 shadow-[6px_6px_0px_#c53b3a] overflow-auto select-text">
          <div className="flex items-center justify-between border-b-2 border-red-500 pb-3 mb-4">
            <div className="flex items-center gap-2 text-red-500 font-bold tracking-wider text-sm uppercase">
              <Terminal className="w-5 h-5 animate-pulse" />
              <span>[Sandbox Compilation Error]</span>
            </div>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950 border border-red-500 text-red-400 text-xs font-bold uppercase cursor-pointer hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_#c53b3a]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Execution</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-white">
              {this.state.error?.name || "Error"}: {this.state.error?.message}
            </h3>
            
            {this.state.error?.stack && (
              <pre className="mt-4 p-4 bg-black/60 border border-zinc-800 text-xs leading-relaxed overflow-x-auto text-red-300/90 whitespace-pre-wrap max-h-[300px]">
                {this.state.error.stack}
              </pre>
            )}
            
            <div className="mt-6 text-xs text-zinc-500 border-t border-zinc-800 pt-4">
              <p>💡 Tip: Verify your GSAP selectors match the elements in your component, and ensure React hooks (useRef, useState) are used correctly.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
