"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import OrbitGalleryAnimation from "@/app/animations/OrbitGallery/page";

export default function OrbitGalleryPage() {
  return (
    <main>
      <ComponentHeader
        title="Orbit Gallery"
        description="Premium scroll-driven layout where orbiting abstract cards converge into a sleek horizontal timeline."
        componentName="OrbitGallery"
      />
      <OrbitGalleryAnimation />
    </main>
  );
}
