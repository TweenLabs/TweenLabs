import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TweenLabs",
    short_name: "TweenLabs",
    description: "The best premium open-source GSAP component library for Next.js and React.",
    start_url: "/",
    display: "standalone",
    background_color: "#f0eadf",
    theme_color: "#e55b3c",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
