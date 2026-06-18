import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { animations } from "@/data/animations";
import CodePageClient from "@/components/CodePageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ParsedMarkdown {
  title: string;
  intro: string;
  coreGsap: string | null;
  standalone: string | null;
  setupGuide: string | null;
}

// Helper to parse HOW_TO_USE.md
function parseHowToUse(markdown: string): ParsedMarkdown {
  const result: ParsedMarkdown = {
    title: "",
    intro: "",
    coreGsap: null,
    standalone: null,
    setupGuide: null,
  };

  // Extract Title
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    result.title = titleMatch[1];
  }

  // Split by headers (e.g. ## or ###) to separate sections
  const sections = markdown.split(/\n(?=(?:##|###)\s+)/);

  for (const sec of sections) {
    const headerMatch = sec.match(/^(##|###)\s+(.+)$/m);
    if (!headerMatch) {
      // This is the intro section (before any ## or ### header)
      if (sec.trim().startsWith("#")) {
        result.intro = sec.replace(/^#\s+.+$/m, "").trim();
      } else {
        result.intro = sec.trim();
      }
      continue;
    }

    const headerText = headerMatch[2].toLowerCase();
    const codeBlockMatch = sec.match(/```[a-z]*\n([\s\S]*?)```/);
    const code = codeBlockMatch ? codeBlockMatch[1].trim() : null;

    if (headerText.includes("standalone") || headerText.includes("component")) {
      result.standalone = code;
    } else if (headerText.includes("core") || headerText.includes("animation")) {
      result.coreGsap = code;
    } else if (headerText.includes("setup") || headerText.includes("dependenc")) {
      result.setupGuide = sec.trim();
    }
  }

  return result;
}


// Generate static params for all available animations
export async function generateStaticParams() {
  return animations.map((anim) => ({
    slug: anim.route.slice(1),
  }));
}

// Dynamic Metadata generation for SEO optimization
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const anim = animations.find((a) => a.route.slice(1) === slug);
  
  return {
    title: anim 
      ? `GSAP ${anim.name} Source Code & Setup Guide | TweenLabs` 
      : "Component Source Code | TweenLabs",
    description: anim 
      ? `Copy and download the clean standalone source code and view the setup guide for the ${anim.name} GSAP animation on TweenLabs.` 
      : "View component source code and integration guide.",
  };
}

export default async function CodePage({ params }: PageProps) {
  const { slug } = await params;

  // Verify that the slug is a valid animation
  const anim = animations.find((a) => a.route.slice(1) === slug);
  if (!anim) {
    notFound();
  }

  const appDir = path.join(process.cwd(), "src", "app");
  const pagePath = path.join(appDir, slug, "page.tsx");
  const howToUsePath = path.join(appDir, slug, "HOW_TO_USE.md");

  let pageCode = "";
  try {
    pageCode = fs.readFileSync(pagePath, "utf-8");
  } catch (err) {
    console.error(`Error reading page file at ${pagePath}:`, err);
    notFound();
  }

  let standaloneCode: string | null = null;
  let coreGsapCode: string | null = null;
  let setupGuide: string | null = null;

  if (fs.existsSync(howToUsePath)) {
    try {
      const howToUseMd = fs.readFileSync(howToUsePath, "utf-8");
      const parsed = parseHowToUse(howToUseMd);
      standaloneCode = parsed.standalone;
      coreGsapCode = parsed.coreGsap;
      setupGuide = parsed.setupGuide;
    } catch (err) {
      console.error(`Error reading/parsing HOW_TO_USE.md at ${howToUsePath}:`, err);
    }
  }

  return (
    <CodePageClient
      slug={slug}
      name={anim.name}
      description={anim.description}
      pageCode={pageCode}
      standaloneCode={standaloneCode}
      coreGsapCode={coreGsapCode}
      setupGuide={setupGuide}
    />
  );
}
