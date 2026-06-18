import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center pt-24 pb-16 selection:bg-wtf-yellow selection:text-black">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <main className="w-full max-w-5xl px-4 md:px-8 py-8 flex flex-col gap-12 z-10">
        {/* Title and Intro */}
        <div className="flex flex-col gap-4 border-b-3 border-[#2a2a2a] pb-6 mt-4">
          <div className="inline-flex self-start items-center gap-2 bg-wtf-orange border-2 border-[#2a2a2a] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a] tilt-right">
            <span>Engineering & E-E-A-T Standards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
            About TweenLabs
          </h1>
          <p className="text-sm md:text-base font-sans font-medium text-[#4a4a4a] leading-relaxed max-w-3xl">
            TweenLabs is a curated laboratory of premium, portable GreenSock (GSAP) components and animations built for the modern web. We solve the friction between declarative frameworks (React 19, Next.js 16) and imperative animation engines, providing copy-paste-ready UI snippets that work reliably in production.
          </p>
        </div>

        {/* E-E-A-T Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Experience */}
          <div className="brutalist-card bg-white p-6 md:p-8 flex flex-col gap-4 relative">
            <div className="absolute top-4 right-4 font-mono font-bold text-xs text-wtf-orange">
              [ E-01 ]
            </div>
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] border-b-2 border-[#2a2a2a]/20 pb-2">
              🛠️ Experience
            </h2>
            <p className="text-sm font-sans text-zinc-700 leading-relaxed">
              Every animation component in TweenLabs is engineered, tested, and vetted in real browser environments. We verify gesture handlers, viewport intersection performance, scroll velocity tracking, touch screen reactivity, and device scaling to guarantee fluid 60+ FPS user interfaces.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <span className="font-mono text-[10px] font-bold bg-[#fafaf9] border border-[#2a2a2a]/30 px-2 py-0.5 rounded">
                Touch Reactivity
              </span>
              <span className="font-mono text-[10px] font-bold bg-[#fafaf9] border border-[#2a2a2a]/30 px-2 py-0.5 rounded">
                Cross-Browser Tested
              </span>
              <span className="font-mono text-[10px] font-bold bg-[#fafaf9] border border-[#2a2a2a]/30 px-2 py-0.5 rounded">
                60 FPS Profiles
              </span>
            </div>
          </div>

          {/* Card 2: Expertise */}
          <div className="brutalist-card bg-white p-6 md:p-8 flex flex-col gap-4 relative">
            <div className="absolute top-4 right-4 font-mono font-bold text-xs text-wtf-green">
              [ E-02 ]
            </div>
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] border-b-2 border-[#2a2a2a]/20 pb-2">
              💡 Expertise
            </h2>
            <p className="text-sm font-sans text-zinc-700 leading-relaxed">
              Our codebases employ strict GSAP-in-React best practices. We utilize the official `@gsap/react` `useGSAP` hook for scoped selector bindings, automatic timeline cleanup, and dependency tracking. This ensures memory leaks, state desynchronization, and Next.js hydration issues are completely avoided.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <span className="font-mono text-[10px] font-bold bg-[#fafaf9] border border-[#2a2a2a]/30 px-2 py-0.5 rounded">
                useGSAP Hooks
              </span>
              <span className="font-mono text-[10px] font-bold bg-[#fafaf9] border border-[#2a2a2a]/30 px-2 py-0.5 rounded">
                Timeline Cleanup
              </span>
              <span className="font-mono text-[10px] font-bold bg-[#fafaf9] border border-[#2a2a2a]/30 px-2 py-0.5 rounded">
                RSC Architecture
              </span>
            </div>
          </div>

          {/* Card 3: Authoritativeness */}
          <div className="brutalist-card bg-white p-6 md:p-8 flex flex-col gap-4 relative">
            <div className="absolute top-4 right-4 font-mono font-bold text-xs text-wtf-purple">
              [ A-01 ]
            </div>
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] border-b-2 border-[#2a2a2a]/20 pb-2">
              🎓 Authoritativeness
            </h2>
            <p className="text-sm font-sans text-zinc-700 leading-relaxed">
              TweenLabs relies directly on industry-standard animation conventions. We link directly to official documentation, support open standards, and base our designs on well-documented mechanics. You can cross-reference our solutions with the official guidelines.
            </p>
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#2a2a2a]/10">
              <a
                id="ref-gsap-docs"
                href="https://gsap.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-wtf-purple hover:underline"
              >
                → Official GreenSock (GSAP) Docs ↗
              </a>
              <a
                id="ref-react-docs"
                href="https://react.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-wtf-purple hover:underline"
              >
                → React documentation ↗
              </a>
            </div>
          </div>

          {/* Card 4: Trustworthiness */}
          <div className="brutalist-card bg-white p-6 md:p-8 flex flex-col gap-4 relative">
            <div className="absolute top-4 right-4 font-mono font-bold text-xs text-wtf-blue">
              [ T-01 ]
            </div>
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] border-b-2 border-[#2a2a2a]/20 pb-2">
              🤝 Trustworthiness
            </h2>
            <p className="text-sm font-sans text-zinc-700 leading-relaxed">
              TweenLabs is 100% open-source under the MIT License. There are zero tracking scripts, zero cookies, and zero paywalls. Everything is hosted publicly on GitHub for community auditing, contributions, and bug reporting. The code you copy is the code that runs—nothing hidden.
            </p>
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#2a2a2a]/10">
              <a
                id="ref-github-repo"
                href="https://github.com/GSAP-PLAYGROUND/TweenLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-wtf-blue hover:underline"
              >
                → TweenLabs GitHub Repository ↗
              </a>
              <Link
                id="ref-mit-license"
                href="/LICENSE"
                className="text-xs font-mono font-bold text-wtf-blue hover:underline"
              >
                → View MIT License
              </Link>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 border-t-3 border-[#2a2a2a]/20">
          <Link
            id="about-back-btn"
            href="/"
            className="w-full sm:w-auto text-center brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer"
          >
            ← Back to Directory
          </Link>
          <a
            id="about-github-btn"
            href="https://github.com/GSAP-PLAYGROUND/TweenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-sm py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer transition-colors"
          >
            View on GitHub ↗
          </a>
        </div>
      </main>
    </div>
  );
}
