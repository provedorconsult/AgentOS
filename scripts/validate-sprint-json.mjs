#!/usr/bin/env node
import fs from "node:fs";
import { createCollector, validateSprintData, validateTaskData } from "./lib/agentos-contracts.mjs";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node scripts/validate-sprint-json.mjs <task-or-sprint.json> [...]");
  process.exit(2);
}

const collector = createCollector();
for (const file of files) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    collector.fail(`${file}: invalid JSON: ${error.message}`);
    continue;
  }

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

console.log(`Validated ${files.length} JSON file(s).`);
