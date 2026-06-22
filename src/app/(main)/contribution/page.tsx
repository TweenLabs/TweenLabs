import type { Metadata } from "next";
import ContributionPageClient from "./ContributePageClient";

export const metadata: Metadata = {
  title: "Contribution | TweenLabs",
  description:
    "Learn how to contribute to TweenLabs — the open-source GSAP component library for Next.js. Add new components, fix bugs, improve docs, and join the community.",
};

export default function ContributionPage() {
  return <ContributionPageClient />;
}
