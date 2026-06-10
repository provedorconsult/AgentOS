#!/usr/bin/env node
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const required = [
  "AGENTS.md",
  "README.md",
  "agentos.yaml",
  "package.json",
  "docs/PRD_AGENTOS_SPECPILOT_FUSION.md",
  "docs/SPEC.md",
  "docs/PLAN.md",
  "docs/REVIEW.md",
  "docs/ARCHITECTURE.md",
  "docs/ADAPTERS.md",
  "docs/IDE_COMPATIBILITY.md",
  "docs/SPECPILOT_ENGINE.md",
  "docs/SPEC.template.md",
  "docs/PLAN.template.md",
  "docs/TASK.template.md",
  "docs/REVIEW.template.md",
  "core/agents/orchestrator.md",
  "core/workflows/01-discover.md",
  "core/workflows/09-improve.md",
  "core/rules/context.md",
  "core/rules/security.md",
  ".harness/project-state.json",
  ".harness/templates/task.json",
  ".harness/templates/sprint.json",
  ".harness/templates/project-state.json",
  "adapters/codex/README.md",
  "adapters/generic-ide/README.md",
  "adapters/antigravity/README.md",
  "scripts/validate-sprint-json.mjs",
  "scripts/validate-context-ranges.mjs",
  "scripts/validate-no-secrets.mjs"
];

let failures = 0;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`missing: ${file}`);
    failures += 1;
  }
}

for (const command of [["node", ["--version"]], ["git", ["--version"]]]) {
  const result = spawnSync(command[0], command[1], { encoding: "utf8" });
  if (result.status !== 0) {
    console.error(`missing command: ${command[0]}`);
    failures += 1;
  } else {
    console.log(result.stdout.trim());
  }
}

if (failures > 0) process.exit(1);
console.log("AgentOS doctor passed.");
