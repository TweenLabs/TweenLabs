"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import SkillFitAnimation from "@/app/animations/SkillFit/page";

export default function SkillFitPage() {
  return (
    <main>
      <ComponentHeader
        title="Skill Fit"
        description="Premium candidate profile showcase animation with vertical ScrollTrigger pinning and technology staggers."
        componentName="SkillFit"
      />
      <SkillFitAnimation />
    </main>
  );
}
