"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import MorphingTextAnimation from "@/app/animations/MorphingText/page";

export default function MorphingTextPage() {
  return (
    <main>
      <ComponentHeader
        title="Morphing Text"
        description="Smooth auto-cycling text morphing animation with SVG threshold filter and color-coded word transitions."
        componentName="MorphingText"
      />
      <MorphingTextAnimation />
    </main>
  );
}
