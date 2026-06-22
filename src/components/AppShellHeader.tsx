"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { animations } from "@/data/animations";
import {
  isShellDemoPage,
  normalizePath,
  SHELL_QUICK_LINKS,
} from "@/lib/shell-routes";
import { useSession } from "@/provider/SessionProvider";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const GITHUB_REPO = "https://github.com/TweenLabs/TweenLabs";
const GITHUB_API = "https://api.github.com/repos/TweenLabs/TweenLabs";

function useBreadcrumbs() {
  const pathname = usePathname();
  const path = normalizePath(pathname);

  return useMemo(() => {
    const crumbs: { label: string; href?: string }[] = [
      { label: "TweenLabs", href: "/" },
    ];

    const quickLink = SHELL_QUICK_LINKS.find((link) => link.href === path);
    if (quickLink) {
      crumbs.push({ label: quickLink.name });
      return crumbs;
    }

    if (isShellDemoPage(pathname)) {
      crumbs.push({ label: "Components", href: "/" });
      const anim = animations.find((item) => item.route === path);
      if (anim) crumbs.push({ label: anim.name });
    }

    return crumbs;
  }, [path, pathname]);
}

function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GITHUB_API)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.stargazers_count != null) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a
      href={GITHUB_REPO}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#2a2a2a] hover:text-wtf-orange transition-colors duration-150 shrink-0"
      aria-label="Star TweenLabs on GitHub"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      <span>{stars != null ? stars.toLocaleString() : "—"}</span>
    </a>
  );
}

function UserProfile() {
  const { session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsOpen(false);
    router.push("/");
  };

  if (!session?.user) {
    return null;
  }

  const userName = session.user.name || "User";
  const truncatedName = userName.length > 15 ? userName.slice(0, 12) + "..." : userName;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#2a2a2a] bg-[#fafaf9] hover:bg-[#f5f5f4] transition-colors duration-150 cursor-pointer shrink-0"
      >
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={28}
            height={28}
            className="rounded-md object-cover"
          />
        )}
        <span className="font-mono text-xs font-bold text-[#2a2a2a] truncate max-w-[80px]">
          {truncatedName}
        </span>
        <svg
          className={cn(
            "w-4 h-4 text-[#2a2a2a] transition-transform duration-150",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg border-2 border-[#2a2a2a] bg-[#fafaf9] shadow-[4px_4px_0px_#2a2a2a] z-50 overflow-hidden">
          <div className="p-3 border-b-2 border-[#2a2a2a]">
            <p className="font-mono text-xs font-bold text-[#2a2a2a]">
              {session.user.name}
            </p>
            <p className="font-mono text-[11px] text-zinc-500 truncate">
              {session.user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 font-mono text-xs font-bold text-[#2a2a2a] hover:bg-wtf-orange hover:text-white transition-colors duration-150 text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}


export function AppShellHeader() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const breadcrumbs = useBreadcrumbs();

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 border-b-[3px] border-[#2a2a2a] bg-[#fafaf9] px-3 py-2 md:px-4 md:py-2.5 z-20">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
          <SidebarTrigger className="brutalist-btn size-8 shrink-0 rounded-lg border-2 border-[#2a2a2a] bg-white shadow-[2px_2px_0px_#2a2a2a] hover:bg-wtf-yellow" />

          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="font-mono text-[11px] md:text-xs font-bold uppercase tracking-wide text-zinc-500 flex-nowrap">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <span key={`${crumb.label}-${index}`} className="contents">
                    {index > 0 && (
                      <BreadcrumbSeparator className="text-zinc-400" />
                    )}
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage className="text-[#2a2a2a] truncate max-w-[120px] sm:max-w-none">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={crumb.href}
                            className="text-zinc-500 hover:text-wtf-orange truncate max-w-[100px] sm:max-w-none"
                          >
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            type="button"
            onClick={openSearch}
            className={cn(
              "hidden sm:flex items-center gap-2 h-8 min-w-[180px] md:min-w-[220px] lg:min-w-[280px] px-3",
              "rounded-lg border-2 border-[#2a2a2a]/30 bg-white/80 font-mono text-xs text-zinc-500",
              "hover:border-[#2a2a2a] hover:bg-white transition-colors duration-150 cursor-pointer",
            )}
          >
            <span className="flex-1 text-left">Search documentation...</span>
            <kbd className="hidden md:inline-flex h-5 items-center rounded border border-[#2a2a2a]/20 bg-[#fafaf9] px-1.5 font-mono text-[10px] text-zinc-500">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={openSearch}
            className="sm:hidden brutalist-btn size-8 rounded-lg border-2 border-[#2a2a2a] bg-white shadow-[2px_2px_0px_#2a2a2a] flex items-center justify-center"
            aria-label="Search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <UserProfile />
          <GitHubStars />
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search components, docs, and pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Setup">
            {SHELL_QUICK_LINKS.map((link) => (
              <CommandItem
                key={link.href}
                value={`${link.name} ${link.slug}`}
                onSelect={() => navigate(link.href)}
              >
                {link.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Components">
            {animations.map((anim) => (
              <CommandItem
                key={anim.id}
                value={`${anim.name} ${anim.componentName}`}
                onSelect={() => navigate(anim.route)}
              >
                {anim.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
