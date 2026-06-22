import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import CodePageClient from "@/components/CodePageClient";
import { animations } from "@/data/components";
import { isAuthenticated } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ParsedMarkdown {
  title: string;
  intro: string;
  coreGsap: string | null;
  standalone: string | null;
  setupGuide: string | null;
  customization: string | null;
}

// Helper to parse HOW_TO_USE.md
function parseHowToUse(markdown: string): ParsedMarkdown {
  const result: ParsedMarkdown = {
    title: "",
    intro: "",
    coreGsap: null,
    standalone: null,
    setupGuide: null,
    customization: null,
  };

  // Extract Title
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    result.title = titleMatch[1];
  }

  // Split by headers (e.g. ## or ###) to separate sections
  const sections = markdown.split(/\n(?=(?:##|###)\s+)/);

  // Collect setup-related sections to combine
  const setupParts: string[] = [];

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

    const headerText = headerMatch[2].toLowerCase().trim();
    const codeBlockMatch = sec.match(/```[a-z]*\n([\s\S]*?)```/);
    const code = codeBlockMatch ? codeBlockMatch[1].trim() : null;

    if (
      headerText.startsWith("standalone component") ||
      headerText.startsWith("standalone react")
    ) {
      result.standalone = code;
    } else if (
      headerText.startsWith("core gsap") ||
      headerText.startsWith("core animation")
    ) {
      result.coreGsap = code;
    } else if (
      headerText.startsWith("setup & integration") ||
      headerText.startsWith("setup and integration")
    ) {
      // Legacy format — single setup section
      setupParts.push(sec.trim());
    } else if (
      headerText.startsWith("quick start") ||
      headerText.startsWith("manual installation")
    ) {
      // Skip these since they are rendered as Option A and Option B wrappers in CodePageClient
    } else if (
      headerText.startsWith("step ")
    ) {
      setupParts.push(sec.trim());
    } else if (
      headerText.includes("customization") ||
      headerText.includes("properties") ||
      headerText.includes("props") ||
      headerText.includes("theme token")
    ) {
      result.customization = sec.trim();
    } else if (headerText.startsWith("troubleshooting")) {
      setupParts.push(sec.trim());
    } else if (headerText.startsWith("how the animation")) {
      // Skip this wrapper — core gsap code is extracted separately
    }
  }

  // Combine all setup parts into a single guide
  if (setupParts.length > 0) {
    result.setupGuide = setupParts.join("\n\n---\n\n");
  }

  return result;
}

// Generate static params for all available animations
export async function generateStaticParams() {
  return animations.map((anim) => ({
    slug: anim.componentName,
  }));
}

// Dynamic Metadata generation for SEO optimization
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const anim = animations.find((a) => a.componentName === slug);

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
  const anim = animations.find((a) => a.componentName === slug);
  if (!anim) {
    notFound();
  }

  const authenticated = await isAuthenticated();

  const animationsDir = path.join(process.cwd(), "src", "app", "(main)", "components");
  const pagePath = path.join(animationsDir, anim.componentName, "page.tsx");
  const howToUsePath = path.join(
    animationsDir,
    anim.componentName,
    "HOW_TO_USE.md",
  );

  let pageCode = "";
  let standaloneCode: string | null = null;
  let coreGsapCode: string | null = null;
  let setupGuide: string | null = null;
  let customization: string | null = null;

  if (authenticated) {
    try {
      pageCode = fs.readFileSync(pagePath, "utf-8");
    } catch (err) {
      console.error(`Error reading page file at ${pagePath}:`, err);
      notFound();
    }

    if (fs.existsSync(howToUsePath)) {
      try {
        const howToUseMd = fs.readFileSync(howToUsePath, "utf-8");
        const parsed = parseHowToUse(howToUseMd);
        standaloneCode = parsed.standalone;
        coreGsapCode = parsed.coreGsap;
        setupGuide = parsed.setupGuide;
        customization = parsed.customization;
      } catch (err) {
        console.error(
          `Error reading/parsing HOW_TO_USE.md at ${howToUsePath}:`,
          err,
        );
      }
    }
  } else {
    pageCode = `// Please sign in to view the code.
// Go back to the homepage or click Sign In at the top to login with Google or GitHub.`;
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `https://tweenlabs.xyz/code/${slug}/#software`,
    name: `TweenLabs ${anim.name} Component Source Code`,
    description: anim.description,
    programmingLanguage: {
      "@type": "ComputerLanguage",
      name: "TypeScript",
      alternateName: "TS",
    },
    codeRepository: "https://github.com/TweenLabs/TweenLabs",
    runtimePlatform: "Next.js 16, React 19, GSAP 3.15, Tailwind CSS 4",
    codeSampleType: "snippet",
    text: authenticated
      ? standaloneCode || pageCode
      : "Please sign in to view the source code.",
    author: {
      "@type": "Organization",
      name: "TweenLabs",
      url: "https://tweenlabs.xyz",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `https://tweenlabs.xyz/code/${slug}/#howto`,
    name: `How to integrate the GSAP ${anim.name} Component in Next.js`,
    description: `Step-by-step developer tutorial showing how to install dependencies and run the copy-paste ${anim.name} animation component.`,
    step: [
      {
        "@type": "HowToStep",
        name: "Install Dependencies",
        text: "Install standard GreenSock dependencies by running 'npm install gsap @gsap/react' in your project root.",
        url: `https://tweenlabs.xyz/code/${slug}#step-1`,
      },
      {
        "@type": "HowToStep",
        name: "Save Component File",
        text: `Create a new file src/components/tweenlabs/${slug}.tsx and paste the Standalone Component Code.`,
        url: `https://tweenlabs.xyz/code/${slug}#step-2`,
      },
      {
        "@type": "HowToStep",
        name: "Import and Render",
        text: "Import the component into any Page or Layout and render it.",
        url: `https://tweenlabs.xyz/code/${slug}#step-3`,
      },
    ],
    totalTime: "PT5M",
    tool: [
      {
        "@type": "HowToTool",
        name: "React 19 & Next.js 16",
      },
      {
        "@type": "HowToTool",
        name: "GSAP (GreenSock Animation Platform) 3.15",
      },
    ],
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `https://tweenlabs.xyz/code/${slug}/#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "TweenLabs Home",
        item: "https://tweenlabs.xyz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: anim.name,
        item: `https://tweenlabs.xyz/${slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${anim.name} Source Code`,
        item: `https://tweenlabs.xyz/code/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <CodePageClient
        slug={slug}
        name={anim.name}
        description={anim.description}
        pageCode={pageCode}
        standaloneCode={standaloneCode}
        coreGsapCode={coreGsapCode}
        setupGuide={setupGuide}
        customization={customization}
      />
    </>
  );
}
