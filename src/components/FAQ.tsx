export default function FAQ() {
  return (
    <section className="w-full max-w-7xl px-4 md:px-8 py-12 flex flex-col gap-8 z-10 border-t-3 border-[#2a2a2a] mt-8">
      <h2 className="text-3xl font-sans font-black uppercase tracking-tight text-[#2a2a2a]">
        Frequently Asked Questions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <h3 className="text-lg font-mono font-bold text-wtf-orange uppercase">
            What is TweenLabs?
          </h3>
          <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
            TweenLabs is a curated library of high-fidelity, interactive, and
            portable GSAP components, UI templates, and scroll-triggered
            animations. Every resource is designed to be easily copy-pasted into
            your React and Next.js projects.
          </p>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <h3 className="text-lg font-mono font-bold text-wtf-purple uppercase">
            Are these GSAP components free?
          </h3>
          <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
            Yes, all TweenLabs animations and layouts are free and open-source.
            Simply click &quot;Get Code&quot; on any card, install the required
            packages, and drop the code directly into your codebase.
          </p>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <h3 className="text-lg font-mono font-bold text-wtf-green uppercase">
            What frameworks are supported?
          </h3>
          <p className="text-sm font-sans font-medium text-zinc-650 leading-relaxed">
            Our components are optimized for **React 19**, **Next.js 16 (App
            Router)**, **TypeScript**, and **Tailwind CSS**. They utilize
            standard clean packages like <code>@gsap/react</code> and{" "}
            <code>Lenis</code> smooth scrolling.
          </p>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <h3 className="text-lg font-mono font-bold text-wtf-blue uppercase">
            What kind of GSAP components are included?
          </h3>
          <p className="text-sm font-sans font-medium text-zinc-650 leading-relaxed">
            TweenLabs houses a wide range of creative mechanics: 3D hover tilt
            grids, kinetic wave typography, scroll-pinned parallax card decks,
            pointer drag carousel wheels, elastic fluid cursors, and animated
            SVG networks.
          </p>
        </div>
      </div>
    </section>
  );
}
