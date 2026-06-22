"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import BorderRevealAnimation from "@/app/animations/BorderReveal/page";

export default function BorderRevealPage() {
  return (
    <main>
      <ComponentHeader
        title="Border Reveal"
        description="Premium horizontal text scroll where letters fly in and out from top/bottom screen borders."
        componentName="BorderReveal"
      />
      <BorderRevealAnimation />
    </main>
  );
}
