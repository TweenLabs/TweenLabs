import { DocCode, DocLink, DocPage, DocSection } from "@/components/DocPage";

export default function InstallationPage() {
  return (
    <DocPage
      badge="Quick Setup"
      title="Installation"
      description="Install TweenLabs components into your Next.js or React project using the CLI, or copy source files directly from the registry."
    >
      <DocSection title="CLI Install">
        <p>
          The fastest way to add a component is with the TweenLabs CLI. Run this
          in your project root:
        </p>
        <DocCode>{`npx tweenlabs add FlipCards`}</DocCode>
        <p>
          Replace <code className="font-mono text-xs bg-[#fafaf9] px-1 rounded">FlipCards</code> with
          any component name from the{" "}
          <DocLink href="/">component directory</DocLink>.
        </p>
      </DocSection>

      <DocSection title="Manual Copy">
        <p>
          Every component has a dedicated source page. Open any demo, click Get
          Code, and paste the file into your project. Components are
          self-contained and use GSAP with React refs.
        </p>
      </DocSection>

      <DocSection title="Dependencies">
        <p>Most components require:</p>
        <DocCode>{`npm install gsap
npm install @gsap/react   # recommended for React / Next.js`}</DocCode>
        <p>
          Scroll-driven demos also need{" "}
          <DocLink href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" external>
            ScrollTrigger
          </DocLink>
          . Register plugins once in your app entry or layout.
        </p>
      </DocSection>

      <DocSection title="Next Step">
        <p>
          Head to{" "}
          <DocLink href="/how-to-setup">How to Setup</DocLink> for project
          structure tips, or jump into the{" "}
          <DocLink href="/playground">Playground</DocLink> to generate animations
          with the AI agent.
        </p>
      </DocSection>
    </DocPage>
  );
}
