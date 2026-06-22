"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import BlueprintAnimation from "@/app/animations/Blueprint/page";

export default function BlueprintPage() {
  return (
    <main>
      <ComponentHeader
        title="Blueprint"
        description="Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io."
        componentName="Blueprint"
      />
      <BlueprintAnimation />
    </main>
  );
}
