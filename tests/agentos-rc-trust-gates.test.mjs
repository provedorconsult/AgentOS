import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { validateProjectStateData, validateSprintData, validateTaskData } from "../scripts/lib/agentos-contracts.mjs";
import { loadAgentosConfig, resolveInsideRoot } from "../scripts/lib/agentos-config.mjs";

const repoRoot = process.cwd();
const config = loadAgentosConfig(repoRoot);

function validTask(overrides = {}) {
  const criterion = "The gate passes.";
  return {
    id: "task-rc",
    status: "verified",
    title: "RC gate",
    goal: "Enforce the gate.",
    agentGoal: {
      needed: true,
      draft: "/goal Enforce the RC gate.",
      outcome: "The gate is enforced.",
      verificationSurface: "npm test",
      constraints: [],
      boundaries: ["scripts/"],
      iterationPolicy: "Use the smallest verified change.",
      blockedStopCondition: "Stop after three identical blockers."
    },
    specRefs: [{ path: "docs/SPEC.md", range: "1-10" }],
    context: { readOnly: [{ path: "docs/PLAN.md", range: "1-10" }], contracts: ["agentos.rc.v1"] },
    files: [{ path: "scripts/lib/agentos-contracts.mjs", action: "modify" }],
    acceptanceCriteria: [criterion],
    verification: { commands: ["npm test"] },
    evidence: [{ criterion, command: "npm test", exitCode: 0, status: "passed", result: "Tests passed." }],
    review: "Reviewed against the acceptance criteria.",
    ...overrides
  };
}

test("verified evidence rejects false success and undeclared coverage", () => {
  const cases = [
    [{ evidence: [{ criterion: "The gate passes.", command: "npm test", exitCode: 1, status: "passed", result: "Tests passed." }] }, /exitCode/],
    [{ evidence: [{ criterion: "The gate passes.", command: "npm test", exitCode: 0, status: "failed", result: "failed" }] }, /status|result/],
    [{ evidence: [{ criterion: "The gate passes.", command: "npm run unknown", exitCode: 0, status: "passed", result: "Passed." }] }, /declared/],
    [{ evidence: [{ criterion: "Unknown criterion", command: "npm test", exitCode: 0, status: "passed", result: "Passed." }] }, /criterion/],
    [{ evidence: [] }, /requires evidence/]
  ];

  for (const [overrides, expected] of cases) {
    assert.match(validateTaskData(validTask(overrides), { root: repoRoot }).join("\n"), expected);
  }
});

test("task lifecycle, agentGoal, duplicate criteria and review are enforced", () => {
  assert.match(validateTaskData(validTask({ status: "pending" }), { root: repoRoot }).join("\n"), /pending.*evidence/i);
  assert.match(validateTaskData(validTask({ status: "blocked", blocker: undefined, evidence: [] }), { root: repoRoot }).join("\n"), /blocker/i);
  assert.match(validateTaskData(validTask({ status: "done", review: undefined }), { root: repoRoot }).join("\n"), /review/i);
  assert.match(validateTaskData(validTask({ agentGoal: {} }), { root: repoRoot }).join("\n"), /agentGoal/i);
  assert.match(validateTaskData(validTask({ unexpected: true }), { root: repoRoot }).join("\n"), /unknown field/i);
  assert.match(
    validateTaskData(validTask({
      acceptanceCriteria: ["The gate passes.", "The gate passes."],
      evidence: [{ criterion: "The gate passes.", command: "npm test", exitCode: 0, status: "passed", result: "Passed." }]
    }), { root: repoRoot }).join("\n"),
    /duplicate acceptance criterion/i
  );
});

