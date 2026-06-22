"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import TabsMotionAnimation from "@/app/animations/TabsMotion/page";

export default function TabsMotionPage() {
  return (
    <main>
      <ComponentHeader
        title="Tabs Motion"
        description="Animated tab navigation with sliding indicator pill and directional content crossfade transitions."
        componentName="TabsMotion"
      />
      <TabsMotionAnimation />
    </main>
  );
}
