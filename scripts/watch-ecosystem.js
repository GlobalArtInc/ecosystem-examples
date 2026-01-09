#!/usr/bin/env node

const chokidar = require("chokidar");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ecosystemPath = path.resolve(__dirname, "../../ecosystem/packages");
const packagesToWatch = [
  "nestjs-grpc",
  "nestjs-etcd",
  "nestjs-fastify",
  "nestjs-logger",
  "nestjs-redis",
  "nestjs-temporal",
  "nestjs-swagger",
  "nestjs-typeorm-pagination",
  "passport",
  "zod-to-proto",
  "ddd",
];

const activeBuilds = new Map();
const watchers = new Map();
const debounceTimers = new Map();

function buildPackage(packageName) {
  if (activeBuilds.has(packageName)) {
    return;
  }

  const packagePath = path.join(ecosystemPath, packageName);
  const packageJsonPath = path.join(packagePath, "package.json");

  try {
    const packageJson = require(packageJsonPath);
    const buildScript =
      packageJson.scripts?.build || packageJson.scripts?.["build:watch"];

    if (!buildScript) {
      console.log(`⚠️  Package ${packageName} does not have a build script`);
      return;
    }

    console.log(`🔨 Rebuilding package ${packageName}...`);

    const buildProcess = spawn("pnpm", ["run", "build"], {
      cwd: packagePath,
      stdio: "inherit",
      shell: true,
    });

    activeBuilds.set(packageName, buildProcess);

    buildProcess.on("close", (code) => {
      activeBuilds.delete(packageName);
      if (code === 0) {
        console.log(`✅ Package ${packageName} rebuilt successfully`);
      } else {
        console.log(`❌ Error rebuilding package ${packageName}`);
      }
    });

    buildProcess.on("error", (error) => {
      activeBuilds.delete(packageName);
      console.error(
        `❌ Error running build for ${packageName}:`,
        error.message
      );
    });
  } catch (error) {
    console.error(
      `❌ Error reading package.json for ${packageName}:`,
      error.message
    );
  }
}

function watchPackage(packageName) {
  const packagePath = path.join(ecosystemPath, packageName);
  const srcPath = path.join(packagePath, "src");

  if (!fs.existsSync(packagePath)) {
    console.log(`⚠️  Package ${packageName} not found at path ${packagePath}`);
    return;
  }

  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  src folder not found for package ${packageName}`);
    return;
  }

  console.log(`👀 Watching changes in ${packageName}...`);

  const watcher = chokidar.watch(srcPath, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", (filePath) => {
    if (filePath.includes("node_modules") || filePath.includes(".git")) {
      return;
    }

    const debounceKey = packageName;

    if (debounceTimers.has(debounceKey)) {
      clearTimeout(debounceTimers.get(debounceKey));
    }

    const timer = setTimeout(() => {
      console.log(
        `📝 Change detected in ${packageName}: ${path.relative(
          ecosystemPath,
          filePath
        )}`
      );
      buildPackage(packageName);
      debounceTimers.delete(debounceKey);
    }, 1000);

    debounceTimers.set(debounceKey, timer);
  });

  watcher.on("error", (error) => {
    console.error(`❌ Error watching ${packageName}:`, error.message);
  });

  watchers.set(packageName, watcher);
}

console.log("🚀 Starting to watch changes in ecosystem packages...\n");

packagesToWatch.forEach((packageName) => {
  try {
    watchPackage(packageName);
  } catch (error) {
    console.error(
      `❌ Error setting up watcher for ${packageName}:`,
      error.message
    );
  }
});

process.on("SIGINT", () => {
  console.log("\n🛑 Stopping watching...");
  watchers.forEach((watcher) => watcher.close());
  debounceTimers.forEach((timer) => clearTimeout(timer));
  activeBuilds.forEach((buildProcess) => {
    try {
      buildProcess.kill();
    } catch (e) {}
  });
  process.exit(0);
});
