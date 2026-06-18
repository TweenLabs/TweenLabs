import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GSAP Interactive Magnetic Dock Effect | TweenLabs",
  description: "Premium floating menu bar where buttons pull dynamically toward the user's cursor. Explore this high-fidelity, interactive GSAP animation component on TweenLabs.",
  keywords: ["GSAP","GSAP Interactive Magnetic Dock","Interactive Magnetic Dock animation","TweenLabs","React 19","Next.js 16","interactive UI","Tailwind CSS"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
