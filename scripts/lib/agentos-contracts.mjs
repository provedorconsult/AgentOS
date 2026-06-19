#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { lineCount, loadAgentosConfig, readJson, resolveFromRoot, toPosix } from "./agentos-config.mjs";

const allowedFileActions = new Set(["create", "modify", "delete"]);

export function createCollector() {
  const failures = [];
  return {
    fail(message) {
      failures.push(message);
    },
    flush() {
      return failures;
    }
  };
}

export function loadSchemas(root = process.cwd()) {
  return {
    task: readJson(path.join(root, "core", "schemas", "task.schema.json")),
    sprint: readJson(path.join(root, "core", "schemas", "sprint.schema.json")),
    projectState: readJson(path.join(root, "core", "schemas", "project-state.schema.json"))
  };
}

function ensureRequiredFields(data, required, owner, collector) {
  for (const key of required) {
    if (!(key in data)) {
      collector.fail(`${owner}: missing ${key}`);
    }
  }
}

function isForbiddenPath(targetPath, forbiddenDirs) {
  const normalized = toPosix(targetPath);
  return forbiddenDirs.some((dir) => normalized === dir || normalized.startsWith(`${dir}/`) || normalized.includes(`/${dir}/`));
}

function validateRangeReference(owner, ref, root, config, collector) {
  if (!ref || typeof ref.path !== "string" || typeof ref.range !== "string") {
    collector.fail(`${owner}: must include path and range`);
    return;
  }

  const rangeMatch = ref.range.match(/^(\d+)-(\d+)$/);
  if (!rangeMatch) {
    collector.fail(`${owner}: invalid range format ${ref.range}`);
    return;
  }

  const start = Number(rangeMatch[1]);
  const end = Number(rangeMatch[2]);
  if (start < 1 || end < start) {
    collector.fail(`${owner}: invalid range ${ref.range}`);
    return;
  }

  if (end - start + 1 > config.context.maxSpecRangeLines) {
    collector.fail(`${owner}: range ${ref.range} exceeds ${config.context.maxSpecRangeLines} lines`);
  }

  const resolvedPath = resolveFromRoot(root, ref.path);
  if (!fs.existsSync(resolvedPath)) {
    collector.fail(`${owner}: missing ${ref.path}`);
    return;
  }

  const relative = toPosix(path.relative(root, resolvedPath));
  if (isForbiddenPath(relative, config.context.forbiddenDirs)) {
    collector.fail(`${owner}: path is under forbidden directory ${relative}`);
  }

  const totalLines = lineCount(resolvedPath);
  if (end > totalLines) {
    collector.fail(`${owner}: range ${ref.range} exceeds file length ${totalLines}`);
  }
}

function validateEvidence(task, owner, config, collector) {
  const evidence = Array.isArray(task.evidence) ? task.evidence : [];
  if (config.verification.requireEvidencePerCriterion && ["verified", "done"].includes(task.status) && evidence.length === 0) {
    collector.fail(`${owner}: status ${task.status} requires evidence`);
  }

  if (task.status === "pending" && evidence.length > 0) {
    collector.fail(`${owner}: pending tasks cannot include completion evidence`);
  }

  for (const [index, item] of evidence.entries()) {
    const evidenceOwner = `${owner}.evidence[${index}]`;
    if (typeof item !== "object" || item == null) {
      collector.fail(`${evidenceOwner}: evidence item must be an object`);
      continue;
    }
    if (typeof item.command !== "string" || item.command.length === 0) collector.fail(`${evidenceOwner}: missing command`);
    if (config.verification.requireExitCode && typeof item.exitCode !== "number") collector.fail(`${evidenceOwner}: missing numeric exitCode`);
    if (typeof item.result !== "string" || item.result.length === 0) collector.fail(`${evidenceOwner}: missing result`);
    if (["verified", "done"].includes(task.status) && (typeof item.criterion !== "string" || item.criterion.length === 0)) {
      collector.fail(`${evidenceOwner}: verified evidence requires criterion`);
    }
  }

  if (config.verification.requireEvidencePerCriterion && ["verified", "done"].includes(task.status)) {
    const coveredCriteria = new Set(evidence.map((item) => item?.criterion).filter(Boolean));
    for (const criterion of task.acceptanceCriteria || []) {
      if (!coveredCriteria.has(criterion)) {
        collector.fail(`${owner}: missing evidence for criterion "${criterion}"`);
      }
    }
  }
}

