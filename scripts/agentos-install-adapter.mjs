#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cliArgs = process.argv.slice(2);
const adapter = cliArgs.find((arg) => !arg.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");
if (!adapter) {
  console.error("Usage: node scripts/agentos-install-adapter.mjs <codex|generic-ide> [--dry-run]");
  process.exit(2);
}

const source = path.join("adapters", adapter, "templates");
if (!fs.existsSync(source)) {
  console.error(`Unknown adapter: ${adapter}`);
  process.exit(1);
}

function backup(dest) {
  if (!fs.existsSync(dest)) return dest;
  const backupPath = `${dest}.bak-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  console.log(`${dryRun ? "would backup" : "backup"} ${dest} -> ${backupPath}`);
  if (!dryRun) fs.renameSync(dest, backupPath);
  return dest;
}

function copyDir(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (fs.existsSync(to)) backup(to);
      if (!dryRun) fs.mkdirSync(to, { recursive: true });
      copyDir(from, to);
    } else {
      if (fs.existsSync(to)) backup(to);
      console.log(`${dryRun ? "would copy" : "copy"} ${from} -> ${to}`);
      if (!dryRun) {
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
      }
    }
  }
}

copyDir(source, ".");
console.log(`Adapter ${adapter} ${dryRun ? "dry run complete" : "installed"}.`);
