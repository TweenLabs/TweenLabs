import Link from "next/link";
import type { ReactNode } from "react";

interface DocPageProps {
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function DocPage({ badge, title, description, children }: DocPageProps) {
  return (
    <div className="relative flex flex-1 flex-col bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black">
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-4 border-b-3 border-[#2a2a2a] pb-6">
          <div className="inline-flex self-start items-center gap-2 bg-wtf-orange border-2 border-[#2a2a2a] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a]">
            {badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base font-sans font-medium text-[#4a4a4a] leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DocSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="brutalist-card bg-white p-6 md:p-8 flex flex-col gap-4">
      <h2 className="text-lg font-serif font-black uppercase tracking-tight border-b-2 border-[#2a2a2a]/20 pb-2">
        {title}
      </h2>
      <div className="text-sm font-sans text-zinc-700 leading-relaxed flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}

export function DocCode({ children }: { children: string }) {
  return (
    <pre className="font-mono text-xs bg-[#fafaf9] border-2 border-[#2a2a2a] rounded-lg p-4 overflow-x-auto shadow-[3px_3px_0px_#2a2a2a]">
      {children}
    </pre>
  );
}

export function DocLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono font-bold text-wtf-orange hover:underline"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="font-mono font-bold text-wtf-orange hover:underline">
      {children}
    </Link>
  );
}
