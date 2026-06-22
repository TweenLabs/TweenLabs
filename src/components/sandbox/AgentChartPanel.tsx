"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Code,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Zap,
  MousePointerClick,
  Layers,
} from "lucide-react";
import { SSEMessage } from "@/hooks/useAgentSSE";

interface AgentChartPanelProps {
  messages: SSEMessage[];
  status: "idle" | "running" | "paused" | "completed" | "error";
  activeNode: string | null;
  runAgent: (
    action: "start" | "approve",
    payload?: { userQuery?: string; plan?: string; skills?: string[] },
  ) => void;
  stopExecution: () => void;
}

const AVAILABLE_SKILLS = [
  "gsap-core",
  "gsap-react",
  "gsap-scrolltrigger",
  "gsap-timeline",
  "gsap-plugins",
  "gsap-performance",
  "gsap-utils",
];

export default function AgentChartPanel({
  messages,
  status,
  activeNode,
  runAgent,
  stopExecution,
}: AgentChartPanelProps) {
  const [inputValue, setInputValue] = useState("");

  // States for Plan Editing
  const [editedPlan, setEditedPlan] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  // Collapsible linter errors state
  const [isLinterOpen, setIsLinterOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleScrollToBottom = (force = false) => {
    const container = chatEndRef.current?.parentElement;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      120;
    if (force || isNearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Smart scroll to bottom of chat when new messages arrive
  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || status === "running") return;
    runAgent("start", { userQuery: inputValue });
    setInputValue("");
    // Force scroll to bottom immediately upon user sending query
    setTimeout(() => handleScrollToBottom(true), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Pre-fill editable plan when approval card mounts
  const handleStartEditPlan = (plan: string, skills: string[]) => {
    setEditedPlan(plan);
    setSelectedSkills(skills);
    setIsEditingPlan(true);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleApprove = () => {
    runAgent("approve", {
      plan: isEditingPlan ? editedPlan : undefined,
      skills: isEditingPlan ? selectedSkills : undefined,
    });
    setIsEditingPlan(false);
  };

  // ── Unified Pipeline State Processing ──────────────────────────────────────
  const nodeMsgs = messages.filter((m) => m.node !== undefined);
  const hasStartedPipeline = nodeMsgs.length > 0;

  const linterMsgs = nodeMsgs.filter((m) => m.node === "linter");
  const failedLinterRuns = linterMsgs.filter(
    (m) => m.details?.lint_passed === false,
  );

  const isPipelineComplete =
    status === "completed" || messages.some((m) => m.finalCode !== undefined);

  const getStepState = (
    stepName: "retriever" | "coder" | "critic" | "linter",
  ) => {
    if (isPipelineComplete) return "completed";

    if (stepName === "retriever") {
      if (nodeMsgs.some((m) => m.node === "retriever")) return "completed";
      if (
        activeNode === "retriever" ||
        (status === "running" && !nodeMsgs.some((m) => m.node === "retriever"))
      )
        return "active";
      return "pending";
    }

    if (stepName === "coder") {
      if (activeNode === "coder") return "active";
      if (
        nodeMsgs.some((m) => m.node === "coder") &&
        activeNode !== "retriever"
      )
        return "completed";
      return "pending";
    }

    if (stepName === "critic") {
      if (activeNode === "critic") return "active";
      if (
        nodeMsgs.some((m) => m.node === "critic") &&
        activeNode !== "coder" &&
        activeNode !== "retriever"
      )
        return "completed";
      return "pending";
    }

    if (stepName === "linter") {
      if (activeNode === "linter") return "active";
      if (failedLinterRuns.length > 0 && activeNode !== "linter")
        return "failed";
      if (
        nodeMsgs.some(
          (m) => m.node === "linter" && m.details?.lint_passed === true,
        )
      )
        return "completed";
      return "pending";
    }

    return "pending";
  };

  const renderPipelineStep = (
    title: string,
    desc: string,
    stepName: "retriever" | "coder" | "critic" | "linter",
    isLast = false,
  ) => {
    const state = getStepState(stepName);

    let icon = <Bot className="w-3.5 h-3.5" />;
    if (stepName === "retriever") icon = <RefreshCw className="w-3.5 h-3.5" />;
    else if (stepName === "coder") icon = <Code className="w-3.5 h-3.5" />;
    else if (stepName === "critic")
      icon = <ShieldCheck className="w-3.5 h-3.5" />;
    else if (stepName === "linter")
      icon = <AlertTriangle className="w-3.5 h-3.5" />;

    return (
      <div className="relative pl-9 pb-5 last:pb-0">
        {/* Vertical SVG connection line */}
        {!isLast && (
          <div
            className={`absolute left-[13px] top-6 bottom-0 w-0.5 ${
              state === "completed"
                ? "bg-[#0c9367]"
                : state === "failed"
                  ? "bg-rose-500 border-l border-rose-500"
                  : "border-l-2 border-dashed border-zinc-400"
            }`}
          />
        )}

        {/* Bullet circle */}
        <div
          className={`absolute left-0 top-1 w-[28px] h-[28px] rounded-full border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] z-10 ${
            state === "completed"
              ? "bg-[#effdf5] text-[#0c9367] border-[#0c9367]"
              : state === "active"
                ? "bg-amber-100 text-amber-700 border-amber-500 animate-pulse"
                : state === "failed"
                  ? "bg-[#fef2f2] text-rose-600 border-rose-500 animate-bounce"
                  : "bg-zinc-100 text-zinc-400 border-zinc-200"
          }`}
        >
          {state === "completed" ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : state === "active" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : state === "failed" ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            icon
          )}
        </div>

        {/* Step details */}
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-[11px] font-black uppercase flex items-center gap-2">
            <span
              className={
                state === "completed"
                  ? "text-[#0c9367]"
                  : state === "failed"
                    ? "text-rose-600"
                    : state === "active"
                      ? "text-amber-700 font-bold"
                      : "text-zinc-500"
              }
            >
              {title}
            </span>

            {state === "active" && (
              <span className="text-[8px] px-1 py-0.2 bg-amber-200 text-amber-800 border border-amber-400 font-bold rounded uppercase animate-pulse">
                Running
              </span>
            )}
            {state === "failed" && (
              <span className="text-[8px] px-1 py-0.2 bg-rose-200 text-rose-800 border border-rose-400 font-bold rounded uppercase">
                Failed
              </span>
            )}
            {state === "completed" && (
              <span className="text-[8px] px-1 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-400 font-bold rounded uppercase">
                Ready
              </span>
            )}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono leading-relaxed">
            {desc}
          </div>

          {/* Collapsible compiler errors for Linter */}
          {stepName === "linter" && failedLinterRuns.length > 0 && (
            <div className="mt-3 border-2 border-black rounded bg-zinc-900 text-zinc-100 overflow-hidden shadow-[2px_2px_0px_#000] w-full">
              <button
                type="button"
                onClick={() => setIsLinterOpen(!isLinterOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase text-zinc-300 focus:outline-none hover:bg-zinc-800 select-none cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                  <span>
                    Compiler Warnings / Errors ({failedLinterRuns.length}{" "}
                    attempts)
                  </span>
                </div>
                <span className="text-zinc-400">
                  {isLinterOpen ? "▲ Hide" : "▼ Show"}
                </span>
              </button>

              {isLinterOpen && (
                <div className="border-t border-black p-3 bg-zinc-950 text-[9px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto text-rose-400 leading-normal select-text">
                  {failedLinterRuns.map((run, idx) => (
                    <div
                      key={idx}
                      className="mb-3 last:mb-0 pb-3 border-b border-zinc-800 last:border-0 last:pb-0"
                    >
                      <div className="text-zinc-400 font-black mb-1 uppercase tracking-tight">
                        Attempt {idx + 1}:
                      </div>
                      {run.details?.lint_errors ||
                        "Unknown compiler check warning."}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SUGGESTION_CHIPS = [
    { icon: <Zap className="w-3 h-3" />, text: "Animate a card flip on hover" },
    { icon: <Layers className="w-3 h-3" />, text: "Create a staggered grid reveal" },
    { icon: <MousePointerClick className="w-3 h-3" />, text: "Build a magnetic cursor effect" },
    { icon: <Sparkles className="w-3 h-3" />, text: "Make a parallax scroll hero" },
  ];

  const hasMessages = messages.length > 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#f0eadf] text-[#2a2a2a] overflow-hidden select-none">

      {/* Live active node banner */}
      {status === "running" && activeNode && !activeNode.startsWith("__") && (
        <div className="shrink-0 px-4 py-2 bg-[#6758a5] border-b-2 border-black flex items-center gap-2 font-mono text-[10px] text-white font-bold uppercase">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Running → {activeNode.toUpperCase()}</span>
        </div>
      )}
      {status === "paused" && (
        <div className="shrink-0 px-4 py-2 bg-[#f1b333] border-b-2 border-black flex items-center gap-2 font-mono text-[10px] text-black font-bold uppercase">
          <span>⏸ Waiting for your approval...</span>
        </div>
      )}

      {/* Scrollable Agent Chat Logs */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Welcome Empty State */}
        {!hasMessages && !hasStartedPipeline && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8">
            {/* Bot icon */}
            <div className="w-12 h-12 bg-white border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#6758a5]" />
            </div>

            {/* Welcome text */}
            <div className="text-center space-y-1.5">
              <h2 className="font-serif text-lg font-black text-[#2a2a2a] tracking-tight">
                What would you like to animate?
              </h2>
              <p className="font-mono text-[11px] text-zinc-500 max-w-[280px] leading-relaxed">
                Describe any GSAP animation and TweenBot will generate React code for you.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-col gap-1.5 w-full max-w-[300px]">
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(chip.text)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black/10 rounded-lg text-left font-mono text-[11px] text-[#2a2a2a] hover:border-black/30 hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span className="text-[#6758a5]">{chip.icon}</span>
                  <span>{chip.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isAgent = msg.sender === "agent";
          const isSystem = msg.sender === "system";

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="flex flex-col max-w-[90%] self-center items-center justify-center p-3 border-3 border-dashed border-red-500 rounded bg-red-50 text-red-700 font-mono text-xs shadow-[2px_2px_0px_rgba(239,68,68,1)]"
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <XCircle className="w-4 h-4" />
                  <span>SYSTEM NOTIFICATION</span>
                </div>
                <p className="text-center">{msg.text}</p>
              </div>
            );
          }

          // Special rendering for HILT approval cards
          if (isAgent && msg.isApprovalCard) {
            return (
              <div
                key={msg.id}
                className="flex flex-col max-w-[85%] self-start w-full gap-1"
              >
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-500 mb-1 px-1">
                  <Bot className="w-3.5 h-3.5 text-[#6758a5]" />
                  <span>TWEENBOT // SUPERVISOR PROPOSAL</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="p-3 border-3 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] bg-white text-xs font-mono leading-relaxed text-black">
                  {!isEditingPlan ? (
                    <div className="space-y-3">
                      <p className="whitespace-pre-wrap font-mono text-xs text-black leading-relaxed">
                        {msg.plan}
                      </p>

                      <div className="flex items-center gap-2 border-t border-black/10 pt-2.5">
                        <span className="font-bold text-[10px] text-zinc-500 uppercase">
                          Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.skills?.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-[#fdf6e8] border-2 border-black text-black font-bold text-[9px] rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleApprove}
                          className="flex-1 py-1.5 bg-[#0c9367] text-white border-2 border-black rounded font-bold shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] cursor-pointer hover:bg-[#0a7a55]"
                        >
                          Approve Plan & Run
                        </button>
                        <button
                          onClick={() =>
                            handleStartEditPlan(
                              msg.plan || "",
                              msg.skills || [],
                            )
                          }
                          className="px-3 py-1.5 bg-white text-zinc-700 border-2 border-black rounded font-bold shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] cursor-pointer hover:bg-zinc-50"
                        >
                          Modify Plan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <textarea
                          value={editedPlan}
                          onChange={(e) => setEditedPlan(e.target.value)}
                          className="w-full h-28 p-2 border-2 border-black rounded font-mono text-[11px] bg-zinc-50 focus:outline-none focus:bg-white text-black"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-bold text-[10px] text-zinc-500 uppercase">
                          Toggle loaded skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {AVAILABLE_SKILLS.map((skill) => {
                            const isSelected = selectedSkills.includes(skill);
                            return (
                              <button
                                key={skill}
                                onClick={() => handleSkillToggle(skill)}
                                className={`px-2 py-0.5 border-2 border-black font-bold text-[9px] rounded cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleApprove}
                          className="flex-1 py-1.5 bg-[#0c9367] text-white border-2 border-black rounded font-bold shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] cursor-pointer"
                        >
                          Save & Run Plan
                        </button>
                        <button
                          onClick={() => setIsEditingPlan(false)}
                          className="px-3 py-1.5 bg-zinc-200 text-zinc-700 border-2 border-black rounded font-bold shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Skip individual worker status messages from printing as separate chat cards
          if (msg.node !== undefined) {
            return null;
          }

          // Otherwise render normal chat bubbles (user queries, final outputs, etc.)
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isAgent ? "self-start" : "self-end"
              }`}
            >
              {/* Message Header */}
              <div
                className={`flex items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-500 mb-1 px-1 ${
                  isAgent ? "justify-start" : "justify-end"
                }`}
              >
                {isAgent ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#6758a5]" />
                    <span>TWEENBOT // CORE</span>
                  </>
                ) : (
                  <>
                    <span>USER</span>
                    <User className="w-3.5 h-3.5 text-[#e55b3c]" />
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content Bubble */}
              <div
                className={`p-3 border-3 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] text-xs font-mono leading-relaxed select-text ${
                  isAgent ? "bg-white text-black" : "bg-[#6758a5] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Unified Pipeline execution progress box */}
        {hasStartedPipeline && (
          <div className="flex flex-col max-w-[85%] self-start w-full gap-1">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-500 mb-1 px-1">
              <Bot className="w-3.5 h-3.5 text-[#6758a5]" />
              <span>TWEENBOT // WORKFLOW PIPELINE</span>
            </div>

            <div className="p-4 border-3 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] bg-white text-xs font-mono leading-relaxed text-black">
              <div className="flex flex-col">
                {renderPipelineStep(
                  "Skill Retriever",
                  "Loads GSAP skills reference guidelines from disk.",
                  "retriever",
                )}
                {renderPipelineStep(
                  "GSAP Coder",
                  "Translates plan and rules to clean TSX animation code.",
                  "coder",
                )}
                {renderPipelineStep(
                  "Critic Auditor",
                  "Audits code for GSAP anti-patterns and performance tricks.",
                  "critic",
                )}
                {renderPipelineStep(
                  "Linter Compiler",
                  "Runs compiler checks (tsc) and React rules verification (ESLint).",
                  "linter",
                  true,
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Fixed bottom input box */}
      <div className="p-4 border-t-3 border-black bg-white shrink-0">
        <div className="relative border-3 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden flex bg-white focus-within:shadow-[4px_4px_0px_rgba(103,88,165,0.4)] transition-shadow duration-150">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === "running"}
            placeholder={
              status === "running"
                ? "TweenBot is working..."
                : "Describe an animation..."
            }
            className="flex-1 bg-transparent px-4 py-3 font-mono text-xs focus:outline-none resize-none h-16 max-h-16 text-black disabled:opacity-55 placeholder:text-zinc-400"
          />
          <div className="flex flex-col justify-end p-2 bg-white">
            {status === "running" ? (
              <button
                onClick={stopExecution}
                title="Stop Agent Execution"
                className="p-2 bg-[#e55b3c] text-white border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-2 bg-[#6758a5] text-white border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:cursor-not-allowed hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-zinc-400 select-none px-1">
          <span>
            {status === "running"
              ? "Processing..."
              : "Press Enter to send"}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-[8px] font-bold">Shift+Enter</kbd>
            <span>new line</span>
          </span>
        </div>
      </div>
    </div>
  );
}
