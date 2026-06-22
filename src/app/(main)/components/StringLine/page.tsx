"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import StringLineAnimation from "@/app/animations/StringLine/page";

export default function StringLinePage() {
  return (
    <main>
      <ComponentHeader
        title="String Line"
        description="ScrollTriggered SVG network line drawing tracking node proximity scale offsets."
        componentName="StringLine"
      />
      <StringLineAnimation />
    </main>
  );
}
