"use client";

import { useRouter, usePathname } from "next/navigation";
import { animations } from "@/data/animations";
import { cn } from "@/lib/utils";

interface ComponentHeaderProps {
  title: string;
  description: string;
  componentName: string;
}

// Match sidebar order exactly
const textAnimationSlugs = [
  "KineticText",
  "ParallaxHero",
  "RevealText",
  "MorphingText",
  "GravityDrop",
  "BorderReveal",
];

export function ComponentHeader({
  title,
  description,
  componentName,
}: ComponentHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Build ordered list matching sidebar
  const textAnimations = textAnimationSlugs
    .map((slug) => animations.find((anim) => anim.componentName === slug))
    .filter((anim): anim is NonNullable<typeof anim> => !!anim);

  const coolAnimations = animations.filter(
    (anim) => !textAnimationSlugs.includes(anim.componentName)
  );

  const orderedAnimations = [...textAnimations, ...coolAnimations];

  // Find current animation in ordered list
  const currentIndex = orderedAnimations.findIndex(
    (anim) => anim.componentName === componentName
  );
  const currentAnim = orderedAnimations[currentIndex];
  const nextAnim =
    currentIndex !== -1 && currentIndex < orderedAnimations.length - 1
      ? orderedAnimations[currentIndex + 1]
      : null;
  const prevAnim = currentIndex > 0 ? orderedAnimations[currentIndex - 1] : null;

  const handleCopyPage = () => {
    const componentPath = `/components/${componentName}`;
    navigator.clipboard.writeText(window.location.origin + componentPath);
  };

  const handleNext = () => {
    if (nextAnim) {
      router.push(`/components/${nextAnim.componentName}`);
    }
  };

  const handlePrev = () => {
    if (prevAnim) {
      router.push(`/components/${prevAnim.componentName}`);
    }
  };

  return (
    <div className="w-full bg-[#fafaf9] border-b-3 border-[#2a2a2a] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="font-serif font-black text-3xl md:text-4xl text-[#2a2a2a] mb-2">
              {title}
            </h1>
            <p className="font-mono text-sm md:text-base text-zinc-600">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyPage}
              className="brutalist-btn flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#2a2a2a] bg-white shadow-[2px_2px_0px_#2a2a2a] hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-xs md:text-sm uppercase tracking-wide transition-all duration-150"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="hidden sm:inline">Copy</span>
            </button>

            {prevAnim && (
              <button
                onClick={handlePrev}
                className="brutalist-btn flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#2a2a2a] bg-white shadow-[2px_2px_0px_#2a2a2a] hover:bg-wtf-green hover:text-white text-[#2a2a2a] font-mono font-bold text-xs md:text-sm uppercase tracking-wide transition-all duration-150"
              >
                ← <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {nextAnim && (
              <button
                onClick={handleNext}
                className="brutalist-btn flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#2a2a2a] bg-white shadow-[2px_2px_0px_#2a2a2a] hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-xs md:text-sm uppercase tracking-wide transition-all duration-150"
              >
                <span className="hidden sm:inline">Next</span> →
              </button>
            )}
          </div>
        </div>

        {/* Info grid: Title, Description, Code, Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        

          <div className="p-4 rounded-lg border-2 border-[#2a2a2a] bg-white hover:bg-wtf-yellow transition-colors duration-150 cursor-pointer">
            <div className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wide mb-2">
              Code
            </div>
            <div className="text-sm font-mono font-bold text-[#2a2a2a]">
              View Source
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-[#2a2a2a] bg-white hover:bg-wtf-green transition-colors duration-150 cursor-pointer">
            <div className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wide mb-2">
              Preview
            </div>
            <div className="text-sm font-mono font-bold text-[#2a2a2a]">
              Open Demo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
