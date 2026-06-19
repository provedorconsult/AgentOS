#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createCollector, validateSprintData, validateTaskData } from "./lib/agentos-contracts.mjs";

const args = process.argv.slice(2);
let specPath = null;
const targets = [];

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--spec") specPath = args[++i];
  else if (args[i] !== "--ignore-missing") targets.push(args[i]);
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

const collector = createCollector();
if (specPath && !fs.existsSync(specPath)) collector.fail(`missing --spec file ${specPath}`);

const files = targets.flatMap(collectJson);
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (Array.isArray(data.tasks)) {
    validateSprintData(data, { root: process.cwd(), collector, owner: file });
  } else {
    validateTaskData(data, { root: process.cwd(), collector, owner: file });
  }
}

const failures = collector.flush();
if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Validated context ranges in ${files.length} JSON file(s).`);
