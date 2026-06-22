"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import FluidCursorAnimation from "@/app/animations/FluidCursor/page";

export default function FluidCursorPage() {
  return (
    <main>
      <ComponentHeader
        title="Fluid Cursor"
        description="Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries."
        componentName="FluidCursor"
      />
      <FluidCursorAnimation />
    </main>
  );
}
