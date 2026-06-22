import { DocCode, DocLink, DocPage, DocSection } from "@/components/DocPage";

export default function HowToSetupPage() {
  return (
    <DocPage
      badge="Quick Setup"
      title="How to Setup"
      description="Configure TweenLabs components in a Next.js App Router project with proper GSAP plugin registration, reduced-motion support, and clean unmount cleanup."
    >
      <DocSection title="Register GSAP Plugins">
        <p>
          Create a client provider or add this to your root layout wrapper so
          ScrollTrigger and other plugins are available app-wide:
        </p>
        <DocCode>{`"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);`}</DocCode>
      </DocSection>

      <DocSection title="Use useGSAP in Components">
        <p>
          Wrap animation logic in{" "}
          <code className="font-mono text-xs bg-[#fafaf9] px-1 rounded">useGSAP</code>{" "}
          so timelines are killed on unmount. Every TweenLabs component follows
          this pattern — keep it when you customize.
        </p>
        <DocCode>{`useGSAP(() => {
  gsap.from(".item", { opacity: 0, y: 40, stagger: 0.1 });
}, { scope: containerRef });`}</DocCode>
      </DocSection>

      <DocSection title="Playground Workflow">
        <p>
          The <DocLink href="/playground">Playground</DocLink> streams live code
          from the TweenLabs agent. Paste the output into a client component,
          install any listed dependencies, and preview in your dev server.
        </p>
      </DocSection>

      <DocSection title="Reduced Motion">
        <p>
          Respect{" "}
          <code className="font-mono text-xs bg-[#fafaf9] px-1 rounded">
            prefers-reduced-motion
          </code>{" "}
          in production. Use{" "}
          <code className="font-mono text-xs bg-[#fafaf9] px-1 rounded">
            gsap.matchMedia()
          </code>{" "}
          to skip or simplify animations when users request reduced motion.
        </p>
      </DocSection>
    </DocPage>
  );
}
