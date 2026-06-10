#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const allowedStatus = new Set(["pending", "in-progress", "blocked", "verified", "done"]);
const files = process.argv.slice(2);
let failures = 0;

function fail(file, message) {
  failures += 1;
  console.error(`${file}: ${message}`);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(file, `invalid JSON: ${error.message}`);
    return null;
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function validateRange(file, owner, item) {
  if (!item || typeof item.path !== "string" || typeof item.range !== "string") {
    fail(file, `${owner} must include path and range`);
    return;
  }
  const match = item.range.match(/^(\d+)-(\d+)$/);
  if (!match) {
    fail(file, `${owner} range must use start-end format`);
    return;
  }
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (start < 1 || end < start) fail(file, `${owner} range is invalid`);
  if (end - start + 1 > 120) fail(file, `${owner} range exceeds 120 lines`);
}

function validateTask(file, task) {
  if (!task || typeof task !== "object") return fail(file, "task must be an object");
  if ("codexGoal" in task) fail(file, `${task.id || "task"} uses rejected legacy field codexGoal`);
  for (const key of ["id", "status", "title", "goal", "agentGoal", "specRefs", "context", "files", "acceptanceCriteria", "verification", "evidence"]) {
    if (!(key in task)) fail(file, `${task.id || "task"} missing ${key}`);
  }
  if (!allowedStatus.has(task.status)) fail(file, `${task.id || "task"} has invalid status ${task.status}`);
  if (!task.agentGoal || typeof task.agentGoal !== "object") fail(file, `${task.id || "task"} missing agentGoal object`);
  if (asArray(task.specRefs).length === 0) fail(file, `${task.id || "task"} must declare specRefs`);
  for (const ref of asArray(task.specRefs)) validateRange(file, `${task.id}.specRefs`, ref);
  if (!task.context || typeof task.context !== "object") fail(file, `${task.id || "task"} missing context object`);
  for (const ref of asArray(task.context?.readOnly)) validateRange(file, `${task.id}.context.readOnly`, ref);
  if (asArray(task.files).length === 0) fail(file, `${task.id || "task"} must declare editable files`);
  if (asArray(task.acceptanceCriteria).length === 0) fail(file, `${task.id || "task"} must declare acceptanceCriteria`);
  if (asArray(task.verification?.commands).length === 0) fail(file, `${task.id || "task"} must declare verification.commands`);
}

if (files.length === 0) {
  console.error("Usage: node scripts/validate-sprint-json.mjs <task-or-sprint.json> [...]");
  process.exit(2);
}

for (const file of files) {
  const data = readJson(file);
  if (!data) continue;
  if ("codexGoal" in data) fail(file, "uses rejected legacy field codexGoal");
  if (Array.isArray(data.tasks)) {
    if (!data.id || !data.status || !data.title) fail(file, "sprint missing id, status or title");
    for (const task of data.tasks) validateTask(file, task);
  } else {
    validateTask(file, data);
  }
}

if (failures > 0) process.exit(1);
console.log(`Validated ${files.length} JSON file(s).`);
