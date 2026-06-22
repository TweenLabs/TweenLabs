import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { animations } from "@/data/components";
import { isAuthenticated } from "@/lib/auth-server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Simple protection against direct browser/crawler access.
  // CLI always sends User-Agent: "tweenlabs-cli".
  // If not CLI, require standard user session.
  const userAgent = request.headers.get("user-agent") || "";
  const isCli = userAgent.includes("tweenlabs-cli");
  const authenticated = await isAuthenticated();

  if (!authenticated && !isCli) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Please sign in to view this component's registry code.",
      },
      { status: 401 },
    );
  }

  // Handle list of components request
  if (slug === "list" || slug === "index") {
    const list = animations.map((anim) => ({
      name: anim.name,
      componentName: anim.componentName,
      slug: anim.componentName,
      description: anim.description,
    }));
    return NextResponse.json({ components: list });
  }

  // Handle bulk components request
  if (slug === "all" || slug === "all-components") {
    const files = [];
    const animationsDir = path.join(process.cwd(), "src", "app", "(main)", "components");
    for (const anim of animations) {
      const pagePath = path.join(animationsDir, anim.componentName, "page.tsx");
      try {
        const pageCode = fs.readFileSync(pagePath, "utf-8");
        files.push({
          name: `${anim.componentName}.tsx`,
          content: pageCode,
        });
      } catch (err) {
        console.error(`Skipping ${anim.componentName} due to error:`, err);
      }
    }

    return NextResponse.json({
      name: "all",
      className: "AllComponents",
      dependencies: ["gsap", "@gsap/react"],
      files,
    });
  }

  // Find the animation by componentName (e.g. "FlipCards" or "MagneticDock")
  const anim = animations.find((a) => a.componentName === slug);

  if (!anim) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const animationsDir = path.join(process.cwd(), "src", "app", "(main)", "components");
  const pagePath = path.join(animationsDir, anim.componentName, "page.tsx");

  let pageCode = "";
  try {
    pageCode = fs.readFileSync(pagePath, "utf-8");
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Component page code not found" },
      { status: 500 },
    );
  }

  const dependencies = ["gsap", "@gsap/react"];

  return NextResponse.json({
    name: anim.componentName,
    className: anim.componentName,
    dependencies,
    files: [
      {
        name: `${anim.componentName}.tsx`,
        content: pageCode,
      },
    ],
  });
}