test("repository path containment rejects absolute, traversal, overlap and symlink escapes", (t) => {
  assert.equal(resolveInsideRoot(repoRoot, "docs/SPEC.md"), "docs/SPEC.md");
  assert.throws(() => resolveInsideRoot(repoRoot, "../outside.md"), /outside repository root/i);
  assert.throws(() => resolveInsideRoot(repoRoot, path.parse(repoRoot).root + "outside.md"), /absolute|outside repository root/i);

  const overlap = validTask({
    context: { readOnly: [{ path: "scripts/lib/agentos-contracts.mjs", range: "1-10" }], contracts: [] }
  });
  assert.match(validateTaskData(overlap, { root: repoRoot }).join("\n"), /read-only and editable/i);

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-symlink-"));
  const external = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-external-"));
  const link = path.join(temp, "escape");
  try {
    fs.symlinkSync(external, link, process.platform === "win32" ? "junction" : "dir");
    assert.throws(() => resolveInsideRoot(temp, "escape/file.md"), /outside repository root/i);
  } catch (error) {
    if (["EPERM", "EACCES"].includes(error.code)) t.skip("Symlinks are unavailable in this environment.");
    else throw error;
  }
});

test("sprint and project state machine rejects inconsistent statuses and pointers", () => {
  const sprint = { id: "sprint-rc", status: "verified", title: "RC", tasks: [validTask()] };
  assert.deepEqual(validateSprintData(sprint, { root: repoRoot }), []);
  assert.match(validateSprintData({ ...sprint, status: "invalid" }, { root: repoRoot }).join("\n"), /invalid status/i);
  assert.match(validateSprintData({ ...sprint, status: "done", tasks: [validTask({ status: "pending", evidence: [] })] }, { root: repoRoot }).join("\n"), /sprint.*done/i);

  const state = JSON.parse(fs.readFileSync(".harness/project-state.json", "utf8"));
  assert.match(
    validateProjectStateData({
      ...state,
      goalPolicy: { ...state.goalPolicy, currentPointerMode: "invalid" }
    }, { root: repoRoot }).join("\n"),
    /currentPointerMode/i
  );
});

test("YAML parser rejects invalid syntax, duplicate keys and invalid values", () => {
  const cases = [
    "agentos: [",
    "agentos:\n  version: 2.0.0\n  version: 2.0.1\n",
    "agentos:\n  version: 2.0.0\n  spec_engine: wrong\ncontext:\n  max_spec_range_lines: -1\n",
    "agentos:\n  version: 2.0.0\n  spec_engine: specpilot\ncontext:\n  forbidden_dirs: wrong\n"
  ];

  for (const content of cases) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-yaml-"));
    fs.writeFileSync(path.join(root, "agentos.yaml"), content);
    assert.throws(() => loadAgentosConfig(root));
  }
});

test("secret scan is occurrence-based and redacts live values", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-secret-occurrence-"));
  const live = ["sk", "abcdefghijklmnopqrstuvwxyz123456"].join("-");
  fs.writeFileSync(path.join(root, ".env.example"), `OPENAI_API_KEY=sk-example-openai-key\nSECOND=${live}\n`);
  const result = spawnSync("node", [path.join(repoRoot, "scripts/validate-no-secrets.mjs")], {
    cwd: root,
    encoding: "utf8"
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /sk-abcd…3456/);
  assert.doesNotMatch(result.stderr, new RegExp(live));
});

test("PowerShell hook delegates to the canonical Node scanner", () => {
  const hook = fs.readFileSync("codex-layer/hooks/check-no-secrets.ps1", "utf8");
  assert.match(hook, /validate-no-secrets\.mjs/);
  assert.match(hook, /LASTEXITCODE/);
  assert.doesNotMatch(hook, /ghp_\[A-Za-z0-9_/);
});

test("doctor and CI use the release-candidate integrity gates", () => {
  const doctor = fs.readFileSync("scripts/doctor.mjs", "utf8");
  const ci = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.doesNotMatch(doctor, /PRD_AGENTOS_EVONEXUS_ALIGNMENT\.docx/);
  assert.match(doctor, /Node >=22/);
  assert.match(ci, /npm ci/);
  assert.match(ci, /git status --porcelain/);
});
