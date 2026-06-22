"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface SSEMessage {
  id: string;
  sender: "agent" | "user" | "system";
  text: string;
  timestamp: string;
  node?: string;
  status?: string;
  plan?: string;
  skills?: string[];
  finalCode?: string;
  isApprovalCard?: boolean;
  details?: {
    lint_errors?: string;
    lint_passed?: boolean;
    critic_feedback?: string;
    critic_approved?: boolean;
    lint_retry_count?: number;
  };
}

const BACKEND_URL = "http://localhost:8000";

export function useAgentSSE(onCodeGenerated?: (code: string) => void) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "completed" | "error">("idle");
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  // Track if we already added an approval card to avoid duplicates
  const approvalAddedRef = useRef(false);

  // Initialize Thread ID on mount
  useEffect(() => {
    async function initThread() {
      try {
        const res = await fetch(`${BACKEND_URL}/chat/new`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setThreadId(data.thread_id);
        }
      } catch (err) {
        console.error("Failed to initialize agent thread:", err);
      }
    }
    initThread();
  }, []);

  const stopExecution = async () => {
    if (!threadId) return;

    // Cancel frontend reading
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    try {
      await fetch(`${BACKEND_URL}/chat/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId }),
      });
    } catch (err) {
      console.error("Failed to stop chat:", err);
    }
    setStatus("idle");
    setActiveNode(null);
  };

  const runAgent = async (
    action: "start" | "approve",
    payload: { userQuery?: string; plan?: string; skills?: string[] } = {}
  ) => {
    // Determine active thread
    let activeThread = threadId;
    if (!activeThread) {
      try {
        const res = await fetch(`${BACKEND_URL}/chat/new`, { method: "POST" });
        const data = await res.json();
        activeThread = data.thread_id;
        setThreadId(activeThread);
      } catch (err) {
        console.error("Could not generate thread_id:", err);
        setStatus("error");
        return;
      }
    }

    // Cancel existing request if running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setStatus("running");
    setActiveNode(null);

    if (action === "start") {
      // Clear all previous messages and reset guard for fresh conversation
      setMessages([]);
      approvalAddedRef.current = false;
      if (payload.userQuery) {
        const userMsg: SSEMessage = {
          id: Date.now().toString(),
          sender: "user",
          text: payload.userQuery,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([userMsg]);
      }
    } else if (action === "approve") {
      approvalAddedRef.current = false;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chat/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          thread_id: activeThread,
          action,
          user_query: payload.userQuery,
          plan: payload.plan ?? null,
          skills: payload.skills ?? null,
        }),
      });

      if (!response.body) {
        throw new Error("No response body received from stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const block of parts) {
          if (!block.trim()) continue;

          let eventName = "";
          let dataStr = "";

          const lines = block.split("\n");
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventName = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataStr = line.slice(6).trim();
            }
          }

          if (eventName && dataStr) {
            try {
              const data = JSON.parse(dataStr);
              handleSSEEvent(eventName, data);
            } catch (err) {
              console.error("Error parsing event data:", err, dataStr);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream reading aborted by user request.");
      } else {
        console.error("SSE stream error:", err);
        setStatus("error");
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            sender: "system",
            text: `Connection error: ${err.message || err}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    }
  };

  const handleSSEEvent = (event: string, data: any) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    switch (event) {
      case "node_status": {
        const { node, status: nodeStatus, details } = data;
        if (node.startsWith("__")) break; // Ignore internal nodes like __interrupt__
        setActiveNode(node);
        setMessages((prev) => [
          ...prev,
          {
            id: `node-${node}-${Date.now()}`,
            sender: "agent",
            node,
            status: nodeStatus,
            text: `[Worker: ${node.toUpperCase()}] ${nodeStatus}`,
            timestamp,
            details,
          },
        ]);
        break;
      }

      // "interrupt" event from backend — carries plan_approval data
      case "interrupt": {
        setStatus("paused");
        if (Array.isArray(data)) {
          const planApproval = data.find(
            (item: any) => item?.value?.type === "plan_approval"
          );
          if (planApproval) {
            const { plan, skills } = planApproval.value;
            setCurrentPlan(plan);
            setCurrentSkills(skills);
            if (!approvalAddedRef.current) {
              approvalAddedRef.current = true;
              setMessages((prev) => [
                ...prev,
                {
                  id: `plan-${Date.now()}`,
                  sender: "agent",
                  isApprovalCard: true,
                  plan,
                  skills,
                  text: "Supervisor has proposed a plan for your review.",
                  timestamp,
                },
              ]);
            }
          }
        }
        break;
      }

      case "final": {
        const { final_code } = data;
        setStatus("completed");
        setActiveNode(null);
        setMessages((prev) => [
          ...prev,
          {
            id: `final-${Date.now()}`,
            sender: "agent",
            finalCode: final_code,
            text: "Code generation completed! Review the generated component in the preview sandbox.",
            timestamp,
          },
        ]);
        if (onCodeGenerated) {
          onCodeGenerated(final_code);
        }
        break;
      }

      case "error": {
        const { error } = data;
        setStatus("error");
        setActiveNode(null);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            sender: "system",
            text: `Agent Error: ${error}`,
            timestamp,
          },
        ]);
        break;
      }

      default:
        console.log("Unhandled event type:", event, data);
    }
  };

  return {
    threadId,
    status,
    messages,
    activeNode,
    currentPlan,
    currentSkills,
    runAgent,
    stopExecution,
  };
}
