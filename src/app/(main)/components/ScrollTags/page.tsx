"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import ScrollTagsAnimation from "@/app/animations/ScrollTags/page";

export default function ScrollTagsPage() {
  return (
    <main>
      <ComponentHeader
        title="Scroll Tags"
        description="Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions."
        componentName="ScrollTags"
      />
      <ScrollTagsAnimation />
    </main>
  );
}
