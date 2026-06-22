"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import KineticTextAnimation from "@/app/animations/KineticText/page";

export default function KineticTextPage() {
  return (
    <main>
      <ComponentHeader
        title="Kinetic Text"
        description="Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion."
        componentName="KineticText"
      />
      <KineticTextAnimation />
    </main>
  );
}
