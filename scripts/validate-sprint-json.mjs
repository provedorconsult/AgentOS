#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createCollector, validateProjectStateData, validateSprintData, validateTaskData } from "./lib/agentos-contracts.mjs";
import { readJson, toPosix } from "./lib/agentos-config.mjs";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node scripts/validate-sprint-json.mjs --discover | <task-or-sprint.json> [...]");
  process.exit(2);
}

const collector = createCollector();

function isIgnoredHarnessFile(file) {
  const name = path.basename(file);
  return name.startsWith(".") || name.endsWith("~") || name.includes(".bak-");
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (isIgnoredHarnessFile(full)) continue;
    if (entry.isFile()) result.push(full);
  }
  return result;
}

function discoverHarnessFiles(root) {
  const harness = path.join(root, ".harness");
  const candidates = [
    ...listFiles(path.join(harness, "templates")),
    ...listFiles(path.join(harness, "sprints")),
    ...listFiles(path.join(harness, "archive"))
  ];
  for (const file of candidates) {
    if (path.extname(file) !== ".json") {
      collector.fail(`${toPosix(path.relative(root, file))}: unknown harness file type`);
    }
  }
  return candidates.filter((file) => path.extname(file) === ".json");
}

function readData(file) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    collector.fail(`${file}: invalid JSON: ${error.message}`);
    return null;
  }
  return data;
}

function validateArchiveSprint(data, file) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    collector.fail(`${file}: archive sprint must be an object`);
    return;
  }
  for (const field of ["id", "status", "title", "tasks"]) {
    if (!(field in data)) collector.fail(`${file}: archive sprint missing ${field}`);
  }
  if (!["verified", "done", "archived"].includes(data.status)) {
    collector.fail(`${file}: archive sprint status must be verified, done or archived`);
  }
  if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
    collector.fail(`${file}: archive sprint must include tasks`);
  }
  for (const [index, task] of (Array.isArray(data.tasks) ? data.tasks : []).entries()) {
    if (!task || typeof task !== "object") {
      collector.fail(`${file}.tasks[${index}]: archive task must be an object`);
      continue;
    }
    for (const field of ["id", "status", "title", "goal"]) {
      if (typeof task[field] !== "string" || task[field].length === 0) {
        collector.fail(`${file}.tasks[${index}]: archive task missing ${field}`);
      }
    }
    if ("codexGoal" in task) collector.fail(`${file}.tasks[${index}]: archive task uses rejected legacy field codexGoal`);
    if (!["verified", "done", "archived", "blocked"].includes(task.status)) {
      collector.fail(`${file}.tasks[${index}]: archive task status is invalid`);
    }
  }
}

function validateTemplate(data, file, root) {
  const name = path.basename(file);
  if (name === "task.json") validateTaskData(data, { root, collector, owner: file });
  else if (name === "sprint.json") validateSprintData(data, { root, collector, owner: file });
  else if (name === "project-state.json") validateProjectStateData(data, { root, collector, owner: file });
  else collector.fail(`${file}: unknown template JSON file`);
}

function validateDiscovered(root) {
  const discovered = discoverHarnessFiles(root);
  const sprintIds = new Map();
  const projectStatePath = path.join(root, ".harness", "project-state.json");
  const projectState = fs.existsSync(projectStatePath) ? readJson(projectStatePath) : null;
  const currentPointer = projectState?.currentSprint ?? null;
  const lastVerifiedPointer = projectState?.lastVerifiedSprint ?? null;

  if (currentPointer && !toPosix(currentPointer).startsWith(".harness/sprints/")) {
    collector.fail(`currentSprint must point to .harness/sprints/: ${currentPointer}`);
  }
  if (lastVerifiedPointer && !/^\.harness\/(?:sprints|archive)\//.test(toPosix(lastVerifiedPointer))) {
    collector.fail(`lastVerifiedSprint must point to .harness/sprints/ or .harness/archive/: ${lastVerifiedPointer}`);
  }

  for (const file of discovered) {
    const rel = toPosix(path.relative(root, file));
    const data = readData(file);
    if (!data) continue;
    if (rel.startsWith(".harness/templates/")) {
      validateTemplate(data, rel, root);
    } else if (rel.startsWith(".harness/sprints/")) {
      validateSprintData(data, { root, collector, owner: rel, isCurrent: rel === currentPointer });
      if (sprintIds.has(data.id)) collector.fail(`${rel}: duplicate sprint id ${data.id} also used by ${sprintIds.get(data.id)}`);
      else sprintIds.set(data.id, rel);
    } else if (rel.startsWith(".harness/archive/")) {
      if (rel === currentPointer) collector.fail(`${rel}: archive sprint cannot be current`);
      validateArchiveSprint(data, rel);
      if (sprintIds.has(data.id)) collector.fail(`${rel}: duplicate sprint id ${data.id} also used by ${sprintIds.get(data.id)}`);
      else sprintIds.set(data.id, rel);
    } else {
      collector.fail(`${rel}: unknown harness JSON file`);
    }
  }

  return discovered.length;
}

let validatedCount = 0;
if (files.length === 1 && files[0] === "--discover") {
  validatedCount = validateDiscovered(process.cwd());
} else {
for (const file of files) {
  const data = readData(file);
  if (!data) continue;
  if (Array.isArray(data.tasks)) {
    validateSprintData(data, { root: process.cwd(), collector, owner: file });
  } else {
    validateTaskData(data, { root: process.cwd(), collector, owner: file });
  }
  validatedCount += 1;
}
}

const failures = collector.flush();
if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Validated ${validatedCount} harness JSON file(s).`);
