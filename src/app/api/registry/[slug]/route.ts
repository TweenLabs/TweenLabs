import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { animations } from "@/data/animations";

// Helper to convert slug to clean PascalCase component name
const getClassName = (slug: string) => {
  const clean = slug.replace(/^\d+[a-z]?[-_]/, "");
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
