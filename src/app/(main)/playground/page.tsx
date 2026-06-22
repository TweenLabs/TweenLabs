import type { Metadata } from "next";
import SandboxWorkspace from "@/components/sandbox/SandboxWorkspace";

export const metadata: Metadata = {
  title: "Playground | TweenLabs",
  description:
    "Experiment with GSAP animations in real-time. Use TweenBot to generate, preview, and iterate on animations in the interactive sandbox.",
};

export default function PlaygroundPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <SandboxWorkspace />
    </div>
  );
}
