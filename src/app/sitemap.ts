import type { MetadataRoute } from "next";
import { animations } from "@/data/components";
import { seoCategories } from "@/data/seo-categories";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://tweenlabs.xyz";
	const today = new Date().toISOString().split("T")[0];

	// Static high-priority routes
	const staticRoutes = [
		{
			url: `${baseUrl}`,
			lastModified: today,
			changeFrequency: "daily" as const,
			priority: 1.0,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: today,
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
	];

	// AI/LLM discovery routes
	const aiRoutes = [
		{
			url: `${baseUrl}/llms`,
			lastModified: today,
			changeFrequency: "weekly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/llms-full`,
			lastModified: today,
			changeFrequency: "weekly" as const,
			priority: 0.7,
		},
	];

	// SEO landing pages — high priority content pages
	const seoRoutes = [
		{
			url: `${baseUrl}/best-gsap-components`,
			lastModified: today,
			changeFrequency: "weekly" as const,
			priority: 0.9,
		},
		...seoCategories.map((cat) => ({
			url: `${baseUrl}/best-gsap-components/${cat.slug}`,
			lastModified: today,
			changeFrequency: "weekly" as const,
			priority: 0.85,
		})),
	];

	// Blog routes
	const blogRoutes = [
		{
			url: `${baseUrl}/blog`,
			lastModified: today,
			changeFrequency: "weekly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/blog/gsap-vs-framer-motion`,
			lastModified: today,
			changeFrequency: "monthly" as const,
			priority: 0.8,
		},
	];

	// Dynamic component demo routes
	const demoRoutes = animations.map((anim) => ({
		url: `${baseUrl}${anim.route}`,
		lastModified: today,
		changeFrequency: "weekly" as const,
		priority: 0.9,
	}));

	// Dynamic component source code routes
	const codeRoutes = animations.map((anim) => ({
		url: `${baseUrl}/code/${anim.componentName}`,
		lastModified: today,
		changeFrequency: "weekly" as const,
		priority: 0.6,
	}));

	return [
		...staticRoutes,
		...aiRoutes,
		...seoRoutes,
		...blogRoutes,
		...demoRoutes,
		...codeRoutes,
	];
}
