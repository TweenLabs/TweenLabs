"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/provider/SessionProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { animations } from "@/data/components";
import { cn } from "@/lib/utils";

export default function ComponentsHeader() {
  const { session, isPending } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  // Normalize pathname to match components routes
  const normalizedPath = pathname?.replace(/\/$/, "") ?? "";
  const currentAnim = animations.find((a) => a.route === normalizedPath);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-4 md:px-6 border-b-3 border-[#2a2a2a] bg-white shrink-0">
      {/* Left: Sidebar Trigger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Simple sidebar trigger */}
        <SidebarTrigger className="cursor-pointer" />

        <div className="h-6 w-[2px] bg-[#2a2a2a]/20 mx-1" />

        {/* Dynamic Uppercase Breadcrumbs */}
        <nav className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest">
          <Link
            href="/components"
            className={cn(
              "transition-colors",
              currentAnim
                ? "text-zinc-500 hover:text-wtf-orange"
                : "text-[#2a2a2a]"
            )}
          >
            COMPONENTS
          </Link>
          {currentAnim && (
            <>
              <span className="text-zinc-400 font-bold text-zinc-500">&gt;</span>
              <span className="text-[#2a2a2a]">{currentAnim.name.toUpperCase()}</span>
            </>
          )}
        </nav>
      </div>

      {/* Center: Search doc bar placeholder */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
        <div className="flex items-center gap-2 w-full bg-[#f8f5ee] border-2 border-[#2a2a2a]/15 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-400 hover:border-[#2a2a2a]/30 transition-colors cursor-text">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-zinc-500 font-bold text-[11px]">Search documentation...</span>
          <kbd className="ml-auto hidden xl:inline-flex items-center gap-0.5 rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: GitHub status + User menu (GitHub button first) */}
      <div className="flex items-center gap-3">
        {/* GitHub link button with count 7 */}
        <a
          href="https://github.com/TweenLabs/TweenLabs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[11px] font-black text-[#2a2a2a] hover:text-wtf-orange transition-colors border-2 border-[#2a2a2a] bg-white rounded-lg px-2.5 py-1.5 shadow-[2px_2px_0px_#2a2a2a] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[3px_3px_0px_#2a2a2a] active:translate-y-[1px] active:translate-x-[1px] active:shadow-[1px_1px_0px_#2a2a2a]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">7</span>
        </a>

        {user && (
          <div className="flex items-center gap-2 bg-white border-2 border-[#2a2a2a] rounded-lg px-2.5 py-1.5 shadow-[2px_2px_0px_#2a2a2a] select-none">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-5 h-5 rounded-full border border-[#2a2a2a]/15 object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#e55b3c] flex items-center justify-center text-[9px] font-bold text-white">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-mono text-[10px] font-bold text-[#2a2a2a] truncate max-w-[80px] hidden sm:inline">
              {user.name || "User"}
            </span>
            <span className="text-[10px] text-[#2a2a2a] font-bold ml-0.5">↓</span>
          </div>
        )}
      </div>
    </header>
  );
}
