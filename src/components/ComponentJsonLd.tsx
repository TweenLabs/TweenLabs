import { animations } from "@/data/components";
import { siteConfig } from "@/lib/site-config";

/**
 * Injects SoftwareSourceCode JSON-LD for a specific animation component.
 * Use inside each animation layout.tsx for GEO (Generative Engine Optimization).
 */
export default function ComponentJsonLd({
  componentName,
}: {
  componentName: string;
}) {
  const anim = animations.find((a) => a.componentName === componentName);
  if (!anim) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: anim.name,
    description: anim.description,
    codeRepository: "https://github.com/TweenLabs/TweenLabs",
    codeSampleType: "full solution",
    programmingLanguage: ["TypeScript", "React JSX"],
    runtimePlatform: "Next.js 16 (App Router)",
    targetProduct: {
      "@type": "SoftwareApplication",
      name: "TweenLabs",
      operatingSystem: "Cross-platform (Node.js)",
    },
    license: "https://opensource.org/licenses/MIT",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: siteConfig.fullUrl(anim.route),
    mainEntityOfPage: siteConfig.fullUrl(`/code/${anim.componentName}`),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
