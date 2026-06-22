"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import GravityDropAnimation from "@/app/animations/GravityDrop/page";

export default function GravityDropPage() {
  return (
    <main>
      <ComponentHeader
        title="Gravity Drop"
        description="Staggered letters falling down onto a shelf collider with realistic physics bounce."
        componentName="GravityDrop"
      />
      <GravityDropAnimation />
    </main>
  );
}
