"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import CircularScatterAnimation from "@/app/animations/CircularScatter/page";

export default function CircularScatterPage() {
  return (
    <main>
      <ComponentHeader
        title="Circular Scatter"
        description="Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered."
        componentName="CircularScatter"
      />
      <CircularScatterAnimation />
    </main>
  );
}
