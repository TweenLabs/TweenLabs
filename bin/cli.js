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
  npx tweenlabs init                  Initialize configuration file
  npx tweenlabs list                  List all available components
  npx tweenlabs add <component-slug>  Install a specific component

${colors.bold}Options:${colors.reset}
  -y, --yes          Skip all prompts (auto-accept defaults & install dependencies)
  -p, --path <path>  Specify a custom directory to install the component
  -o, --overwrite    Overwrite existing component files/configuration without prompting
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

// Levenshtein distance helper for spelling suggestions
function getLevenshteinDistance(a, b) {
  const tmp = [];
  let i;
  let j;
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      tmp[i][j] = a.charAt(i - 1) === b.charAt(j - 1)
        ? tmp[i - 1][j - 1]
        : Math.min(tmp[i - 1][j - 1] + 1, Math.min(tmp[i][j - 1] + 1, tmp[i - 1][j] + 1));
    }
  }
  return tmp[alen][blen];
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

  let version = "0.1.6";
  try {
    const pkg = require("../package.json");
    version = pkg.version;
  } catch (_e) {}

  if (args.includes("--version") || args.includes("-v")) {
    console.log(version);
    process.exit(0);
  }

  // Print CLI Header Banner
  console.log(
    `\n${colors.bold}${colors.cyan}▲  tweenlabs${colors.reset}  ${colors.gray}v${version}${colors.reset}\n`,
  );

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

  if (cleanArgs[0] === "init") {
    const configPath = path.join(process.cwd(), "tweenlabs.config.json");
    if (fs.existsSync(configPath) && !isOverwrite && !isYes) {
      console.log(
        `${colors.yellow}! tweenlabs.config.json already exists.${colors.reset}`
      );
      const overwriteConfirm = await askQuestion(
        `Overwrite configuration file? (y/n) ${colors.gray}[y]${colors.reset}: `
      );
      if (
        overwriteConfirm &&
        overwriteConfirm.toLowerCase() !== "y" &&
        overwriteConfirm.toLowerCase() !== "yes"
      ) {
        console.log(`${colors.yellow}! Configuration initialization cancelled.${colors.reset}`);
        process.exit(0);
      }
    }

    let defaultDir = "";
    if (fs.existsSync(path.join(process.cwd(), "src"))) {
      defaultDir = "./src/components/tweenlabs";
    } else {
      defaultDir = "./components/tweenlabs";
    }

    let targetPath = defaultDir;
    if (!isYes) {
      const inputPath = await askQuestion(
        `Configure component installation path (${defaultDir}): `
      );
      if (inputPath) {
        targetPath = inputPath;
      }
    }

    try {
      const configData = {
        path: targetPath,
      };
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf-8");
      console.log(
        `\n${colors.green}✔ Created tweenlabs.config.json with path: ${colors.bold}${targetPath}${colors.reset}\n`
      );
      process.exit(0);
    } catch (err) {
      console.error(
        `${colors.red}Error: Failed to create tweenlabs.config.json.${colors.reset}`
      );
      console.error(`${colors.gray}Details: ${err.message}${colors.reset}`);
      process.exit(1);
    }
  }

  if (cleanArgs[0] === "list") {
    console.log(`${colors.cyan}Fetching registry...${colors.reset}`);
    const domain =
      process.env.TWEENLABS_REGISTRY_URL || "https://tweenlabs.xyz";
    const url = `${domain}/api/registry/list`;
    try {
      const data = await fetchJson(url);
      console.log(
        `\n${colors.bold}${colors.green}Available Components:${colors.reset}\n`,
      );
      const rows = data.components.map((comp) => ({
        slug: comp.cleanSlug || comp.slug,
        desc: comp.description || "",
      }));
      const maxSlugLen = Math.max(...rows.map((r) => r.slug.length), 10);
      for (const row of rows) {
        const paddedSlug = row.slug.padEnd(maxSlugLen + 4, " ");
        console.log(
          `  ${colors.cyan}${paddedSlug}${colors.reset}${colors.gray}${row.desc}${colors.reset}`,
        );
      }
      console.log("");
      process.exit(0);
    } catch (err) {
      console.error(
        `${colors.red}Error: Failed to fetch components list.${colors.reset}`,
      );
      console.error(`${colors.gray}Details: ${err.message}${colors.reset}`);
      process.exit(1);
    }
  }

  if (cleanArgs[0] !== "add") {
    console.log(
      `${colors.red}Error: Unknown command "${cleanArgs[0]}". Did you mean "add", "list" or "init"?${colors.reset}`,
    );
    console.log(helpText);
    process.exit(1);
  }

  let componentSlug = cleanArgs[1];
  if (!componentSlug) {
    console.log(`${colors.cyan}Fetching registry...${colors.reset}`);
    const domain =
      process.env.TWEENLABS_REGISTRY_URL || "https://tweenlabs.xyz";
    const listUrl = `${domain}/api/registry/list`;
    let listData;
    try {
      listData = await fetchJson(listUrl);
    } catch (err) {
      console.error(
        `${colors.red}Error: Failed to fetch components list.${colors.reset}`,
      );
      console.error(`${colors.gray}Details: ${err.message}${colors.reset}`);
      process.exit(1);
    }

    console.log(
      `${colors.bold}${colors.green}Select a component to install:${colors.reset}\n`,
    );
    const components = listData.components;
    const maxIndexLen = String(components.length + 1).length;
    const maxSlugLen = Math.max(
      ...components.map((c) => (c.cleanSlug || c.slug).length),
      10,
    );

    // Print "All Components" option first
    const allIndexStr = "[1]".padStart(maxIndexLen + 2, " ");
    const allSlugStr = ".".padEnd(maxSlugLen + 4, " ");
    console.log(
      `  ${colors.bold}${colors.cyan}${allIndexStr}${colors.reset}  ${colors.cyan}${allSlugStr}${colors.reset}${colors.gray}All Components${colors.reset}`,
    );

    for (let i = 0; i < components.length; i++) {
      const indexStr = `[${i + 2}]`.padStart(maxIndexLen + 2, " ");
      const slugStr = (components[i].cleanSlug || components[i].slug).padEnd(
        maxSlugLen + 4,
        " ",
      );
      console.log(
        `  ${colors.bold}${colors.cyan}${indexStr}${colors.reset}  ${colors.cyan}${slugStr}${colors.reset}${colors.gray}${components[i].name}${colors.reset}`,
      );
    }
    console.log("");

    const choiceStr = await askQuestion(
      `? Enter the number of the component to add (1-${components.length + 1}): `,
    );
    const choice = parseInt(choiceStr, 10);
    if (Number.isNaN(choice) || choice < 1 || choice > components.length + 1) {
      console.log(`${colors.red}Error: Invalid choice. Exiting.${colors.reset}`);
      process.exit(1);
    }

    if (choice === 1) {
      componentSlug = ".";
    } else {
      componentSlug =
        components[choice - 2].cleanSlug || components[choice - 2].slug;
    }
  }

  // Resolve target directory
  let targetDir = "";
  if (customPath) {
    targetDir = path.resolve(process.cwd(), customPath);
  } else {
    // 1. Try to read tweenlabs.config.json (our config)
    const tweenlabsConfigPath = path.join(process.cwd(), "tweenlabs.config.json");
    if (fs.existsSync(tweenlabsConfigPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(tweenlabsConfigPath, "utf-8"));
        if (config.path) {
          targetDir = path.resolve(process.cwd(), config.path);
        }
      } catch (_err) {
        // Ignore JSON parse errors
      }
    }

    // 2. Try to read components.json (shadcn configuration) if still not resolved
    if (!targetDir) {
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
    }

    // 3. Fallback if targetDir is still not resolved
    if (!targetDir) {
      if (fs.existsSync(path.join(process.cwd(), "src"))) {
        targetDir = path.join(process.cwd(), "src", "components", "tweenlabs");
      } else {
        targetDir = path.join(process.cwd(), "components", "tweenlabs");
      }
    }
  }

  console.log(
    `Target directory: ${colors.bold}${path.relative(process.cwd(), targetDir)}${colors.reset}`,
  );

  const domain = process.env.TWEENLABS_REGISTRY_URL || "https://tweenlabs.xyz";
  let slugsToInstall = [];
  if (componentSlug === "." || componentSlug === "all") {
    console.log(
      `${colors.cyan}Fetching all components list...${colors.reset}`,
    );
    const listUrl = `${domain}/api/registry/list`;
    try {
      const listData = await fetchJson(listUrl);
      slugsToInstall = listData.components.map((c) => c.cleanSlug || c.slug);
    } catch (err) {
      console.error(
        `${colors.red}Error: Failed to fetch components list.${colors.reset}`,
      );
      console.error(`${colors.gray}Details: ${err.message}${colors.reset}`);
      process.exit(1);
    }
  } else {
    slugsToInstall = [componentSlug];
  }

  // Gather files and check conflicts
  const filesToWrite = [];
  const conflicts = [];
  const allRequiredDeps = new Set();

  for (const slug of slugsToInstall) {
    console.log(
      `${colors.cyan}Fetching ${colors.bold}${slug}${colors.reset}${colors.cyan} registry data...${colors.reset}`,
    );
    const url = `${domain}/api/registry/${slug}`;
    try {
      const componentData = await fetchJson(url);
      for (const file of componentData.files) {
        const filePath = path.join(targetDir, file.name);
        if (fs.existsSync(filePath)) {
          conflicts.push(path.relative(process.cwd(), filePath));
        }
        filesToWrite.push({ path: filePath, content: file.content });
      }
      const dependencies = componentData.dependencies || [];
      for (const dep of dependencies) {
        allRequiredDeps.add(dep);
      }
    } catch (_err) {
      console.error(
        `${colors.red}Error: Failed to fetch component "${slug}". Skipping.${colors.reset}`,
      );
      // Fetch registry list to suggest closest matches
      let suggestions = [];
      try {
        const listData = await fetchJson(`${domain}/api/registry/list`);
        const validSlugs = listData.components.map((c) => c.cleanSlug || c.slug);
        
        // Find slugs with low Levenshtein distance
        const matches = validSlugs.map((validSlug) => {
          return {
            slug: validSlug,
            distance: getLevenshteinDistance(slug, validSlug)
          };
        });
        
        // Sort by distance ascending
        matches.sort((a, b) => a.distance - b.distance);
        
        // Threshold: distance <= 3 or distance <= half of query length
        suggestions = matches
          .filter((m) => m.distance <= 3 || m.distance <= Math.round(slug.length / 2))
          .map((m) => m.slug);
      } catch (_e) {
        // If list fetch fails, we just don't show suggestions
      }

      if (suggestions.length > 0) {
        console.error(
          `${colors.yellow}Did you mean: ${suggestions.map(s => `${colors.bold}${s}${colors.reset}`).join(", ")}?${colors.reset}\n`
        );
      }
    }
  }

  if (filesToWrite.length === 0) {
    console.log(`${colors.red}Error: No files to install. Exiting.${colors.reset}`);
    process.exit(1);
  }

  if (conflicts.length > 0 && !isOverwrite && !isYes) {
    console.log(
      `\n${colors.yellow}! The following files already exist:${colors.reset}`,
    );
    for (const conflict of conflicts) {
      console.log(`  → ${conflict}`);
    }
    const overwriteConfirm = await askQuestion(
      `\nOverwrite these files? (y/n) ${colors.gray}[y]${colors.reset}: `,
    );
    if (
      overwriteConfirm &&
      overwriteConfirm.toLowerCase() !== "y" &&
      overwriteConfirm.toLowerCase() !== "yes"
    ) {
      console.log(`${colors.yellow}! Installation cancelled.${colors.reset}`);
      process.exit(0);
    }
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Write component files
  console.log(`\n${colors.bold}Writing component files...${colors.reset}`);
  for (const file of filesToWrite) {
    fs.writeFileSync(file.path, file.content, "utf-8");
    console.log(
      `  ${colors.green}✔${colors.reset} Created ${colors.bold}${path.relative(process.cwd(), file.path)}${colors.reset}`,
    );
  }

  // Check and install dependencies
  const dependencies = Array.from(allRequiredDeps);
  if (dependencies.length > 0) {
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
        `\n${colors.bold}Installing missing dependencies using ${pm}...${colors.reset}`,
      );
      for (const dep of missingDeps) {
        console.log(`  → ${dep}`);
      }
      console.log("");

      let installCmd = "";
      if (pm === "pnpm") installCmd = `pnpm add ${missingDeps.join(" ")}`;
      else if (pm === "yarn") installCmd = `yarn add ${missingDeps.join(" ")}`;
      else if (pm === "bun") installCmd = `bun add ${missingDeps.join(" ")}`;
      else installCmd = `npm install ${missingDeps.join(" ")}`;

      try {
        execSync(installCmd, { stdio: "inherit" });
        console.log(
          `\n${colors.green}✔ Dependencies installed successfully!${colors.reset}`,
        );
      } catch (_err) {
        console.error(
          `\n${colors.red}Error: Failed to install dependencies. Please run "${installCmd}" manually.${colors.reset}`,
        );
      }
    } else {
      console.log(
        `\n${colors.green}✔ All dependencies (${dependencies.join(", ")}) already installed.${colors.reset}`,
      );
    }
  }

  console.log(
    `\n${colors.bold}${colors.green}✔ Done! All requested components installed successfully.${colors.reset}`,
  );
  console.log(`You can now import and use them in your project.\n`);
}

main().catch((err) => {
  console.error("CLI unexpected error:", err);
  process.exit(1);
});
