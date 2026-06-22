"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
// RevealText component needs to be imported from animations folder
// For now, creating a placeholder wrapper

export default function RevealTextPage() {
  return (
    <main>
      <ComponentHeader
        title="Reveal Text"
        description="Premium line-by-line text reveal using SplitText masks with staggered choreography."
        componentName="RevealText"
      />
      <div className="min-h-screen flex items-center justify-center bg-[#f0eadf]">
        <p className="text-center text-gray-600">Reveal Text Component</p>
      </div>
    </main>
  );
}
