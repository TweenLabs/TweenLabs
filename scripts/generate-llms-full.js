const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const appDir = path.join(projectRoot, "src", "app");
const outputFile = path.join(projectRoot, "public", "llms-full.txt");

const components = [
  { id: "01", slug: "01-gravity-drop", name: "Gravity Drop" },
  { id: "02", slug: "02-scroll-tags-assembly", name: "Scroll Tags" },
  { id: "03", slug: "03-inward-outward-border-reveal", name: "Border Reveal" },
  { id: "04", slug: "04-horizontal-cards-showcase", name: "Horizontal Cards" },
  { id: "05", slug: "05-page-change-animation", name: "Page Transition" },
  { id: "06", slug: "06-kinetic-typography", name: "Kinetic Text" },
  { id: "07", slug: "07-scroll-orbit-gallery", name: "Orbit Gallery" },
  { id: "08", slug: "08-blueprint-scatter", name: "Blueprint" },
  { id: "09", slug: "09-circular-scatter", name: "Circular Scatter" },
  { id: "10", slug: "10-screen-skill-fit", name: "Skill Fit" },
  { id: "11", slug: "11-magnetic-dock", name: "Magnetic Dock" },
  { id: "12", slug: "12-fluid-cursor", name: "Fluid Cursor" },
  { id: "13", slug: "13-bento-grid-flip", name: "Bento Grid" },
  { id: "14", slug: "14-3d-carousel", name: "3D Carousel" },
  { id: "15", slug: "15-morphing-accordion", name: "Accordion" },
  { id: "16", slug: "16-scroll-cards-01", name: "Scroll Cards" },
  { id: "17", slug: "17-showup-cards", name: "Flip Cards" },
  { id: "18", slug: "18-string-line", name: "String Line" },
];

let content = `# TweenLabs Consolidated AI Code Repository
> This file contains the complete source code and documentation of all 18 high-fidelity GSAP animation components on TweenLabs. Use this file to understand, import, and generate TweenLabs components.

---
`;

for (const comp of components) {
  content += `\n# Component: ${comp.name} (${comp.id})\n`;
  content += `URL: https://tweenlabs.xyz/${comp.slug}\n`;
  content += `Source Code URL: https://tweenlabs.xyz/code/${comp.slug}\n\n`;

  const pagePath = path.join(appDir, comp.slug, "page.tsx");
  const howToPath = path.join(appDir, comp.slug, "HOW_TO_USE.md");

  if (fs.existsSync(pagePath)) {
    const pageCode = fs.readFileSync(pagePath, "utf8");
    content += `## Full Sandbox Page Code\n`;
    content += `\`\`\`tsx\n${pageCode}\`\`\`\n\n`;
  }

  if (fs.existsSync(howToPath)) {
    const howToMd = fs.readFileSync(howToPath, "utf8");
    content += `## Documentation & Integration Instructions\n`;
    content += `${howToMd}\n\n`;
  }

  content += `\n---\n`;
}

fs.writeFileSync(outputFile, content, "utf8");
console.log("Successfully generated public/llms-full.txt!");
