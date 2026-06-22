"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import PageTransitionAnimation from "@/app/animations/PageTransition/page";

export default function PageTransitionPage() {
  return (
    <main>
      <ComponentHeader
        title="Page Transition"
        description="Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing."
        componentName="PageTransition"
      />
      <PageTransitionAnimation />
    </main>
  );
}
