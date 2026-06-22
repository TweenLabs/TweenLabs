import { animations } from "@/data/animations";

export const SHELL_QUICK_LINKS = [
  { name: "Installation", href: "/installation", slug: "installation" },
  { name: "How to Setup", href: "/how-to-setup", slug: "how-to-setup" },
  { name: "Collaborate", href: "/collaborate", slug: "collaborate" },
  {
    name: "Playground",
    href: "/playground",
    slug: "playground",
    badge: "Beta",
  },
] as const;

export function normalizePath(pathname: string | null): string {
  if (!pathname) return "/";
  return pathname.replace(/\/$/, "") || "/";
}

export function isShellRoute(pathname: string | null): boolean {
  const path = normalizePath(pathname);
  if (SHELL_QUICK_LINKS.some((link) => link.href === path)) return true;
  return animations.some((anim) => anim.route === path);
}

export function isShellDemoPage(pathname: string | null): boolean {
  const path = normalizePath(pathname);
  return animations.some((anim) => anim.route === path);
}

export function isShellPlayground(pathname: string | null): boolean {
  return normalizePath(pathname) === "/playground";
}
