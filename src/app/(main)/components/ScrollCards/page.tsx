"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import ScrollCardsAnimation from "@/app/animations/ScrollCards/page";

export default function ScrollCardsPage() {
  return (
    <main>
      <ComponentHeader
        title="Scroll Cards"
        description="Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers."
        componentName="ScrollCards"
      />
      <ScrollCardsAnimation />
    </main>
  );
}
