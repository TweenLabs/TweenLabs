"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import AccordionAnimation from "@/app/animations/Accordion/page";

export default function AccordionPage() {
  return (
    <main>
      <ComponentHeader
        title="Accordion"
        description="Vertical accordion showcase where selection morphs page background color and staggers content."
        componentName="Accordion"
      />
      <AccordionAnimation />
    </main>
  );
}
