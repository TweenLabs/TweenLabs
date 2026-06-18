import type { MetadataRoute } from "next";
import { animations } from "@/data/animations";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tweenlabs.xyz";

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Dynamic component demo routes (e.g. /01-gravity-drop)
  const demoRoutes = animations.map((anim) => ({
    url: `${baseUrl}${anim.route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic component source code routes (e.g. /code/01-gravity-drop)
  const codeRoutes = animations.map((anim) => ({
    url: `${baseUrl}/code/${anim.route.slice(1)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...demoRoutes, ...codeRoutes];
}
