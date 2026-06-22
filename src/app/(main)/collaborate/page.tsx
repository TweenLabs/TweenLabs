import { DocLink, DocPage, DocSection } from "@/components/DocPage";

export default function CollaboratePage() {
  return (
    <DocPage
      badge="Open Source"
      title="Collaborate"
      description="TweenLabs is MIT-licensed and community-driven. Contribute new components, fix bugs, improve docs, or share feedback from the playground."
    >
      <DocSection title="Contributing">
        <p>
          Fork the repo on{" "}
          <DocLink href="https://github.com/TweenLabs/TweenLabs" external>
            GitHub
          </DocLink>
          , create a branch, and open a pull request. New animation components
          should include a demo page under{" "}
          <code className="font-mono text-xs bg-[#fafaf9] px-1 rounded">
            src/app/animations/
          </code>{" "}
          and an entry in{" "}
          <code className="font-mono text-xs bg-[#fafaf9] px-1 rounded">
            src/data/animations.ts
          </code>
          .
        </p>
      </DocSection>

      <DocSection title="Report Issues">
        <p>
          Found a bug in a component or the playground agent? File an issue with
          steps to reproduce, browser version, and a minimal code sample if
          possible.
        </p>
        <p>
          <DocLink href="https://github.com/TweenLabs/TweenLabs/issues" external>
            Open an issue on GitHub ↗
          </DocLink>
        </p>
      </DocSection>

      <DocSection title="Share Ideas">
        <p>
          Have an animation pattern you want in the library? Describe the
          interaction, easing, and scroll behavior. The playground is a great
          place to prototype — share generated code in your issue or PR.
        </p>
      </DocSection>

      <DocSection title="License">
        <p>
          All contributions are released under the MIT License. By submitting a
          pull request, you agree your work can be distributed with the project.
        </p>
      </DocSection>
    </DocPage>
  );
}
