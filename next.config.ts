import path from "node:path";
import type { NextConfig } from "next";

// Old slug → new route mapping for SEO redirects (one-time, won't grow)
const oldToNew: Record<string, string> = {
  "01-showup-cards": "FlipCards",
  "02-3d-carousel": "Carousel3D",
  "03-screen-skill-fit": "SkillFit",
  "04-page-change-animation": "PageTransition",
  "05-horizontal-cards-showcase": "HorizontalCards",
  "06-circular-scatter": "CircularScatter",
  "07-fluid-cursor": "FluidCursor",
  "08-blueprint-scatter": "Blueprint",
  "09-scroll-cards-01": "ScrollCards",
  "10-scroll-tags-assembly": "ScrollTags",
  "11-scroll-orbit-gallery": "OrbitGallery",
  "12-gravity-drop": "GravityDrop",
  "13-string-line": "StringLine",
  "14-inward-outward-border-reveal": "BorderReveal",
  "15-kinetic-typography": "KineticText",
  "16-magnetic-dock": "MagneticDock",
  "17-bento-grid-flip": "BentoGrid",
  "18-morphing-accordion": "Accordion",
};

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/api/registry/[slug]": ["./src/app/**/*"],
    "/code/[slug]": ["./src/app/**/*"],
  },
  async redirects() {
    const redirects: {
      source: string;
      destination: string;
      permanent: boolean;
    }[] = [
      // Redirect bare /animations to homepage
      { source: "/animations", destination: "/", permanent: false },
      // Redirect old /animations/:name to new /components/:name
      {
        source: "/animations/:slug",
        destination: "/components/:slug",
        permanent: true,
      },
    ];
    // 301 redirects from old URLs to preserve SEO rankings
    for (const [oldSlug, componentName] of Object.entries(oldToNew)) {
      redirects.push({
        source: `/${oldSlug}`,
        destination: `/components/${componentName}`,
        permanent: true,
      });
      redirects.push({
        source: `/code/${oldSlug}`,
        destination: `/code/${componentName}`,
        permanent: true,
      });
    }
    return redirects;
  },
  async headers() {
    return [
      {
        // Allow /preview/* pages to be embedded in same-origin iframes (card previews)
        // CSP frame-ancestors overrides X-Frame-Options in modern browsers
        source: "/preview/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // All non-preview routes: deny framing
        source: "/((?!preview).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:path*(svg|png|jpg|jpeg|gif|webp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
