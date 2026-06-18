#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const https = require("https");
const readline = require("readline");

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
  npx tweenlabs add <component-slug>
  npx tweenlabs add all

${colors.bold}Examples:${colors.reset}
  npx tweenlabs add 11-magnetic-dock
  npx tweenlabs add magnetic-dock
  npx tweenlabs add all

${colors.bold}Options:${colors.reset}
  --help, -h     Show this help message
  --version, -v  Show version
`;

// Helper to make GET requests without external dependencies
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : require("http");
    client.get(url, {
      headers: { "User-Agent": "tweenlabs-cli" }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Server returned status code ${res.statusCode}`));
        return;
      }
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
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
    })
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

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(helpText);
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log("1.0.0");
    process.exit(0);
  }

  if (args[0] !== "add") {
    console.log(`${colors.red}Error: Unknown command "${args[0]}". Did you mean "add"?${colors.reset}`);
    console.log(helpText);
    process.exit(1);
  }

  const componentSlug = args[1];
  if (!componentSlug) {
    console.log(`${colors.red}Error: Please specify a component slug to add.${colors.reset}`);
    console.log(colors.gray + "Example: npx tweenlabs add 11-magnetic-dock" + colors.reset);
    process.exit(1);
  }

  console.log(`\n${colors.cyan}🔍 Fetching ${colors.bold}${componentSlug}${colors.reset}${colors.cyan} registry data...${colors.reset}`);

  // Determine registry domain (allow local testing via env variable)
  const domain = process.env.TWEENLABS_REGISTRY_URL || "https://tweenlabs.xyz";
  const url = `${domain}/api/registry/${componentSlug}`;

  let componentData;
  try {
    componentData = await fetchJson(url);
  } catch (err) {
    console.error(`\n${colors.red}❌ Failed to fetch component. Make sure the slug is correct and the server is running.${colors.reset}`);
    console.error(colors.gray + `Details: ${err.message}` + colors.reset);
    process.exit(1);
  }

  console.log(`${colors.green}✓ Component found: ${colors.bold}${componentData.className}${colors.reset}`);

  // Resolve target directory
  let targetDir = path.join(process.cwd(), "src", "components");
  if (!fs.existsSync(path.join(process.cwd(), "src"))) {
    targetDir = path.join(process.cwd(), "components");
  }

  const userPathAnswer = await askQuestion(
    `📁 Where should the component be installed? ${colors.gray}(default: ${targetDir})${colors.reset}: `
  );
  if (userPathAnswer) {
    targetDir = path.resolve(process.cwd(), userPathAnswer);
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
    console.log(`${colors.green}  → Created: ${colors.bold}${path.relative(process.cwd(), filePath)}${colors.reset}`);
  }

  // Check and install dependencies
  const dependencies = componentData.dependencies || [];
  if (dependencies.length > 0) {
    // Read package.json to see if dependencies are already installed
    let pkgJson = {};
    try {
      pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
    } catch (err) {
      // Ignore
    }

    const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    const missingDeps = dependencies.filter((dep) => !allDeps[dep]);

    if (missingDeps.length > 0) {
      const pm = detectPackageManager();
      console.log(`\n${colors.yellow}📦 Missing dependencies: ${colors.bold}${missingDeps.join(", ")}${colors.reset}`);
      
      const installConfirm = await askQuestion(
        `Do you want to install them using ${colors.bold}${pm}${colors.reset}? (y/n) ${colors.gray}[y]${colors.reset}: `
      );

      if (!installConfirm || installConfirm.toLowerCase() === "y" || installConfirm.toLowerCase() === "yes") {
        console.log(`${colors.cyan}Installing dependencies using ${pm}...${colors.reset}`);
        let installCmd = "";
        if (pm === "pnpm") installCmd = `pnpm add ${missingDeps.join(" ")}`;
        else if (pm === "yarn") installCmd = `yarn add ${missingDeps.join(" ")}`;
        else if (pm === "bun") installCmd = `bun add ${missingDeps.join(" ")}`;
        else installCmd = `npm install ${missingDeps.join(" ")}`;

        try {
          execSync(installCmd, { stdio: "inherit" });
          console.log(`${colors.green}✓ Dependencies installed successfully!${colors.reset}`);
        } catch (err) {
          console.error(`${colors.red}❌ Failed to install dependencies. Please run "${installCmd}" manually.${colors.reset}`);
        }
      } else {
        console.log(`${colors.yellow}⚠️ Skipping installation. Please make sure to install ${missingDeps.join(", ")} manually.${colors.reset}`);
      }
    } else {
      console.log(`\n${colors.green}✓ All dependencies (${dependencies.join(", ")}) already installed.${colors.reset}`);
    }
  }

  console.log(`\n${colors.green}${colors.bold}🎉 Installation complete!${colors.reset}`);
  console.log(`You can now import and use the ${colors.bold}${componentData.className}${colors.reset} component in your project.\n`);
}

main().catch((err) => {
  console.error("CLI unexpected error:", err);
  process.exit(1);
});
