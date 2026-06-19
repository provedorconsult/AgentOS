import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = process.cwd();
const discoveryScript = path.join(repoRoot, "scripts", "validate-sprint-json.mjs");

function copyRequiredRoot(target) {
  for (const file of ["agentos.yaml"]) {
    fs.copyFileSync(path.join(repoRoot, file), path.join(target, file));
  }
  fs.mkdirSync(path.join(target, "core", "schemas"), { recursive: true });
  for (const schema of fs.readdirSync(path.join(repoRoot, "core", "schemas"))) {
    fs.copyFileSync(path.join(repoRoot, "core", "schemas", schema), path.join(target, "core", "schemas", schema));
  }
  fs.mkdirSync(path.join(target, "docs"), { recursive: true });
  fs.writeFileSync(path.join(target, "docs", "SPEC.md"), "spec\n");
  fs.writeFileSync(path.join(target, "docs", "PLAN.md"), "plan\n");
}

function task(id = "task-1") {
  return {
    id,
    status: "pending",
    title: "Task",
    goal: "Goal",
    agentGoal: {
      needed: true,
      draft: "/goal Test",
      outcome: "Outcome",
      verificationSurface: "npm test",
      constraints: [],
      boundaries: ["docs/"],
      iterationPolicy: "small",
      blockedStopCondition: "stop"
    },
    specRefs: [{ path: "docs/SPEC.md", range: "1-1" }],
    context: { readOnly: [{ path: "docs/SPEC.md", range: "1-1" }], contracts: ["test.v1"] },
    files: [{ path: "docs/PLAN.md", action: "modify" }],
    acceptanceCriteria: ["criterion"],
    verification: { commands: ["npm test"] },
    evidence: []
  };
}

function sprint(id, status = "pending") {
  const sprintTask = task();
  if (["verified", "done", "archived"].includes(status)) sprintTask.status = "verified";
  return { id, status, title: id, tasks: [sprintTask] };
}

function setupHarness() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-discovery-"));
  copyRequiredRoot(root);
  for (const dir of [".harness/templates", ".harness/sprints", ".harness/archive"]) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }
  fs.writeFileSync(path.join(root, ".harness", "templates", "task.json"), JSON.stringify(task("template-task"), null, 2));
  fs.writeFileSync(path.join(root, ".harness", "templates", "sprint.json"), JSON.stringify(sprint("template-sprint"), null, 2));
  fs.writeFileSync(path.join(root, ".harness", "templates", "project-state.json"), JSON.stringify({
    project: { name: "AgentOS", status: "active" },
    agentos: { version: "2.0.0-rc.1", specEngine: "specpilot" },
    currentSprint: null,
    lastVerifiedSprint: null,
    goalPolicy: { field: "agentGoal", rejectLegacyField: "codexGoal", currentPointerMode: "lastVerifiedSprint" }
  }, null, 2));
  fs.writeFileSync(path.join(root, ".harness", "sprints", "current.json"), JSON.stringify(sprint("current-sprint"), null, 2));
  fs.writeFileSync(path.join(root, ".harness", "archive", "old.json"), JSON.stringify({ ...sprint("old-sprint", "verified") }, null, 2));
  fs.writeFileSync(path.join(root, ".harness", "current.txt"), ".harness/sprints/current.json\n");
  fs.writeFileSync(path.join(root, ".harness", "project-state.json"), JSON.stringify({
    project: { name: "AgentOS", status: "active" },
    agentos: { version: "2.0.0-rc.1", specEngine: "specpilot" },
    currentSprint: ".harness/sprints/current.json",
    lastVerifiedSprint: ".harness/archive/old.json",
    goalPolicy: { field: "agentGoal", rejectLegacyField: "codexGoal", currentPointerMode: "currentSprint" }
  }, null, 2));
  return root;
}

function discover(root) {
  return spawnSync("node", [discoveryScript, "--discover"], { cwd: root, encoding: "utf8" });
}

test("harness discovery validates newly added sprints without package hardcoding", () => {
  const root = setupHarness();
  fs.writeFileSync(path.join(root, ".harness", "sprints", "new-sprint.json"), JSON.stringify(sprint("new-sprint"), null, 2));

  const result = discover(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Validated \d+ harness JSON file/);
});

test("harness discovery rejects invalid JSON, duplicate ids, invalid archive and current archive pointers", () => {
  const invalidJson = setupHarness();
  fs.writeFileSync(path.join(invalidJson, ".harness", "sprints", "bad.json"), "{");
  assert.notEqual(discover(invalidJson).status, 0);

  const duplicate = setupHarness();
  fs.writeFileSync(path.join(duplicate, ".harness", "sprints", "duplicate.json"), JSON.stringify(sprint("current-sprint"), null, 2));
  const duplicateResult = discover(duplicate);
  assert.notEqual(duplicateResult.status, 0);
  assert.match(`${duplicateResult.stdout}\n${duplicateResult.stderr}`, /duplicate/i);

  const invalidArchive = setupHarness();
  fs.writeFileSync(path.join(invalidArchive, ".harness", "archive", "pending.json"), JSON.stringify(sprint("pending-archive", "pending"), null, 2));
  const archiveResult = discover(invalidArchive);
  assert.notEqual(archiveResult.status, 0);
  assert.match(`${archiveResult.stdout}\n${archiveResult.stderr}`, /archive/i);

  const archiveCurrent = setupHarness();
  fs.writeFileSync(path.join(archiveCurrent, ".harness", "current.txt"), ".harness/archive/old.json\n");
  fs.writeFileSync(path.join(archiveCurrent, ".harness", "project-state.json"), JSON.stringify({
    project: { name: "AgentOS", status: "active" },
    agentos: { version: "2.0.0-rc.1", specEngine: "specpilot" },
    currentSprint: ".harness/archive/old.json",
    lastVerifiedSprint: null,
    goalPolicy: { field: "agentGoal", rejectLegacyField: "codexGoal", currentPointerMode: "currentSprint" }
  }, null, 2));
  const currentResult = discover(archiveCurrent);
  assert.notEqual(currentResult.status, 0);
  assert.match(`${currentResult.stdout}\n${currentResult.stderr}`, /archive.*current|current.*archive/i);
});

test("harness discovery rejects unknown JSON files and invalid templates", () => {
  const unknown = setupHarness();
  fs.writeFileSync(path.join(unknown, ".harness", "templates", "unknown.json"), "{}");
  const unknownResult = discover(unknown);
  assert.notEqual(unknownResult.status, 0);
  assert.match(`${unknownResult.stdout}\n${unknownResult.stderr}`, /unknown/i);

  const invalidTemplate = setupHarness();
  fs.writeFileSync(path.join(invalidTemplate, ".harness", "templates", "task.json"), JSON.stringify({ id: "bad" }, null, 2));
  const templateResult = discover(invalidTemplate);
  assert.notEqual(templateResult.status, 0);
  assert.match(`${templateResult.stdout}\n${templateResult.stderr}`, /template|missing|required/i);
});
