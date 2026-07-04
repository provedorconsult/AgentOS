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
  },
  {
    file: "adapters/claude-code/README.md",
    mustMatch: [/CLAUDE\.md/, /coexist/i, /backup/i, /never creates, modifies or removes `?\.codex`?/i]
  },
  {
    file: "adapters/claude-code/mapping.yaml",
    mustMatch: [/adapters\/claude-code\/templates\/CLAUDE\.md/, /coexists with the Codex adapter/i]
  },
  {
    file: "adapters/claude-code/templates/CLAUDE.md",
    mustMatch: [/docs\/SPEC\.md/, /docs\/REVIEW\.md/, /coexists/i]
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

function sourceOrderItems(file) {
  if (!fs.existsSync(file)) {
    console.error(`missing instruction file: ${file}`);
    failures += 1;
    return null;
  }
  const text = fs.readFileSync(file, "utf8");
  const section = text.match(/## Source Order\r?\n([\s\S]*?)(?:\r?\n## |$)/);
  if (!section) {
    console.error(`${file}: missing Source Order section`);
    failures += 1;
    return null;
  }
  return section[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s/.test(line));
}

const agentsOrder = sourceOrderItems("AGENTS.md");
const claudeOrder = sourceOrderItems("CLAUDE.md");
if (agentsOrder && claudeOrder && JSON.stringify(agentsOrder) !== JSON.stringify(claudeOrder)) {
  console.error("CLAUDE.md: Source Order drifted from AGENTS.md; keep both instruction surfaces aligned");
  failures += 1;
}

if (failures > 0) process.exit(1);
console.log("AgentOS adapter validation passed.");
