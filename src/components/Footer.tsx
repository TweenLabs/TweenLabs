"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t-3 border-[#2a2a2a] bg-[#f8f5ee] py-16 px-4 md:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="TweenLabs Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-serif font-black text-2xl tracking-tight text-[#2a2a2a]">
                TweenLabs
              </span>
            </div>
            <p className="text-sm font-sans font-medium text-zinc-650 leading-relaxed max-w-sm">
              A curated catalog of production-ready, interactive GSAP
              components, scroll triggers, and 3D templates for high-fidelity
              web experiences.
            </p>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-orange">
              Links & Docs
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-sans font-medium">
              <li>
                <a
                  href="https://github.com/GSAP-PLAYGROUND/TweenLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-wtf-orange transition-colors duration-150 flex items-center gap-1.5"
                >
                  GitHub Repository ↗
                </a>
              </li>
              <li>
                <a
                  href="https://gsap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-wtf-orange transition-colors duration-150 flex items-center gap-1.5"
                >
                  Official GSAP Docs ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Specs */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-wtf-purple">
              Framework & Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="border-2 border-[#2a2a2a] bg-white text-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a] font-mono font-bold text-xs">
                next-16
              </span>
              <span className="border-2 border-[#2a2a2a] bg-white text-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a] font-mono font-bold text-xs">
                react-19
              </span>
              <span className="border-2 border-[#2a2a2a] bg-white text-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a] font-mono font-bold text-xs">
                gsap-core
              </span>
              <span className="border-2 border-[#2a2a2a] bg-white text-[#2a2a2a] px-3 py-1 rounded-md shadow-[2px_2px_0px_#2a2a2a] font-mono font-bold text-xs">
                tailwind-v4
              </span>
            </div>
          </div>
        </div>

        {/* Sub-footer Section */}
        <div className="border-t-2 border-[#2a2a2a]/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-zinc-500">
            © {new Date().getFullYear()} TweenLabs. Open-source under MIT
            License.
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="brutalist-btn bg-white hover:bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-2 px-4 rounded-md cursor-pointer transition-all"
          >
            Back To Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
