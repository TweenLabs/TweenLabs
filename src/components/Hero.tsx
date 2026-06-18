export default function Hero() {
  return (
    <section className="relative w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center gap-6 z-10 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="inline-flex items-center gap-2 bg-wtf-purple border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>TweenLabs Animation Hub</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight text-[#2a2a2a] max-w-4xl leading-[1.05]">
          TweenLabs
          <span className="block mt-2 text-wtf-orange uppercase">
            GSAP Components
          </span>
        </h1>

        <p className="max-w-xl text-zinc-700 text-sm md:text-base leading-relaxed font-sans font-medium">
          A high-fidelity collection of the best GSAP components, interactive
          React templates, and ScrollTrigger animations. Free, production-ready,
          and copy-paste friendly.
        </p>
      </div>

      {/* Scroll Down Indicator HUD */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
        <span>Scroll to Explore</span>
        <span className="text-wtf-orange font-bold text-sm">↓</span>
      </div>
    </section>
  );
}
