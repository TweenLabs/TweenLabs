"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import BentoGridAnimation from "@/app/animations/BentoGrid/page";

export default function BentoGridPage() {
  return (
    <main>
      <ComponentHeader
        title="Bento Grid"
        description="Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs."
        componentName="BentoGrid"
      />
      <BentoGridAnimation />
    </main>
  );
}
