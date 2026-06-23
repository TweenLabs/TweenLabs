import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/playground", "/_next/", "/code/"],
      },
      {
        // Allow Google to index everything public
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        // Allow AI crawlers to read docs (LLMs-full, component pages)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Claude-Web",
          "Applebot-Extended",
        ],
        allow: ["/", "/llms", "/llms-full", "/components/"],
        disallow: ["/api/", "/playground", "/_next/"],
      },
    ],
    sitemap: siteConfig.fullUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
