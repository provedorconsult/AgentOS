#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const cliArgs = process.argv.slice(2);
const target = cliArgs.find((arg) => !arg.startsWith("--")) || ".";
const dryRun = process.argv.includes("--dry-run");
if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
  console.error(`Target path is not a directory: ${target}`);
  process.exit(1);
}

const targetRoot = path.resolve(target);
const out = path.join(targetRoot, "docs", "EXEC_PLANS", "active", "adapt-existing-project.md");
const body = `# Adapt Existing Project\n\nTarget: ${targetRoot}\n\n## Steps\n\n1. Inventory current docs, scripts, tests and CI.\n2. Create or update SPEC, PLAN and REVIEW.\n3. Install a selected adapter with backup.\n4. Run npm run validate.\n\n## Limitation\n\nThis command prepares an adaptation plan in the target repository. It does not perform a full automatic adaptation.\n`;
console.log(`${dryRun ? "would create" : "create"} ${out}`);
if (!dryRun) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, body);
}
