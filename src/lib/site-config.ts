/**
 * Site configuration — single source of truth for all site-wide constants.
 *
 * Usage:
 *   import { siteConfig } from "@/lib/site-config";
 *   siteConfig.url    → "https://tweenlabs.xyz"
 *   siteConfig.name   → "TweenLabs"
 *   siteConfig.url("/blog") → "https://tweenlabs.xyz/blog"
 *
 * All values derive from NEXT_PUBLIC_SITE_URL env var.
 * Change the domain once in .env → applies everywhere.
 */

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

const baseUrl = getBaseUrl();

export const siteConfig = {
  /** Canonical base URL (no trailing slash) */
  url: baseUrl,

  /** Full URL helper — siteConfig.fullUrl("/blog") → "https://tweenlabs.xyz/blog" */
  fullUrl: (path: string) => `${baseUrl}${path}`,

  /** Site name */
  name: "TweenLabs",

  /** Site description for SEO */
  description:
    "TweenLabs is an open-source library of premium, copy-paste React, Next.js, and GSAP animation components. Build high-fidelity web experiences with ScrollTrigger, 3D tilt, and interactive typography templates.",

  /** Social handles */
  twitter: "@TweenLabs",
  github: "https://github.com/TweenLabs/TweenLabs",

  /** Logo URLs (relative paths — resolved at render time) */
  logo: {
    svg: "/logo.svg",
    png: "/logo.png",
  },

  /** OG image */
  ogImage: `${baseUrl}/logo.png`,
} as const;
