import type { Metadata } from "next";
import { animations } from "@/data/components";
import ComponentsPageClient from "./ComponentsPageClient";

export const metadata: Metadata = {
  title: "All Components | TweenLabs",
  description:
    "Browse the full collection of premium GSAP components, interactive React templates, and ScrollTrigger animations. Free, production-ready, and copy-paste friendly.",
};

export default function ComponentsPage() {
  return <ComponentsPageClient animations={animations} />;
}
