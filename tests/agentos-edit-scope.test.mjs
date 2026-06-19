import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = process.cwd();
const scopeScript = path.join(repoRoot, "scripts", "validate-edit-scope.mjs");

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  assert.equal(result.error, undefined, result.error?.message);
  return result;
}

function git(cwd, args) {
  const result = run("git", args, cwd);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return result;
}

function writeFile(root, file, content = "content\n") {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function sprintFixture(files, extra = {}) {
  return {
    id: "scope-sprint",
    status: "in-progress",
    title: "Scope sprint",
    scopePolicy: {
      allowDeclaredFiles: true,
      allowEvidenceFiles: ["docs/REVIEW.md", ".harness/current.txt", ".harness/project-state.json"],
      allowGeneratedFiles: [],
      allowPatterns: [],
      ...extra.scopePolicy
    },
    tasks: [
      {
        id: "task-a",
        status: "in-progress",
        title: "Task A",
        goal: "Validate edit scope.",
        agentGoal: {
          needed: true,
          draft: "/goal Validate edit scope.",
          outcome: "Scope is enforced.",
          verificationSurface: "npm run validate:scope",
          constraints: [],
          boundaries: ["docs/"],
          iterationPolicy: "Use regression tests.",
          blockedStopCondition: "Stop after repeated failures."
        },
        specRefs: [{ path: "docs/SPEC.md", range: "1-1" }],
        context: { readOnly: [], contracts: ["scope.v1"] },
        files,
        acceptanceCriteria: ["Scope is validated."],
        verification: { commands: ["npm run validate:scope"] },
        evidence: []
      },
      ...(extra.tasks ?? [])
    ]
  };
}

function setupRepo(files, extra = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-scope-"));
  git(root, ["init"]);
  git(root, ["config", "user.email", "agentos@example.test"]);
  git(root, ["config", "user.name", "AgentOS Test"]);
  fs.mkdirSync(path.join(root, ".harness", "sprints"), { recursive: true });
  writeFile(root, "docs/SPEC.md", "spec\n");
  writeFile(root, "docs/REVIEW.md", "review\n");
  fs.writeFileSync(path.join(root, ".harness", "current.txt"), ".harness/sprints/current.json\n");
  fs.writeFileSync(
    path.join(root, ".harness", "project-state.json"),
    JSON.stringify({
      project: { name: "AgentOS", status: "active" },
      agentos: { version: "2.0.0-rc.1", specEngine: "specpilot" },
      currentSprint: ".harness/sprints/current.json",
      lastVerifiedSprint: null,
      goalPolicy: { field: "agentGoal", rejectLegacyField: "codexGoal", currentPointerMode: "currentSprint" }
    }, null, 2)
  );
  fs.writeFileSync(path.join(root, ".harness", "sprints", "current.json"), JSON.stringify(sprintFixture(files, extra), null, 2));
  for (const file of extra.baseFiles ?? []) writeFile(root, file);
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "base"]);
  return root;
}

function validateScope(root) {
  return run("node", [scopeScript, "--base", "HEAD"], root);
}

test("edit scope rejects files outside the declared sprint scope", () => {
  const root = setupRepo([{ path: "docs/allowed.md", action: "modify" }], { baseFiles: ["docs/allowed.md"] });
  writeFile(root, "docs/allowed.md", "changed\n");
  writeFile(root, "docs/extra.md", "extra\n");

  const result = validateScope(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /docs\/extra\.md|outside/i);
});

test("edit scope permits declared files, evidence files, spaces in filenames, empty diffs and multiple tasks", () => {
  const root = setupRepo(
    [{ path: "docs/allowed file.md", action: "modify" }],
    {
      baseFiles: ["docs/allowed file.md"],
      tasks: [
        {
          ...sprintFixture([{ path: "scripts/created.mjs", action: "create" }]).tasks[0],
          id: "task-b",
          files: [{ path: "scripts/created.mjs", action: "create" }]
        }
      ]
    }
  );

  const empty = validateScope(root);
  assert.equal(empty.status, 0, `${empty.stdout}\n${empty.stderr}`);

  writeFile(root, "docs/allowed file.md", "changed\n");
  writeFile(root, "scripts/created.mjs", "export default true;\n");
  writeFile(root, "docs/REVIEW.md", "evidence\n");
  const changed = validateScope(root);
  assert.equal(changed.status, 0, `${changed.stdout}\n${changed.stderr}`);
});

test("edit scope rejects undeclared renames and action mismatches", () => {
  const renameRoot = setupRepo([{ path: "docs/new.md", action: "create" }], { baseFiles: ["docs/old.md"] });
  fs.renameSync(path.join(renameRoot, "docs", "old.md"), path.join(renameRoot, "docs", "new.md"));
  const rename = validateScope(renameRoot);
  assert.notEqual(rename.status, 0);
  assert.match(`${rename.stdout}\n${rename.stderr}`, /rename|docs\/old\.md/i);

  const createRoot = setupRepo([{ path: "docs/new.md", action: "modify" }]);
  writeFile(createRoot, "docs/new.md", "new\n");
  const create = validateScope(createRoot);
  assert.notEqual(create.status, 0);
  assert.match(`${create.stdout}\n${create.stderr}`, /create|action/i);

  const deleteRoot = setupRepo([{ path: "docs/delete.md", action: "create" }], { baseFiles: ["docs/delete.md"] });
  fs.unlinkSync(path.join(deleteRoot, "docs", "delete.md"));
  const deletion = validateScope(deleteRoot);
  assert.notEqual(deletion.status, 0);
  assert.match(`${deletion.stdout}\n${deletion.stderr}`, /delete|action/i);
});

test("edit scope rejects traversal and absolute declared paths", () => {
  for (const file of ["../outside.md", "C:\\Windows\\system32\\drivers\\etc\\hosts"]) {
    const root = setupRepo([{ path: file, action: "modify" }]);
    const result = validateScope(root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /outside|absolute|UNC/i);
  }
});
