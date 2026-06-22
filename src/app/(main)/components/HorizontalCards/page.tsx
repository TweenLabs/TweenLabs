"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import HorizontalCardsAnimation from "@/app/animations/HorizontalCards/page";

export default function HorizontalCardsPage() {
  return (
    <main>
      <ComponentHeader
        title="Horizontal Cards"
        description="Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport."
        componentName="HorizontalCards"
      />
      <HorizontalCardsAnimation />
    </main>
  );
}
