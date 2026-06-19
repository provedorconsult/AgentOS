import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { validateProjectStateData, validateTaskData } from "../scripts/lib/agentos-contracts.mjs";
import { loadAgentosConfig, resolveInsideRoot } from "../scripts/lib/agentos-config.mjs";

const repoRoot = process.cwd();

function validTask(overrides = {}) {
  const criterion = "The correction is verified.";
  return {
    id: "task-post-audit",
    status: "verified",
    title: "Post-audit correction",
    goal: "Close the audited contract gap.",
    agentGoal: {
      needed: true,
      draft: "/goal Close the audited contract gap.",
      outcome: "The invalid contract is rejected.",
      verificationSurface: "npm test",
      constraints: [],
      boundaries: ["scripts/"],
      iterationPolicy: "Use the smallest failing-test-first correction.",
      blockedStopCondition: "Stop after three identical blockers."
    },
    specRefs: [{ path: "docs/SPEC.md", range: "1-10" }],
    context: { readOnly: [], contracts: ["agentos.post-audit.v1"] },
    files: [{ path: "scripts/lib/agentos-contracts.mjs", action: "modify" }],
    acceptanceCriteria: [criterion],
    verification: { commands: ["npm test"] },
    evidence: [{ criterion, command: "npm test", exitCode: 0, status: "passed", result: "Tests passed." }],
    ...overrides
  };
}

function validYaml(overrides = "") {
  return `project:
  name: AgentOS
  type: agentic-development-os
  status: active
agentos:
  version: 2.0.0-rc.1
  mode: generic
  spec_engine: specpilot
  default_workflow: discover-spec-plan-solution-implement-verify-review-release-deploy-retro
layers:
  agents:
    enabled: [engineering]
skills:
  enabled: true
  root: core/skills
  format: markdown
goals:
  enabled: true
  root: core/goals
  hierarchy: [mission, project, goal, task, evidence]
context:
  max_spec_range_lines: 120
  max_readonly_files_per_task: 3
  max_acceptance_criteria_per_task: 5
  forbidden_dirs: [node_modules, .git]
verification:
  require_exit_code: true
  require_evidence_per_criterion: true
  require_review_file: true
  require_no_secrets_scan: true
extensions:
  memory: { status: planned }
packs:
  enabled: false
  available: [engineering]
adapters:
  default: generic-ide
  available: [codex, generic-ide]
${overrides}`;
}

function writeYaml(content) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-config-schema-"));
  fs.writeFileSync(path.join(root, "agentos.yaml"), content);
  return root;
}

test("executable task schema rejects invalid scalar, nested, and additional fields", () => {
  const cases = [
    [validTask({ id: 123 }), /id/],
    [validTask({ title: "" }), /title/],
    [validTask({ goal: null }), /goal/],
    [validTask({ context: "not-an-object" }), /context/],
    [validTask({ agentGoal: { needed: false, unexpected: true } }), /unexpected|additional/i],
    [validTask({ evidence: [{ ...validTask().evidence[0], unexpected: true }] }), /unexpected|additional/i]
  ];
  for (const [value, expected] of cases) {
    assert.match(validateTaskData(value, { root: repoRoot }).join("\n"), expected);
  }
});

test("executable project-state schema rejects invalid nested values", () => {
  const state = JSON.parse(fs.readFileSync(".harness/project-state.json", "utf8"));
  assert.match(validateProjectStateData({ ...state, project: { ...state.project, name: 123 } }, { root: repoRoot }).join("\n"), /name/);
  assert.match(validateProjectStateData({ ...state, agentos: { ...state.agentos, unexpected: true } }, { root: repoRoot }).join("\n"), /unexpected|additional/i);
});

test("agentos YAML semantics reject policy type bypasses and malformed sections", () => {
  const cases = [
    validYaml().replace("require_evidence_per_criterion: true", 'require_evidence_per_criterion: "true"'),
    validYaml().replace("status: active", "status: unknown"),
    validYaml().replace("version: 2.0.0-rc.1", "version: invalid"),
    validYaml().replace("available: [codex, generic-ide]", "available: [codex, 42]"),
    validYaml().replace("enabled: false\n  available: [engineering]", 'enabled: "false"\n  available: [engineering]'),
    validYaml().replace("  default_workflow: discover-spec-plan-solution-implement-verify-review-release-deploy-retro\n", "")
  ];
  for (const content of cases) {
    assert.throws(() => loadAgentosConfig(writeYaml(content)), /agentos\.yaml|config|must/i);
  }
});

test("closed paths reject forbidden symlink targets, repository root, and foreign absolute syntax", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-forbidden-link-"));
  fs.mkdirSync(path.join(root, "node_modules"));
  try {
    fs.symlinkSync(path.join(root, "node_modules"), path.join(root, "alias"), process.platform === "win32" ? "junction" : "dir");
  } catch (error) {
    if (["EPERM", "EACCES"].includes(error.code)) t.skip("Symlinks unavailable.");
    throw error;
  }
  assert.throws(
    () => resolveInsideRoot(root, "alias/package.json", { forbiddenDirs: ["node_modules"] }),
    /forbidden/i
  );
  assert.match(validateTaskData(validTask({ files: [{ path: ".", action: "modify" }] }), { root: repoRoot }).join("\n"), /repository root|editable/i);
  for (const target of ["/etc/passwd", "C:\\Windows\\System32\\drivers\\etc\\hosts", "\\\\server\\share\\file"]) {
    assert.throws(() => resolveInsideRoot(repoRoot, target), /absolute|outside|UNC/i);
  }
});

test("secret scanner detects prefixed assignment names", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-prefixed-secret-"));
  const assignments = [
    ["DB_PASSWORD", "abcdefghijklmnop"],
    ["SERVICE_SECRET", "qrstuvwxyzabcdef"],
    ["CUSTOM_TOKEN", "ghijklmnopqrstuv"]
  ].map(([name, value]) => `${name}=${value}`).join("\n");
  fs.writeFileSync(path.join(root, "config.txt"), `${assignments}\n`);
  const result = spawnSync("node", [path.join(repoRoot, "scripts/validate-no-secrets.mjs")], {
    cwd: root,
    encoding: "utf8"
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /secret assignment/i);
});

test("CI and doctor include dependency and post-audit integrity gates", () => {
  const ci = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  const doctor = fs.readFileSync("scripts/doctor.mjs", "utf8");
  assert.match(ci, /^permissions:\s*\n\s+contents:\s+read/m);
  assert.match(ci, /npm audit --audit-level=moderate/);
  assert.match(ci, /timeout-minutes:/);
  assert.match(ci, /^concurrency:/m);
  assert.ok(fs.existsSync(".github/dependabot.yml"));
  assert.match(doctor, /tests\/agentos-post-audit-corrections\.test\.mjs/);
});

test("README quick start installs dependencies and release docs are post-merge accurate", () => {
  const readme = fs.readFileSync("README.md", "utf8");
  const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
  const review = fs.readFileSync("docs/REVIEW.md", "utf8");
  const quickStart = readme.match(/## Quick Start[\s\S]*?```powershell([\s\S]*?)```/i)?.[1] ?? "";
  assert.match(quickStart.trimStart(), /^npm ci/m);
  assert.doesNotMatch(readme, /no external dependencies/i);
  assert.match(changelog, /executable JSON Schema/i);
  assert.doesNotMatch(review, /still required before merge/i);
  assert.doesNotMatch(review, /Formal review: pending/i);
});
