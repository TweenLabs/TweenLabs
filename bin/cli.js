#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const https = require("node:https");
const readline = require("node:readline");

// Simple Terminal Colors
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

// Help text
const helpText = `
${colors.bold}${colors.cyan}TweenLabs CLI${colors.reset} - Install premium GSAP components directly into your codebase.

${colors.bold}Usage:${colors.reset}
  npx tweenlabs list                  List all available components
  npx tweenlabs add <component-slug>  Install a specific component

${colors.bold}Options:${colors.reset}
  -y, --yes          Skip all prompts (auto-accept defaults & install dependencies)
  -p, --path <path>  Specify a custom directory to install the component
  -o, --overwrite    Overwrite existing component files without prompting
  -h, --help         Show this help message
  -v, --version      Show version
`;

// Helper to make GET requests without external dependencies
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : require("node:http");
    client
      .get(
        url,
        {
          headers: { "User-Agent": "tweenlabs-cli" },
        },
        (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Server returned status code ${res.statusCode}`));
            return;
          }
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        },
      )
      .on("error", reject);
  });
}

// Helper for interactive user input
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

// Detect client's package manager
function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(process.cwd(), "bun.lockb"))) return "bun";
  return "npm";
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(helpText);
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    try {
      const pkg = require("../package.json");
      console.log(pkg.version);
    } catch (_err) {
      console.log("0.1.1");
    }
    process.exit(0);
  }

  // Parse flags
  const isYes = args.includes("-y") || args.includes("--yes");
  const isOverwrite = args.includes("-o") || args.includes("--overwrite");

  // Parse path option
  let customPath = null;
  const pathIdx = args.findIndex((arg) => arg === "-p" || arg === "--path");
  if (pathIdx !== -1 && pathIdx + 1 < args.length) {
    customPath = args[pathIdx + 1];
  }

  // Filter out options and their arguments from cleanArgs
  const cleanArgs = [];
  for (let i = 0; i < args.length; i++) {
    if (
      args[i] === "-y" ||
      args[i] === "--yes" ||
      args[i] === "-o" ||
      args[i] === "--overwrite"
    ) {
      continue;
    }
    if (args[i] === "-p" || args[i] === "--path") {
      i++; // skip next arg (the path value)
      continue;
    }
    cleanArgs.push(args[i]);
  }

  if (cleanArgs.length === 0) {
    console.log(helpText);
    process.exit(0);
  }

  if (cleanArgs[0] === "list") {
    console.log(
      `\n${colors.cyan}🔍 Fetching available components list...${colors.reset}`,
    );
    const domain =
      process.env.TWEENLABS_REGISTRY_URL || "https://tweenlabs.xyz";
    const url = `${domain}/api/registry/list`;
    try {
      const data = await fetchJson(url);
      console.log(
        `\n${colors.bold}${colors.green}Available TweenLabs Components:${colors.reset}\n`,
      );
      for (const comp of data.components) {
        console.log(
          `  ${colors.bold}${colors.cyan}* ${comp.name}${colors.reset}`,
        );
        console.log(`    Slug:       ${comp.slug} (or ${comp.cleanSlug})`);
        console.log(`    Desc:       ${comp.description}\n`);
      }
      process.exit(0);
    } catch (err) {
      console.error(
        `\n${colors.red}❌ Failed to fetch components list.${colors.reset}`,
      );
      console.error(`${colors.gray}Details: ${err.message}${colors.reset}`);
      process.exit(1);
    }
  }

  if (cleanArgs[0] !== "add") {
    console.log(
      `${colors.red}Error: Unknown command "${cleanArgs[0]}". Did you mean "add" or "list"?${colors.reset}`,
    );
    console.log(helpText);
    process.exit(1);
  }

  const componentSlug = cleanArgs[1];
  if (!componentSlug) {
    console.log(
      `${colors.red}Error: Please specify a component slug to add.${colors.reset}`,
    );
    console.log(
      colors.gray +
        "Example: npx tweenlabs add 11-magnetic-dock" +
        colors.reset,
    );
    process.exit(1);
  }

  console.log(
    `\n${colors.cyan}🔍 Fetching ${colors.bold}${componentSlug}${colors.reset}${colors.cyan} registry data...${colors.reset}`,
  );

  // Determine registry domain (allow local testing via env variable)
  const domain = process.env.TWEENLABS_REGISTRY_URL || "https://tweenlabs.xyz";
  const url = `${domain}/api/registry/${componentSlug}`;

  let componentData;
  try {
    componentData = await fetchJson(url);
  } catch (err) {
    console.error(
      `\n${colors.red}❌ Failed to fetch component. Make sure the slug is correct and the server is running.${colors.reset}`,
    );
    console.error(`${colors.gray}Details: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  console.log(
    `${colors.green}✓ Component found: ${colors.bold}${componentData.className}${colors.reset}`,
  );

  // Resolve target directory
  let targetDir = "";
  if (customPath) {
    targetDir = path.resolve(process.cwd(), customPath);
  } else {
    // 1. Try to read components.json (shadcn configuration)
    const componentsJsonPath = path.join(process.cwd(), "components.json");
    if (fs.existsSync(componentsJsonPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(componentsJsonPath, "utf-8"));
        const compAlias = config.aliases?.components;
        if (compAlias) {
          const cleanAlias = compAlias.replace(/^[@~]\//, "");
          if (
            fs.existsSync(path.join(process.cwd(), "src")) &&
            !cleanAlias.startsWith("src/")
          ) {
            targetDir = path.join(
              process.cwd(),
              "src",
              cleanAlias,
              "tweenlabs",
            );
          } else {
            targetDir = path.join(process.cwd(), cleanAlias, "tweenlabs");
          }
        }
      } catch (_err) {
        // Ignore JSON parse errors
      }
    }

    // 2. Fallback if targetDir is still not resolved
    if (!targetDir) {
      if (fs.existsSync(path.join(process.cwd(), "src"))) {
        targetDir = path.join(process.cwd(), "src", "components", "tweenlabs");
      } else {
        targetDir = path.join(process.cwd(), "components", "tweenlabs");
      }
    }
  }

  console.log(
    `📁 Target directory: ${colors.bold}${path.relative(process.cwd(), targetDir)}${colors.reset}`,
  );

  // Check if any files already exist
  let hasExistingFiles = false;
  for (const file of componentData.files) {
    const filePath = path.join(targetDir, file.name);
    if (fs.existsSync(filePath)) {
      hasExistingFiles = true;
      break;
    }
  }

  if (hasExistingFiles && !isOverwrite && !isYes) {
    const overwriteConfirm = await askQuestion(
      `⚠️ Component files already exist in ${colors.bold}${path.relative(process.cwd(), targetDir)}${colors.reset}. Overwrite? (y/n) ${colors.gray}[y]${colors.reset}: `,
    );
    if (
      overwriteConfirm &&
      overwriteConfirm.toLowerCase() !== "y" &&
      overwriteConfirm.toLowerCase() !== "yes"
    ) {
      console.log(`${colors.yellow}Installation cancelled.${colors.reset}`);
      process.exit(0);
    }
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Write component files
  console.log(`\n${colors.cyan}💾 Writing component files...${colors.reset}`);
  for (const file of componentData.files) {
    const filePath = path.join(targetDir, file.name);
    fs.writeFileSync(filePath, file.content, "utf-8");
    console.log(
      `${colors.green}  → Created: ${colors.bold}${path.relative(process.cwd(), filePath)}${colors.reset}`,
    );
  }

  // Check and install dependencies
  const dependencies = componentData.dependencies || [];
  if (dependencies.length > 0) {
    // Read package.json to see if dependencies are already installed
    let pkgJson = {};
    try {
      pkgJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"),
      );
    } catch (_err) {
      // Ignore
    }

    const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    const missingDeps = dependencies.filter((dep) => !allDeps[dep]);

    if (missingDeps.length > 0) {
      const pm = detectPackageManager();
      console.log(
        `\n${colors.cyan}📦 Installing missing dependencies: ${colors.bold}${missingDeps.join(", ")}${colors.reset} using ${pm}...`,
      );

      let installCmd = "";
      if (pm === "pnpm") installCmd = `pnpm add ${missingDeps.join(" ")}`;
      else if (pm === "yarn") installCmd = `yarn add ${missingDeps.join(" ")}`;
      else if (pm === "bun") installCmd = `bun add ${missingDeps.join(" ")}`;
      else installCmd = `npm install ${missingDeps.join(" ")}`;

      try {
        execSync(installCmd, { stdio: "inherit" });
        console.log(
          `${colors.green}✓ Dependencies installed successfully!${colors.reset}`,
        );
      } catch (_err) {
        console.error(
          `${colors.red}❌ Failed to install dependencies. Please run "${installCmd}" manually.${colors.reset}`,
        );
      }
    } else {
      console.log(
        `\n${colors.green}✓ All dependencies (${dependencies.join(", ")}) already installed.${colors.reset}`,
      );
    }
  }

  console.log(
    `\n${colors.green}${colors.bold}🎉 Installation complete!${colors.reset}`,
  );
  console.log(
    `You can now import and use the ${colors.bold}${componentData.className}${colors.reset} component in your project.\n`,
  );
}

main().catch((err) => {
  console.error("CLI unexpected error:", err);
  process.exit(1);
});
