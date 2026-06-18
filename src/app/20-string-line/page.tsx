"use client";

import { StringSection } from "@/components/StringSection";
import Link from "next/link";

export default function StringLinePage() {
  return (
    <div className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black">
      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-xs font-mono font-bold py-2.5 px-4 rounded-md uppercase cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </div>

      {/* Main dynamic SVG String Network viewport directly */}
      <StringSection />
    </div>
  );
}
