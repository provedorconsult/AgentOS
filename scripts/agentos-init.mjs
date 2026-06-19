#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const dryRun = process.argv.includes("--dry-run");
const pairs = [
  ["docs/SPEC.template.md", "docs/SPEC.md"],
  ["docs/PLAN.template.md", "docs/PLAN.md"],
  ["docs/REVIEW.template.md", "docs/REVIEW.md"],
  [".harness/templates/project-state.json", ".harness/project-state.json"]
];

function copy(src, dest) {
  if (fs.existsSync(dest)) {
    console.log(`skip existing ${dest}`);
    return;
  }
  console.log(`${dryRun ? "would create" : "create"} ${dest}`);
  if (!dryRun) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

for (const [src, dest] of pairs) copy(src, dest);
if (!dryRun) fs.mkdirSync(".harness/sprints", { recursive: true });
console.log("Next: fill docs/SPEC.md, create a sprint JSON, then run npm run validate.");
