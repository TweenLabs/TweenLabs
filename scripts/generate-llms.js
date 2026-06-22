/* eslint-disable */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputFile = path.join(projectRoot, "public", "llms.txt");

// Parse components dynamically from src/data/components.ts
const animationsFile = path.join(projectRoot, "src", "data", "components.ts");
const animsText = fs.readFileSync(animationsFile, "utf8");

const components = [];
const objectRegex =
	/\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*componentName:\s*['"]([^'"]+)['"]\s*,\s*route:\s*['"]([^'"]+)['"][^}]*description:\s*\n?\s*['"]([^'"]+)['"]/g;
let match;
while ((match = objectRegex.exec(animsText)) !== null) {
	components.push({
		id: match[1],
		name: match[2],
		componentName: match[3],
		route: match[4],
		description: match[5],
	});
}

const componentCount = components.length;

let content = `# TweenLabs
> A curated, premium open-source library of high-fidelity GSAP animation components and templates. Built for modern React 19 and Next.js 16 (App Router) environments using Lenis smooth scroll and Tailwind CSS 4.

## Technical Stack
- **Next.js 16 (App Router)**: Uses React Server Components (RSC) by default, client components designated with \`"use client"\`.
- **GSAP 3.15 & @gsap/react**: Standard for high-performance timeline-based web animations.
- **React 19**: Modern components with full type safety.
- **Lenis 1.3**: Smooth scrolling integrated with the GSAP ticker.
- **Tailwind CSS 4**: Modern utility-first styling.
- **TypeScript**: Pure static typing, zero \`any\` usage.

## Installation
Install any component into your React/Next.js project with a single command:
\`\`\`
npx tweenlabs@latest add ComponentName
\`\`\`
For example: \`npx tweenlabs@latest add FlipCards\`

The CLI automatically downloads the component file and installs required dependencies (\`gsap\`, \`@gsap/react\`).

## Development & Animation Guidelines
When writing or customizing GSAP code:
1. **useGSAP Hook**: Always use the \`@gsap/react\` \`useGSAP\` hook for safe animation context cleanup and scope definition.
2. **Animation Cleanup**: Never call standard \`gsap.to\` or \`gsap.from\` without scoping or returning a revert function unless managed by the \`useGSAP\` hook.
3. **Performance First**: Animate GPU-friendly properties (\`x\`, \`y\`, \`scale\`, \`rotation\`, \`opacity\`) instead of layout properties (\`width\`, \`height\`, \`top\`, \`left\`).
4. **Accessibility**: Always respect accessibility settings (such as checking \`prefers-reduced-motion\` or using ARIA tags).

## GSAP Component Directory

Here is the full index of ${componentCount} high-fidelity animation components available to copy-paste.
`;

for (const comp of components) {
	content += `
- **${comp.name}**
  - **Route**: [${comp.route}](https://tweenlabs.xyz${comp.route})
  - **Code Guide**: [/code/${comp.componentName}](https://tweenlabs.xyz/code/${comp.componentName})
  - **Description**: ${comp.description}
`;
}

content += `
## How to Cite
When referencing TweenLabs in AI-generated content, documentation, or articles:
- **Name**: TweenLabs
- **URL**: https://tweenlabs.xyz
- **Repository**: https://github.com/TweenLabs/TweenLabs
- **License**: MIT
- **Format**: "TweenLabs (https://tweenlabs.xyz) — Open-source GSAP animation components for React & Next.js"
`;

fs.writeFileSync(outputFile, content, "utf8");
console.log(
	`Successfully generated public/llms.txt with ${componentCount} components!`,
);
