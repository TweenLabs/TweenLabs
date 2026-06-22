import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { animations } from "@/data/components";

const colorDot: Record<string, string> = {
  "bg-wtf-green": "bg-[#0c9367]",
  "bg-wtf-yellow": "bg-[#f1b333]",
  "bg-wtf-blue": "bg-[#3b82f6]",
  "bg-wtf-orange": "bg-[#e55b3c]",
  "bg-wtf-purple": "bg-[#6758a5]",
  "bg-wtf-red": "bg-[#c53b3a]",
};

export function AppSidebar() {
  return (
    <Sidebar className="border-r-2 border-[#2a2a2a]/15">
      <SidebarHeader className="p-4 border-b-2 border-[#2a2a2a]/10">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="TweenLabs Logo"
            width={24}
            height={24}
            className="object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif font-black text-lg tracking-tight text-[#2a2a2a] group-hover:text-[#e55b3c] transition-colors duration-150">
            TweenLabs
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-3">
            Components ({animations.length})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {animations.map((anim) => (
                <SidebarMenuItem key={anim.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={anim.route}
                      className="flex items-center gap-2.5 font-mono text-xs font-bold text-[#2a2a2a]"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${colorDot[anim.bgColor] || "bg-zinc-400"}`}
                      />
                      <span className="truncate">{anim.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t-2 border-[#2a2a2a]/10">
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/TweenLabs/TweenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-[10px] font-bold text-zinc-500 hover:text-[#e55b3c] transition-colors duration-150 uppercase tracking-wider"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub ↗
          </a>
          <Link
            href="/"
            className="font-mono text-[10px] font-bold text-zinc-500 hover:text-[#e55b3c] transition-colors duration-150 uppercase tracking-wider"
          >
            ← Back to Home
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
