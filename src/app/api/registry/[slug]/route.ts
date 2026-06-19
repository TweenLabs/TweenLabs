import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { animations } from "@/data/animations";

const componentNamesMap: Record<string, string> = {
  "01-gravity-drop": "GravityDrop",
  "gravity-drop": "GravityDrop",
  "02-scroll-tags-assembly": "ScrollTags",
  "scroll-tags-assembly": "ScrollTags",
  "03-inward-outward-border-reveal": "BorderReveal",
  "inward-outward-border-reveal": "BorderReveal",
  "04-horizontal-cards-showcase": "HorizontalCards",
  "horizontal-cards-showcase": "HorizontalCards",
  "05-page-change-animation": "PageTransition",
  "page-change-animation": "PageTransition",
  "06-kinetic-typography": "KineticText",
  "kinetic-typography": "KineticText",
  "07-scroll-orbit-gallery": "OrbitGallery",
  "scroll-orbit-gallery": "OrbitGallery",
  "08-blueprint-scatter": "Blueprint",
  "blueprint-scatter": "Blueprint",
  "09-circular-scatter": "CircularScatter",
  "circular-scatter": "CircularScatter",
  "10-screen-skill-fit": "SkillFit",
  "screen-skill-fit": "SkillFit",
  "11-magnetic-dock": "MagneticDock",
  "magnetic-dock": "MagneticDock",
  "12-fluid-cursor": "FluidCursor",
  "fluid-cursor": "FluidCursor",
  "13-bento-grid-flip": "BentoGrid",
  "bento-grid-flip": "BentoGrid",
  "14-3d-carousel": "Carousel3D",
  "3d-carousel": "Carousel3D",
  "15-morphing-accordion": "Accordion",
  "morphing-accordion": "Accordion",
  "16-scroll-cards-01": "ScrollCards",
  "scroll-cards-01": "ScrollCards",
  "17-showup-cards": "FlipCards",
  "showup-cards": "FlipCards",
  "18-string-line": "StringLine",
  "string-line": "StringLine"
};

// Helper to convert slug to clean PascalCase component name
const getClassName = (slug: string) => {
  const cleanSlug = slug.toLowerCase().trim();
  if (componentNamesMap[cleanSlug]) {
    return componentNamesMap[cleanSlug];
  }
  const clean = cleanSlug.replace(/^\d+[a-z]?[-_]/, "");
  return clean
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Handle list of components request
  if (slug === "list" || slug === "index") {
    const list = animations.map((anim) => {
      const folderName = anim.route.slice(1);
      return {
        name: anim.name,
        slug: folderName,
        cleanSlug: folderName.replace(/^\d+[a-z]?[-_]/, ""),
        description: anim.description,
      };
    });
    return NextResponse.json({ components: list });
  }

  // Handle bulk components request
  if (slug === "all" || slug === "all-components") {
    const files = [];
    const appDir = path.join(process.cwd(), "src", "app");
    for (const anim of animations) {
      const folderName = anim.route.slice(1);
      const pagePath = path.join(appDir, folderName, "page.tsx");
      try {
        const pageCode = fs.readFileSync(pagePath, "utf-8");
        const componentName = getClassName(folderName);
        files.push({
          name: `${componentName}.tsx`,
          content: pageCode,
        });
      } catch (err) {
        console.error(`Skipping ${folderName} due to error:`, err);
      }
    }

    return NextResponse.json({
      name: "all",
      className: "AllComponents",
      dependencies: ["gsap", "@gsap/react"],
      files,
    });
  }

  // Find the animation (supporting both exact folder slug "11-magnetic-dock" and clean slug "magnetic-dock")
  const anim = animations.find((a) => {
    const routeName = a.route.slice(1);
    const cleanRouteName = routeName.replace(/^\d+[a-z]?[-_]/, "");
    return routeName === slug || cleanRouteName === slug;
  });

  if (!anim) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const folderName = anim.route.slice(1);
  const appDir = path.join(process.cwd(), "src", "app");
  const pagePath = path.join(appDir, folderName, "page.tsx");

  let pageCode = "";
  try {
    pageCode = fs.readFileSync(pagePath, "utf-8");
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Component page code not found" },
      { status: 500 }
    );
  }

  const componentName = getClassName(folderName);
  const dependencies = ["gsap", "@gsap/react"];

  return NextResponse.json({
    name: folderName,
    className: componentName,
    dependencies,
    files: [
      {
        name: `${componentName}.tsx`,
        content: pageCode,
      },
    ],
  });
}
