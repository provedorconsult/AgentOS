#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createCollector, validateProjectStateData, validateSprintData } from "./lib/agentos-contracts.mjs";
import { readJson, readText, resolveFromRoot } from "./lib/agentos-config.mjs";

const root = process.cwd();
const collector = createCollector();
const currentPathFile = path.join(root, ".harness", "current.txt");
const projectStateFile = path.join(root, ".harness", "project-state.json");

if (!fs.existsSync(currentPathFile)) {
  collector.fail("missing .harness/current.txt");
}
if (!fs.existsSync(projectStateFile)) {
  collector.fail("missing .harness/project-state.json");
}

if (collector.flush().length === 0) {
  const currentPointer = readText(currentPathFile).trim();
  if (currentPointer.length === 0) collector.fail(".harness/current.txt must contain a sprint path");

  const projectState = readJson(projectStateFile);
  validateProjectStateData(projectState, { root, collector, owner: ".harness/project-state.json" });

  const expectedPointer = projectState.currentSprint ?? projectState.lastVerifiedSprint ?? null;
  if (!expectedPointer) {
    collector.fail(".harness/project-state.json must define currentSprint or lastVerifiedSprint");
  } else if (currentPointer !== expectedPointer) {
    collector.fail(`current pointer mismatch: ${currentPointer} != ${expectedPointer}`);
  }

  const resolvedSprint = expectedPointer ? resolveFromRoot(root, expectedPointer) : null;
  if (resolvedSprint && !fs.existsSync(resolvedSprint)) {
    collector.fail(`referenced sprint does not exist: ${expectedPointer}`);
  }

  if (resolvedSprint && fs.existsSync(resolvedSprint)) {
    const sprint = readJson(resolvedSprint);
    validateSprintData(sprint, { root, collector, owner: expectedPointer, isCurrent: Boolean(projectState.currentSprint) });

    if (projectState.currentSprint && sprint.status === "verified") {
      collector.fail("verified sprint cannot remain in currentSprint; move it to lastVerifiedSprint or clear the active pointer");
    }

    if (!projectState.currentSprint && projectState.lastVerifiedSprint && !["verified", "done"].includes(sprint.status)) {
      collector.fail("lastVerifiedSprint must point to a verified or done sprint");
    }
  }
}

const failures = collector.flush();
if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log("AgentOS state validation passed.");
