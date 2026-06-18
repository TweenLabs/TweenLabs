"use client";

import { SvgLine, SvgLineTwo } from "@/components/SvgLines";
import Link from "next/link";

export default function SvgLine2Page() {
  return (
    <div className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black">
      {/* Intro section */}
      <section className="h-screen w-full bg-wtf-green border-b-3 border-[#2a2a2a] flex flex-col items-center justify-center p-8 text-center text-white z-10 relative">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-black uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
            <span>Component 21</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black uppercase leading-none tracking-tight">
            SVG Scroll Drawing Line
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider animate-bounce mt-8 font-bold">
            ↓ Scroll Down to Draw Lines ↓
          </p>
        </div>
      </section>

      {/* Svg lines components */}
      <SvgLine />
      <SvgLineTwo />

      {/* Outro section */}
      <section className="h-screen w-full bg-wtf-purple border-t-3 border-[#2a2a2a] flex flex-col items-center justify-center p-8 text-center text-white z-10 relative">
        <div className="max-w-md flex flex-col gap-6 items-center">
          <h2 className="text-3xl md:text-5xl font-serif font-black uppercase">Drawing Completed</h2>
          <p className="font-sans font-semibold text-sm opacity-90">
            Vector lines have successfully drawn across scroll triggers.
          </p>
          <Link href="/">
            <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
