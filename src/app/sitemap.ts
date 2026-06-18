import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tweenlabs.xyz";
  const routes = [
    "",
    "/01-gravity-drop",
    "/02-scroll-tags-assembly",
    "/03-inward-outward-border-reveal",
    "/04-horizontal-cards-showcase",
    "/05-page-change-animation",
    "/06-kinetic-typography",
    "/07-scroll-orbit-gallery",
    "/08-blueprint-scatter",
    "/09-circular-scatter",
    "/10-screen-skill-fit",
    "/11-magnetic-dock",
    "/12-fluid-cursor",
    "/13-bento-grid-flip",
    "/14-3d-carousel",
    "/15-morphing-accordion",
    "/16-scroll-cards-01",
    "/16b-scroll-cards-classic",
    "/17-showup-cards",
    "/18-string-line",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
