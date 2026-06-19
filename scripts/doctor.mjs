#!/usr/bin/env node
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { loadAgentosConfig } from "./lib/agentos-config.mjs";

const required = [
  "AGENTS.md",
  "README.md",
  "agentos.yaml",
  "core/README.md",
  "specpilot/README.md",
  "specpilot/templates/README.md",
  "specpilot/validators/README.md",
  "specpilot/harness/README.md",
  "package.json",
  "package-lock.json",
  "docs/PRD_AGENTOS_SPECPILOT_FUSION.md",
  "docs/PRD_AGENTOS_ROADMAP_CURTO_MEDIO_LONGO_PRAZO.md",
  "docs/EVONEXUS_ALIGNMENT.md",
  "docs/GOALS.md",
  "docs/SKILLS.md",
  "docs/EXTENSIONS.md",
  "docs/PACKS.md",
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
  "core/agents/README.md",
  "core/agents/engineering/README.md",
  "core/agents/business/README.md",
  "core/agents/operations/README.md",
  "core/agents/knowledge/README.md",
  "core/skills/README.md",
  "core/skills/dev/dev-spec-writing.md",
  "core/skills/dev/dev-context-capsule.md",
  "core/skills/dev/dev-code-review.md",
  "core/skills/security/sec-secret-scan.md",
  "core/skills/product/prod-prd-to-spec.md",
  "core/skills/ops/ops-retro-capture.md",
  "core/skills/docs/docs-handoff.md",
  "core/goals/README.md",
  "core/goals/goal.schema.json",
  "core/goals/mission.template.md",
  "core/goals/project-goal.template.md",
  "core/goals/goal.template.md",
  "core/schemas/agentos-config.schema.json",
  "scripts/lib/json-schema.mjs",
  "core/workflows/01-discover.md",
  "core/workflows/02-spec.md",
  "core/workflows/03-plan.md",
  "core/workflows/04-solution.md",
  "core/workflows/05-implement.md",
  "core/workflows/06-verify.md",
  "core/workflows/07-review.md",
  "core/workflows/08-release.md",
  "core/workflows/09-deploy.md",
  "core/workflows/10-retro.md",
  "core/rules/context.md",
  "core/rules/security.md",
  ".harness/project-state.json",
  ".harness/templates/task.json",
  ".harness/templates/sprint.json",
  ".harness/templates/project-state.json",
  "adapters/codex/README.md",
  "adapters/generic-ide/README.md",
  "adapters/antigravity/README.md",
  "adapters/claude-code/README.md",
  "adapters/claude-code/mapping.yaml",
  "extensions/README.md",
  "extensions/memory/README.md",
  "extensions/heartbeats/README.md",
  "extensions/routines/README.md",
  "extensions/channels/README.md",
  "extensions/knowledge-db/README.md",
  "packs/README.md",
  "packs/engineering/README.md",
  "packs/business/README.md",
  "packs/isp/README.md",
  "packs/devops/README.md",
  "packs/security/README.md",
  "scripts/validate-sprint-json.mjs",
  "scripts/validate-edit-scope.mjs",
  "scripts/validate-context-ranges.mjs",
  "scripts/validate-no-secrets.mjs",
  "scripts/validate-state.mjs",
  "scripts/validate-workflows.mjs",
  "scripts/validate-adapters.mjs",
  "scripts/validate-docs.mjs",
  "scripts/validate-license.mjs",
  "scripts/deploy.mjs",
  "scripts/deploy.ps1",
  "tests/agentos-2-contracts.test.mjs",
  "tests/agentos-audit-hardening.test.mjs"
  ,"tests/agentos-rc-trust-gates.test.mjs"
  ,"tests/agentos-post-audit-corrections.test.mjs"
  ,"tests/agentos-edit-scope.test.mjs"
  ,"tests/agentos-harness-discovery.test.mjs"
  ,"tests/agentos-secret-scan-extended.test.mjs"
];

let failures = 0;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`missing: ${file}`);
    failures += 1;
  }
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (!Number.isInteger(nodeMajor) || nodeMajor < 22) {
  console.error(`Node >=22 is required; found ${process.versions.node}`);
  failures += 1;
}

try {
  JSON.parse(fs.readFileSync("package.json", "utf8"));
  loadAgentosConfig(process.cwd());
  JSON.parse(fs.readFileSync(".harness/project-state.json", "utf8"));
} catch (error) {
  console.error(`invalid canonical configuration: ${error.message}`);
  failures += 1;
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
