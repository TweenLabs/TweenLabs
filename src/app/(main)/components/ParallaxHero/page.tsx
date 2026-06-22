"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import ParallaxHeroAnimation from "@/app/animations/ParallaxHero/page";

export default function ParallaxHeroPage() {
  return (
    <main>
      <ComponentHeader
        title="Parallax Hero"
        description="Multi-layer parallax hero with SplitText character scatter entrance and scroll-driven depth motion."
        componentName="ParallaxHero"
      />
      <ParallaxHeroAnimation />
    </main>
  );
}
