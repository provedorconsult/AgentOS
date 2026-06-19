#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
let specPath = null;
let ignoreMissing = false;
const targets = [];

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--spec") specPath = args[++i];
  else if (args[i] === "--ignore-missing") ignoreMissing = true;
  else targets.push(args[i]);
}

let failures = 0;
function fail(message) {
  failures += 1;
  console.error(message);
}

function warn(message) {
  console.warn(`warning: ${message}`);
}

function collectJson(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile() && target.endsWith(".json")) return [target];
  if (!stat.isDirectory()) return [];
  const out = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) out.push(...collectJson(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function validateRange(owner, ref) {
  const match = String(ref.range || "").match(/^(\d+)-(\d+)$/);
  if (!ref.path || !match) return fail(`${owner}: invalid range reference`);
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (start < 1 || end < start) fail(`${owner}: invalid range ${ref.range}`);
  if (end - start + 1 > 120) fail(`${owner}: range ${ref.range} exceeds 120 lines`);
  if (!fs.existsSync(ref.path)) {
    if (ignoreMissing) warn(`${owner}: missing ${ref.path}`);
    else fail(`${owner}: missing ${ref.path}`);
  }
}

if (specPath && !fs.existsSync(specPath)) fail(`missing --spec file ${specPath}`);
const files = targets.flatMap(collectJson);
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const tasks = Array.isArray(data.tasks) ? data.tasks : [data];
  for (const task of tasks) {
    for (const ref of task.specRefs || []) validateRange(`${file}:${task.id}.specRefs`, ref);
    for (const ref of task.context?.readOnly || []) validateRange(`${file}:${task.id}.context.readOnly`, ref);
  }
}

if (failures > 0) process.exit(1);
console.log(`Validated context ranges in ${files.length} JSON file(s).`);