export function validateTaskData(task, options = {}) {
  const root = options.root ?? process.cwd();
  const config = options.config ?? loadAgentosConfig(root);
  const schemas = options.schemas ?? loadSchemas(root);
  const collector = options.collector ?? createCollector();
  const owner = options.owner ?? task?.id ?? "task";

  if (!task || typeof task !== "object") {
    collector.fail(`${owner}: task must be an object`);
    return collector.flush();
  }

  if ("codexGoal" in task) collector.fail(`${owner}: uses rejected legacy field codexGoal`);
  ensureRequiredFields(task, schemas.task.required || [], owner, collector);

  const allowedStatus = new Set(schemas.task.properties?.status?.enum ?? []);
  if (!allowedStatus.has(task.status)) {
    collector.fail(`${owner}: invalid status ${task.status}`);
  }

  if (!task.agentGoal || typeof task.agentGoal !== "object") {
    collector.fail(`${owner}: missing agentGoal object`);
  }

  const specRefs = Array.isArray(task.specRefs) ? task.specRefs : [];
  if (specRefs.length === 0) collector.fail(`${owner}: must declare specRefs`);
  for (const [index, ref] of specRefs.entries()) {
    validateRangeReference(`${owner}.specRefs[${index}]`, ref, root, config, collector);
  }

  const readOnly = Array.isArray(task.context?.readOnly) ? task.context.readOnly : [];
  if (readOnly.length > config.context.maxReadonlyFilesPerTask) {
    collector.fail(`${owner}: has ${readOnly.length} readOnly files, max is ${config.context.maxReadonlyFilesPerTask}`);
  }
  for (const [index, ref] of readOnly.entries()) {
    validateRangeReference(`${owner}.context.readOnly[${index}]`, ref, root, config, collector);
  }

  const files = Array.isArray(task.files) ? task.files : [];
  if (files.length === 0) collector.fail(`${owner}: must declare editable files`);
  for (const [index, file] of files.entries()) {
    if (!file || typeof file.path !== "string" || typeof file.action !== "string") {
      collector.fail(`${owner}.files[${index}]: file entry must include path and action`);
      continue;
    }
    if (!allowedFileActions.has(file.action)) {
      collector.fail(`${owner}.files[${index}]: invalid action ${file.action}`);
    }
    if (isForbiddenPath(toPosix(file.path), config.context.forbiddenDirs)) {
      collector.fail(`${owner}.files[${index}]: path is under forbidden directory ${file.path}`);
    }
  }

  const acceptanceCriteria = Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria : [];
  if (acceptanceCriteria.length === 0) collector.fail(`${owner}: must declare acceptanceCriteria`);
  if (acceptanceCriteria.length > config.context.maxAcceptanceCriteriaPerTask) {
    collector.fail(`${owner}: has ${acceptanceCriteria.length} acceptance criteria, max is ${config.context.maxAcceptanceCriteriaPerTask}`);
  }

  const commands = Array.isArray(task.verification?.commands) ? task.verification.commands : [];
  if (commands.length === 0) collector.fail(`${owner}: must declare verification.commands`);

  if (task.status === "blocked" && typeof task.blocker !== "string") {
    collector.fail(`${owner}: blocked tasks require blocker`);
  }

  validateEvidence(task, owner, config, collector);
  return collector.flush();
}

export function validateSprintData(data, options = {}) {
  const root = options.root ?? process.cwd();
  const config = options.config ?? loadAgentosConfig(root);
  const schemas = options.schemas ?? loadSchemas(root);
  const collector = options.collector ?? createCollector();
  const owner = options.owner ?? data?.id ?? "sprint";

  if (!data || typeof data !== "object") {
    collector.fail(`${owner}: sprint must be an object`);
    return collector.flush();
  }

  ensureRequiredFields(data, schemas.sprint.required || [], owner, collector);
  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  if (tasks.length === 0) {
    collector.fail(`${owner}: sprint must include at least one task`);
  }

  for (const task of tasks) {
    validateTaskData(task, { root, config, schemas, collector, owner: `${owner}.${task?.id ?? "task"}` });
  }

  return collector.flush();
}

export function validateProjectStateData(data, options = {}) {
  const root = options.root ?? process.cwd();
  const config = options.config ?? loadAgentosConfig(root);
  const schemas = options.schemas ?? loadSchemas(root);
  const collector = options.collector ?? createCollector();
  const owner = options.owner ?? "project-state";

  if (!data || typeof data !== "object") {
    collector.fail(`${owner}: project state must be an object`);
    return collector.flush();
  }

  ensureRequiredFields(data, schemas.projectState.required || [], owner, collector);
  if (data.agentos?.specEngine !== "specpilot") collector.fail(`${owner}: agentos.specEngine must be specpilot`);
  if (data.agentos?.version !== config.version) collector.fail(`${owner}: agentos.version must match agentos.yaml`);
  if (!data.goalPolicy || data.goalPolicy.field !== "agentGoal" || data.goalPolicy.rejectLegacyField !== "codexGoal") {
    collector.fail(`${owner}: goalPolicy must enforce agentGoal and reject codexGoal`);
  }

  return collector.flush();
}
