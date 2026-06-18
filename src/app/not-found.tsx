import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex items-center justify-center p-4 selection:bg-wtf-yellow selection:text-black">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Centered Brutalist 404 Card */}
      <div className="z-10 w-full max-w-md brutalist-card p-8 md:p-10 bg-white flex flex-col items-center gap-6 text-center relative overflow-hidden">
        {/* Animated pulse badge */}
        <div className="inline-flex items-center gap-2 bg-wtf-red border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Error 404</span>
        </div>

        {/* Large Brutalist numbers */}
        <h1 
          className="text-8xl md:text-9xl font-serif font-black tracking-tight text-[#2a2a2a] leading-none"
          style={{ textShadow: "4px 4px 0px #c53b3a" }}
        >
          404
        </h1>

        {/* Semantic message */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
            Lost in TweenLabs ?
          </h2>
          <p className="text-sm font-sans font-medium text-zinc-600 leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been moved, or is still rendering in our timeline.
          </p>
        </div>

        {/* Back to Dashboard Button */}
        <div className="w-full mt-2">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
          className="w-full brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
      </div>
      </div>
    </div>
  );
}
