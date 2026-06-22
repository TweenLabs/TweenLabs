"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { animations } from "@/data/components";

interface QuickSetupItem {
  name: string;
  href: string;
  external?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface CategoryGroup {
  label: string;
  items?: QuickSetupItem[];
  components?: typeof animations;
}

const categories: CategoryGroup[] = [
  {
    label: "Quick Setup",
    items: [
      { name: "Installation & Setup", href: "/installation" },
      { name: "Contribution", href: "/contribution" },
      { name: "Playground", href: "/playground", badge: "BETA", badgeColor: "bg-[#0c9367] text-white" },
    ],
  },
  {
    label: "All Components",
    items: [
      { name: "Browse All", href: "/components" },
    ],
  },
  {
    label: "Text Animations",
    components: animations.filter((a) =>
      ["KineticText", "ParallaxHero", "RevealText", "MorphingText"].includes(a.componentName)
    ),
  },
  {
    label: "Scroll Effects",
    components: animations.filter((a) =>
      ["ScrollCards", "ScrollTags", "HorizontalCards", "PageTransition", "BorderReveal"].includes(a.componentName)
    ),
  },
  {
    label: "Cards & Grids",
    components: animations.filter((a) =>
      ["FlipCards", "BentoGrid", "Carousel3D", "CircularScatter", "OrbitGallery"].includes(a.componentName)
    ),
  },
  {
    label: "Interactive",
    components: animations.filter((a) =>
      ["FluidCursor", "MagneticDock", "GravityDrop", "StringLine", "TabsMotion"].includes(a.componentName)
    ),
  },
  {
    label: "Layout & UI",
    components: animations.filter((a) =>
      ["Blueprint", "SkillFit", "Accordion"].includes(a.componentName)
    ),
  },
];

// Tags for special components
const specialTags: Record<string, { label: string; color: string }[]> = {
  MorphingText: [
    { label: "HOT", color: "bg-[#e55b3c] text-white" },
    { label: "NEW", color: "bg-[#0c9367] text-white" },
  ],
  TabsMotion: [{ label: "NEW", color: "bg-[#0c9367] text-white" }],
  ParallaxHero: [{ label: "NEW", color: "bg-[#0c9367] text-white" }],
};

export function AppSidebar() {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, "") ?? "";
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="bg-white text-[#2a2a2a] transition-all duration-200 z-40"
    >
      {/* Sidebar Header: Brand Info */}
      <div
        data-slot="sidebar-header"
        data-sidebar="header"
        className="h-[72px] flex flex-row items-center justify-center px-4 md:px-6 border-b-3 border-[#2a2a2a] shrink-0 bg-white"
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="TweenLabs Logo"
            width={28}
            height={28}
            className="object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
          />
          <span className="font-serif font-black text-lg md:text-xl tracking-tight text-[#2a2a2a] group-hover:text-[#e55b3c] transition-colors duration-150 group-data-[collapsible=icon]:hidden whitespace-nowrap">
            TweenLabs
          </span>
        </Link>
      </div>

      {/* Sidebar Navigation items */}
      <SidebarContent
        className="bg-white py-4 overscroll-contain scrollbar-none"
        onWheel={(e) => e.stopPropagation()}
      >
        {categories.map((cat) => (
          <SidebarGroup key={cat.label} className="py-2 px-0">
            <SidebarGroupLabel className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 mb-1 group-data-[collapsible=icon]:hidden">
              {cat.label}
            </SidebarGroupLabel>
            
            {/* Dashed line separator */}
            <div className="border-b border-dashed border-[#2a2a2a]/15 mx-4 mb-2 group-data-[collapsible=icon]:hidden" />
            
            <SidebarGroupContent>
              <SidebarMenu className="px-2">
                {/* Static items (Quick Setup) */}
                {cat.items?.map((item) => {
                  const isActive = normalizedPath === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="hover:bg-[#2a2a2a]/5 active:bg-[#2a2a2a]/10"
                      >
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 font-serif text-[13px] font-black text-[#2a2a2a] hover:text-[#e55b3c] transition-colors w-full"
                          >
                            <span className="group-data-[collapsible=icon]:hidden truncate">{item.name}</span>
                            {item.badge && (
                              <span className={cn(item.badgeColor, "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ml-auto shrink-0 group-data-[collapsible=icon]:hidden")}>
                                {item.badge}
                              </span>
                            )}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="flex items-center gap-2.5 font-serif text-[13px] font-black text-[#2a2a2a] hover:text-[#e55b3c] transition-colors w-full"
                          >
                            <span className="group-data-[collapsible=icon]:hidden truncate">{item.name}</span>
                            {item.badge && (
                              <span className={cn(item.badgeColor, "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ml-auto shrink-0 group-data-[collapsible=icon]:hidden")}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* Component items */}
                {cat.components?.map((anim) => {
                  const isActive = normalizedPath === anim.route;
                  const tags = specialTags[anim.componentName];

                  return (
                    <SidebarMenuItem key={anim.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="hover:bg-[#2a2a2a]/5 active:bg-[#2a2a2a]/10"
                      >
                        <Link
                          href={anim.route}
                          className={cn(
                            "flex items-center gap-2.5 font-serif text-[13px] font-black text-[#2a2a2a] hover:text-[#e55b3c] transition-colors w-full",
                            isActive && "text-[#e55b3c]"
                          )}
                        >
                          {/* Left dot shown on collapsed view for visual representation */}
                          {isCollapsed && (
                            <span className="w-1.5 h-1.5 rounded-full bg-wtf-orange shrink-0 mx-auto" />
                          )}
                          <span className="group-data-[collapsible=icon]:hidden truncate">{anim.name}</span>
                          {tags && (
                            <span className="flex items-center gap-1 ml-auto shrink-0 group-data-[collapsible=icon]:hidden">
                              {tags.map((tag) => (
                                <span
                                  key={tag.label}
                                  className={cn(tag.color, "text-[7px] font-bold px-1 py-0.5 rounded uppercase")}
                                >
                                  {tag.label}
                                </span>
                              ))}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer: Playground Card */}
      <SidebarFooter className="border-t-3 border-[#2a2a2a] bg-white p-3 justify-center shrink-0">
        <div className="bg-white border-2 border-[#2a2a2a] rounded-xl p-3 shadow-[4px_4px_0px_#2a2a2a] mx-1 my-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="font-serif font-black text-[11px] text-[#2a2a2a] tracking-tight">PLAYGROUND</span>
            <span className="bg-[#0c9367] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">AI AGENT</span>
          </div>
          <p className="font-sans text-[10px] text-zinc-500 leading-relaxed mb-3">
            Let agent make customized animation for you under 1 min.
          </p>
          <Link
            href="/playground"
            className="flex items-center justify-center gap-1.5 w-full font-mono text-[10px] font-black text-[#2a2a2a] border-2 border-[#2a2a2a] rounded-lg py-1.5 hover:bg-[#2a2a2a] hover:text-white transition-all shadow-[2px_2px_0px_#2a2a2a] active:translate-y-[1px] active:translate-x-[1px] active:shadow-[1px_1px_0px_#2a2a2a]"
          >
            TRY NOW ⚡
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
