export default function FAQ() {
  return (
    <section 
      className="w-full max-w-7xl px-4 md:px-8 py-12 flex flex-col gap-8 z-10 border-t-3 border-[#2a2a2a] mt-8"
      aria-labelledby="faq-title"
    >
      <h2 
        id="faq-title" 
        className="text-3xl font-sans font-black uppercase tracking-tight text-[#2a2a2a]"
      >
        Frequently Asked Questions
      </h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <dt className="text-lg font-mono font-bold text-wtf-orange uppercase">
            What is TweenLabs?
          </dt>
          <dd className="text-sm font-sans font-medium text-zinc-600 leading-relaxed m-0">
            TweenLabs is a dedicated front-end animation resource library featuring production-ready GreenSock (GSAP) components and interactive React templates. It provides web developers and UI designers with reusable, copy-paste code snippets to build high-fidelity scroll animations, creative layouts, and interactive web experiences.
          </dd>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <dt className="text-lg font-mono font-bold text-wtf-purple uppercase">
            Are these GSAP components free?
          </dt>
          <dd className="text-sm font-sans font-medium text-zinc-650 leading-relaxed m-0">
            Yes, all TweenLabs animations and layouts are free and open-source.
            Simply click &quot;Get Code&quot; on any card, install the required
            packages, and drop the code directly into your codebase.
          </dd>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <dt className="text-lg font-mono font-bold text-wtf-green uppercase">
            What frameworks are supported?
          </dt>
          <dd className="text-sm font-sans font-medium text-zinc-650 leading-relaxed m-0">
            Our components are optimized for **React 19**, **Next.js 16 (App
            Router)**, **TypeScript**, and **Tailwind CSS**. They utilize
            standard clean packages like <code>@gsap/react</code> and{" "}
            <code>Lenis</code> smooth scrolling.
          </dd>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <dt className="text-lg font-mono font-bold text-wtf-blue uppercase">
            What kind of GSAP components are included?
          </dt>
          <dd className="text-sm font-sans font-medium text-zinc-650 leading-relaxed m-0">
            TweenLabs houses a wide range of creative mechanics: 3D hover tilt
            grids, kinetic wave typography, scroll-pinned parallax card decks,
            pointer drag carousel wheels, elastic fluid cursors, and animated
            SVG networks.
          </dd>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <dt className="text-lg font-mono font-bold text-wtf-red uppercase">
            How to optimize GSAP for Next.js App Router?
          </dt>
          <dd className="text-sm font-sans font-medium text-zinc-650 leading-relaxed m-0">
            To optimize GSAP in Next.js App Router, run all timeline configurations inside client-side components using the <code>useGSAP</code> hook. Use CSS initial values for layout properties to prevent Layout Shifts (CLS), and wrap animations in media checks to respect user preferences.
          </dd>
        </div>

        <div className="brutalist-card p-6 bg-white flex flex-col gap-3">
          <dt className="text-lg font-mono font-bold text-wtf-orange uppercase">
            How to prevent GSAP memory leaks in React?
          </dt>
          <dd className="text-sm font-sans font-medium text-zinc-650 leading-relaxed m-0">
            Always clean up your animation contexts when React components unmount. Using the official <code>@gsap/react</code> <code>useGSAP</code> helper hook automatically performs context reversion and cleanup when the component unmounts, preventing memory leaks and orphaned timelines.
          </dd>
        </div>
      </dl>
    </section>
  );
}
