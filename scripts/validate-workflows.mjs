#!/usr/bin/env node
import fs from "node:fs";

const required = [
  "core/workflows/01-discover.md",
  "core/workflows/02-spec.md",
  "core/workflows/03-plan.md",
  "core/workflows/04-solution.md",
  "core/workflows/05-implement.md",
  "core/workflows/06-verify.md",
  "core/workflows/07-review.md",
  "core/workflows/08-release.md",
  "core/workflows/09-deploy.md",
  "core/workflows/10-retro.md"
];

const deprecated = [
  "core/workflows/04-implement.md",
  "core/workflows/05-verify.md",
  "core/workflows/06-finish.md",
  "core/workflows/07-release.md",
  "core/workflows/08-deploy.md",
  "core/workflows/09-improve.md"
];

let failures = 0;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`missing canonical workflow: ${file}`);
    failures += 1;
  }
}

for (const file of deprecated) {
  if (!fs.existsSync(file)) {
    console.error(`missing compatibility workflow: ${file}`);
    failures += 1;
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  if (!/deprecated compatibility workflow/i.test(text)) {
    console.error(`${file}: missing deprecated compatibility workflow marker`);
    failures += 1;
  }
}

if (failures > 0) process.exit(1);
console.log("AgentOS workflow validation passed.");
