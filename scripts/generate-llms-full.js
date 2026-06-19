/* eslint-disable */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const appDir = path.join(projectRoot, "src", "app");
const outputFile = path.join(projectRoot, "public", "llms-full.txt");

// Parse components dynamically from src/data/animations.ts to avoid duplicate lists
const animationsFile = path.join(projectRoot, "src", "data", "animations.ts");
const animsText = fs.readFileSync(animationsFile, "utf8");

const components = [];
const objectRegex = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*route:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = objectRegex.exec(animsText)) !== null) {
  const id = match[1];
  const name = match[2];
  const route = match[3];
  const slug = route.substring(1); // Remove leading slash
  components.push({ id, slug, name });
}

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
