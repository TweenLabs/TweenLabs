"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animations } from "@/data/animations";
import { SHELL_QUICK_LINKS } from "@/lib/shell-routes";
import { cn } from "@/lib/utils";

const textAnimationSlugs = [
  "KineticText",
  "ParallaxHero",
  "RevealText",
  "MorphingText",
  "GravityDrop",
  "BorderReveal",
];

export function AppSidebar() {
  const pathname = usePathname();

  // Filter animations for the requested sections
  const textAnimations = textAnimationSlugs
    .map((slug) => animations.find((anim) => anim.componentName === slug))
    .filter((anim): anim is NonNullable<typeof anim> => !!anim);

  const coolAnimations = animations.filter(
    (anim) => !textAnimationSlugs.includes(anim.componentName)
  );

  const quickSetupLinks = SHELL_QUICK_LINKS.map((link) => ({
    name: link.name,
    href: link.href,
    external: false as const,
    badge: "badge" in link ? link.badge : undefined,
  }));

  return (
    <Sidebar data-lenis-prevent className="border-r-[3px] border-[#2a2a2a] bg-[#fafaf9] z-40">
      {/* Header section with Logo */}
      <SidebarHeader className="p-0 border-b-[3px] border-[#2a2a2a] bg-[#fafaf9] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} />
        <div className="p-4 flex items-center justify-center z-10 relative">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Image
              src="/logo.svg"
              alt="TweenLabs Logo"
              width={26}
              height={26}
              priority
              className="object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-serif font-black text-xl tracking-tight text-[#2a2a2a] group-hover:text-wtf-orange transition-colors duration-150">
              TweenLabs
            </span>
          </Link>
        </div>
      </SidebarHeader>

      {/* Main sidebar contents scroll area */}
      <SidebarContent data-lenis-prevent className="bg-[#fafaf9] p-4 flex flex-col gap-6 overflow-y-auto z-10 relative scrollbar-none">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} />

        {/* Quick Setup Section */}
        <div className="flex flex-col gap-2.5 z-10 relative">
          <div className="flex items-center justify-center border-b-2 border-dashed border-[#2a2a2a]/20 pb-2">
            <h3 className="font-serif font-black uppercase tracking-wider text-xs text-[#2a2a2a] text-center">
              Quick Setup
            </h3>
          </div>
          <div className="flex flex-col gap-1.5">
            {quickSetupLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 border-transparent transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-wtf-yellow text-black border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] translate-x-[-2px] translate-y-[-2px]"
                      : "text-zinc-650 hover:text-wtf-orange hover:bg-[#2a2a2a]/5 hover:translate-x-1"
                  )}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#2a2a2a] bg-wtf-green text-white shadow-[1px_1px_0px_#2a2a2a] uppercase tracking-wide">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-[3px] border-[#2a2a2a] my-1 z-10 relative" />

        {/* Text Animations Section */}
        <div className="flex flex-col gap-2 z-10 relative">
          <h4 className="font-mono text-[10px] font-black text-wtf-orange uppercase tracking-widest pl-2">
            Text Animations
          </h4>
          <div className="flex flex-col gap-1">
            {textAnimations.map((anim) => {
              const isActive = pathname === anim.route;
              const isMorphing = anim.componentName === "MorphingText";
              const isBorderReveal = anim.componentName === "BorderReveal";
              const isGravityDrop = anim.componentName === "GravityDrop";

              return (
                <Link
                  key={anim.id}
                  href={anim.route}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 border-transparent transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-wtf-orange text-white border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] translate-x-[-2px] translate-y-[-2px]"
                      : "text-[#2a2a2a] hover:text-wtf-orange hover:bg-[#2a2a2a]/5 hover:translate-x-1"
                  )}
                >
                  <span>{anim.name}</span>
                  <div className="flex items-center gap-1">
                    {(isMorphing || isBorderReveal || isGravityDrop) && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#2a2a2a] bg-orange-400 text-white shadow-[1px_1px_0px_#2a2a2a] uppercase tracking-wide">
                        Hot
                      </span>
                    )}
                    {isMorphing && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#2a2a2a] bg-[#fafaf9] text-wtf-orange shadow-[1px_1px_0px_#2a2a2a] uppercase tracking-wide">
                        NEW
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-[3px] border-[#2a2a2a] my-1 z-10 relative" />

        {/* Cool Animations Section */}
        <div className="flex flex-col gap-2 z-10 relative">
          <h4 className="font-mono text-[10px] font-black text-wtf-blue uppercase tracking-widest pl-2">
            Cool Animations
          </h4>
          <div className="flex flex-col gap-1">
            {coolAnimations.map((anim) => {
              const isActive = pathname === anim.route;
              return (
                <Link
                  key={anim.id}
                  href={anim.route}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs font-bold border-2 border-transparent transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-wtf-blue text-white border-[#2a2a2a] shadow-[2px_2px_0px_#2a2a2a] translate-x-[-2px] translate-y-[-2px]"
                      : "text-[#2a2a2a] hover:text-wtf-blue hover:bg-[#2a2a2a]/5 hover:translate-x-1"
                  )}
                >
                  <span>{anim.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </SidebarContent>

      {/* Footer Playground Card */}
      <SidebarFooter className="p-3 border-t-[3px] border-[#2a2a2a] bg-[#fafaf9] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} />
        <div className="brutalist-card bg-wtf-yellow p-3.5 flex flex-col gap-2 rounded-xl border-3 border-[#2a2a2a] shadow-[4px_4px_0px_#2a2a2a] relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-black uppercase tracking-tight text-xs text-[#2a2a2a]">
              Playground
            </span>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-wtf-green text-white border border-black rounded shadow-[1px_1px_0px_#000]">
              AI AGENT
            </span>
          </div>
          <p className="font-sans text-[11px] leading-relaxed font-semibold text-zinc-800">
            Let agent make customized animation for you under 1 min.
          </p>
          <Link
            href="/playground"
            className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-xs font-mono font-bold py-1.5 px-3 rounded-lg uppercase transition-colors duration-150 text-center cursor-pointer shadow-[2px_2px_0px_#2a2a2a] w-full mt-1 flex items-center justify-center gap-1.5"
          >
            Try now <span>⚡</span>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}


