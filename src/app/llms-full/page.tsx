import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LlmFullClient from "./LlmFullClient";

export const metadata: Metadata = {
  title: "Consolidated Code Registry Context | TweenLabs",
  description: "A complete, prompt-ready reference registry containing the full source code and integration markdown docs for all 18 GSAP UI components.",
};

export default function LlmFullPage() {
  const filePath = path.join(process.cwd(), "public", "llms-full.txt");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    content = "# Component: Not Found\nCould not load `public/llms-full.txt`. Ensure it is generated.";
  }

  // Parse components from raw text
  // The generator uses `\n# Component: Name (ID)\n` to delimit
  const sections = content.split(/\n# Component: /);
  const componentSections = sections.slice(1).map((sectionText) => {
    const lines = sectionText.split("\n");
    const headerLine = lines[0]; // "Name (ID)"
    const match = headerLine.match(/^(.*?) \((.*?)\)$/);
    const name = match ? match[1] : headerLine;
    const id = match ? match[2] : "";

    // Parse details
    const rest = lines.slice(1).join("\n");
    const slugMatch = rest.match(/URL: https:\/\/tweenlabs\.xyz\/(.*?)\n/);
    const slug = slugMatch ? slugMatch[1] : "";

    // Extract Page code vs How to use md
    const pageCodeSplit = rest.split(/## Full Sandbox Page Code\n```tsx\n/);
    let pageCode = "";
    let howToMd = "";

    if (pageCodeSplit[1]) {
      const pageCodeEnd = pageCodeSplit[1].split(/```\n\n## Documentation & Integration Instructions\n/);
      pageCode = pageCodeEnd[0] || "";
      if (pageCodeEnd[1]) {
        howToMd = pageCodeEnd[1].split(/\n\n---\n/)[0] || "";
      }
    }

    return {
      id,
      name,
      slug,
      pageCode: pageCode.trim(),
      howToMd: howToMd.trim(),
    };
  });

  return <LlmFullClient components={componentSections} />;
}
