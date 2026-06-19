#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cliArgs = process.argv.slice(2);
const adapter = cliArgs.find((arg) => !arg.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");
const targetIndex = cliArgs.findIndex((arg) => arg === "--target");
const targetRoot = targetIndex >= 0 ? path.resolve(cliArgs[targetIndex + 1]) : process.cwd();
if (!adapter) {
  console.error("Usage: node scripts/agentos-install-adapter.mjs <codex|generic-ide> [--target <dir>] [--dry-run]");
  process.exit(2);
}

const definitions = {
  codex: [
    { from: path.join("codex-layer"), to: ".codex" },
    { from: path.join("adapters", "codex", "templates", "AGENTS.md"), to: "AGENTS.md" }
  ],
  "generic-ide": [
    { from: path.join("adapters", "generic-ide", "templates", "AGENTS.md"), to: "AGENTS.md" },
    { from: path.join("adapters", "generic-ide", "templates", "IDE_AGENT_GUIDE.md"), to: "IDE_AGENT_GUIDE.md" }
  ]
};

if (!definitions[adapter]) {
  console.error(`Unknown adapter: ${adapter}`);
  process.exit(1);
}

function backup(dest, stamp) {
  if (!fs.existsSync(dest)) return null;
  const backupPath = `${dest}.bak-${stamp}`;
  console.log(`${dryRun ? "would backup" : "backup"} ${dest} -> ${backupPath}`);
  if (!dryRun) fs.renameSync(dest, backupPath);
  return backupPath;
}

function copyPath(src, dest, stamp) {
  const stat = fs.statSync(src);
  const existingBackup = backup(dest, stamp);
  if (stat.isDirectory()) {
    if (!dryRun) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const from = path.join(src, entry.name);
      const to = path.join(dest, entry.name);
      copyPath(from, to, stamp);
    }
  } else {
    console.log(`${dryRun ? "would copy" : "copy"} ${src} -> ${dest}`);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }
  return existingBackup;
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
for (const entry of definitions[adapter]) {
  const from = path.resolve(entry.from);
  const to = path.join(targetRoot, entry.to);
  copyPath(from, to, stamp);
}

console.log(`Adapter ${adapter} ${dryRun ? "dry run complete" : "installed"} in ${targetRoot}.`);
