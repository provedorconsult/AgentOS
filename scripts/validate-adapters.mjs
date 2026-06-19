#!/usr/bin/env node
import fs from "node:fs";

const checks = [
  {
    file: "adapters/codex/README.md",
    mustMatch: [/codex-layer/i, /\.codex/i, /backup/i, /dry-run/i]
  },
  {
    file: "adapters/codex/mapping.yaml",
    mustMatch: [/codex-layer:\s*\.codex/i, /AGENTS\.md/i]
  },
  {
    file: "adapters/generic-ide/README.md",
    mustMatch: [/does not create `?\.codex`?/i, /backup/i]
  },
  {
    file: "adapters/generic-ide/mapping.yaml",
    mustMatch: [/IDE_AGENT_GUIDE\.md/i, /AGENTS\.md/i]
  }
];

let failures = 0;
for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    console.error(`missing adapter file: ${check.file}`);
    failures += 1;
    continue;
  }
  const text = fs.readFileSync(check.file, "utf8");
  for (const pattern of check.mustMatch) {
    if (!pattern.test(text)) {
      console.error(`${check.file}: missing ${pattern}`);
      failures += 1;
    }
  }
}

if (failures > 0) process.exit(1);
console.log("AgentOS adapter validation passed.");
