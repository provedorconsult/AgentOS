#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { lineCount, loadAgentosConfig, readJson, resolveFromRoot, resolveInsideRoot, toPosix } from "./agentos-config.mjs";
import { createSchemaValidator } from "./json-schema.mjs";

const allowedFileActions = new Set(["create", "modify", "delete"]);
const allowedTaskStatuses = new Set(["pending", "in-progress", "blocked", "verified", "done"]);
const allowedSprintStatuses = new Set(["pending", "in-progress", "blocked", "verified", "done", "archived"]);
const allowedEvidenceStatuses = new Set(["passed", "failed", "blocked", "not-run"]);

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

function validateSchema(schemaId, data, schemas, owner, collector) {
  const validator = createSchemaValidator(schemas);
  for (const failure of validator.validate(schemaId, data)) {
    collector.fail(`${owner}${failure}`);
  }
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

  let safePath;
  try {
    safePath = resolveInsideRoot(root, ref.path, { forbiddenDirs: config.context.forbiddenDirs });
  } catch (error) {
    collector.fail(`${owner}: ${error.message}`);
    return;
  }
  const resolvedPath = resolveFromRoot(root, safePath);
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

  const declaredCommands = new Set(Array.isArray(task.verification?.commands) ? task.verification.commands : []);
  const criteria = Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria : [];
  const criterionCounts = new Map();
  for (const criterion of criteria) criterionCounts.set(criterion, (criterionCounts.get(criterion) ?? 0) + 1);
  for (const [criterion, count] of criterionCounts) {
    if (count > 1) collector.fail(`${owner}: duplicate acceptance criterion "${criterion}"`);
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
    if (!allowedEvidenceStatuses.has(item.status)) collector.fail(`${evidenceOwner}: invalid status ${item.status}`);
    if (["verified", "done"].includes(task.status) && (typeof item.criterion !== "string" || item.criterion.length === 0)) {
      collector.fail(`${evidenceOwner}: verified evidence requires criterion`);
    }
    if (item.command && !declaredCommands.has(item.command)) collector.fail(`${evidenceOwner}: command is not declared in verification.commands`);
    if (item.criterion && !criteria.includes(item.criterion)) collector.fail(`${evidenceOwner}: criterion is not declared in acceptanceCriteria`);
    if (["verified", "done"].includes(task.status)) {
      if (item.exitCode !== 0) collector.fail(`${evidenceOwner}: verified evidence requires exitCode 0`);
      if (item.status !== "passed") collector.fail(`${evidenceOwner}: verified evidence requires status passed`);
      if (/\b(fail(?:ed|ure)?|blocked|not[- ]run)\b/i.test(item.result ?? "")) {
        collector.fail(`${evidenceOwner}: result does not represent success`);
      }
    }
  }

  if (config.verification.requireEvidencePerCriterion && ["verified", "done"].includes(task.status)) {
    const coveredCriteria = new Map();
    for (const item of evidence) {
      if (item?.criterion) coveredCriteria.set(item.criterion, (coveredCriteria.get(item.criterion) ?? 0) + 1);
    }
    for (const criterion of task.acceptanceCriteria || []) {
      if (!coveredCriteria.has(criterion)) {
        collector.fail(`${owner}: missing evidence for criterion "${criterion}"`);
      } else if (coveredCriteria.get(criterion) > 1) {
        collector.fail(`${owner}: criterion "${criterion}" has duplicate evidence`);
      }
    }
  }
}

function ensureAllowedFields(data, schema, owner, collector) {
  if (schema.additionalProperties !== false) return;
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  for (const key of Object.keys(data)) {
    if (!allowed.has(key)) collector.fail(`${owner}: unknown field ${key}`);
  }
}

function validateAgentGoal(agentGoal, owner, root, collector) {
  if (!agentGoal || typeof agentGoal !== "object" || Array.isArray(agentGoal)) {
    collector.fail(`${owner}: missing agentGoal object`);
    return;
  }
  if (typeof agentGoal.needed !== "boolean") collector.fail(`${owner}.agentGoal.needed must be boolean`);
  if (agentGoal.needed === false) return;
  for (const field of ["draft", "outcome", "verificationSurface", "iterationPolicy", "blockedStopCondition"]) {
    if (typeof agentGoal[field] !== "string" || agentGoal[field].trim().length === 0) {
      collector.fail(`${owner}.agentGoal.${field} must be a non-empty string`);
    }
  }
  if (typeof agentGoal.draft === "string" && !agentGoal.draft.startsWith("/goal")) {
    collector.fail(`${owner}.agentGoal.draft must start with /goal`);
  }
  for (const field of ["constraints", "boundaries"]) {
    if (!Array.isArray(agentGoal[field]) || agentGoal[field].some((value) => typeof value !== "string")) {
      collector.fail(`${owner}.agentGoal.${field} must be an array of strings`);
    }
  }
  for (const boundary of Array.isArray(agentGoal.boundaries) ? agentGoal.boundaries : []) {
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(boundary)) continue;
    try {
      resolveInsideRoot(root, boundary, { forbiddenDirs: loadAgentosConfig(root).context.forbiddenDirs });
    } catch (error) {
      collector.fail(`${owner}.agentGoal.boundaries: ${error.message}`);
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
  validateSchema("https://agentos.local/schemas/task.schema.json", task, schemas, owner, collector);
  ensureRequiredFields(task, schemas.task.required || [], owner, collector);
  ensureAllowedFields(task, schemas.task, owner, collector);

  const allowedStatus = new Set(schemas.task.properties?.status?.enum ?? allowedTaskStatuses);
  if (!allowedStatus.has(task.status)) {
    collector.fail(`${owner}: invalid status ${task.status}`);
  }

  validateAgentGoal(task.agentGoal, owner, root, collector);

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
  const editablePaths = new Set();
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
    try {
      const editablePath = resolveInsideRoot(root, file.path, { forbiddenDirs: config.context.forbiddenDirs });
      if (editablePath === ".") {
        collector.fail(`${owner}.files[${index}]: repository root cannot be an editable file`);
      } else {
        editablePaths.add(editablePath);
      }
    } catch (error) {
      collector.fail(`${owner}.files[${index}]: ${error.message}`);
    }
  }
  for (const [index, ref] of readOnly.entries()) {
    try {
      const readOnlyPath = resolveInsideRoot(root, ref.path, { forbiddenDirs: config.context.forbiddenDirs });
      if (editablePaths.has(readOnlyPath)) {
        collector.fail(`${owner}: ${ref.path} cannot be both read-only and editable`);
      }
    } catch {
      // The range validator already reports the path error.
    }
  }

  const acceptanceCriteria = Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria : [];
  if (acceptanceCriteria.length === 0) collector.fail(`${owner}: must declare acceptanceCriteria`);
  if (acceptanceCriteria.length > config.context.maxAcceptanceCriteriaPerTask) {
    collector.fail(`${owner}: has ${acceptanceCriteria.length} acceptance criteria, max is ${config.context.maxAcceptanceCriteriaPerTask}`);
  }

  const commands = Array.isArray(task.verification?.commands) ? task.verification.commands : [];
  if (commands.length === 0) collector.fail(`${owner}: must declare verification.commands`);

  if (task.status === "blocked" && (typeof task.blocker !== "string" || task.blocker.trim().length === 0)) {
    collector.fail(`${owner}: blocked tasks require blocker`);
  }
  if (task.status === "done" && (typeof task.review !== "string" || task.review.trim().length === 0)) {
    collector.fail(`${owner}: done tasks require review`);
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
  validateSchema("https://agentos.local/schemas/sprint.schema.json", data, schemas, owner, collector);
  ensureAllowedFields(data, schemas.sprint, owner, collector);
  if (!allowedSprintStatuses.has(data.status)) collector.fail(`${owner}: invalid status ${data.status}`);
  if (data.status === "blocked" && (typeof data.blocker !== "string" || data.blocker.trim().length === 0)) {
    collector.fail(`${owner}: blocked sprint requires blocker`);
  }
  if (data.status === "archived" && options.isCurrent === true) collector.fail(`${owner}: archived sprint cannot be current`);
  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  if (tasks.length === 0) {
    collector.fail(`${owner}: sprint must include at least one task`);
  }

  for (const task of tasks) {
    validateTaskData(task, { root, config, schemas, collector, owner: `${owner}.${task?.id ?? "task"}` });
  }
  if (data.status === "verified" && tasks.some((task) => !["verified", "done"].includes(task.status))) {
    collector.fail(`${owner}: verified sprint requires verified or done tasks`);
  }
  if (data.status === "done" && tasks.some((task) => task.status !== "done")) {
    collector.fail(`${owner}: done sprint requires all tasks done`);
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
  validateSchema("https://agentos.local/schemas/project-state.schema.json", data, schemas, owner, collector);
  ensureAllowedFields(data, schemas.projectState, owner, collector);
  if (!["active", "maintenance", "archived"].includes(data.project?.status)) collector.fail(`${owner}: invalid project.status`);
  if (data.agentos?.specEngine !== "specpilot") collector.fail(`${owner}: agentos.specEngine must be specpilot`);
  if (data.agentos?.version !== config.version) collector.fail(`${owner}: agentos.version must match agentos.yaml`);
  if (!data.goalPolicy || data.goalPolicy.field !== "agentGoal" || data.goalPolicy.rejectLegacyField !== "codexGoal") {
    collector.fail(`${owner}: goalPolicy must enforce agentGoal and reject codexGoal`);
  }
  if (!["currentSprint", "lastVerifiedSprint"].includes(data.goalPolicy?.currentPointerMode)) {
    collector.fail(`${owner}: goalPolicy.currentPointerMode is invalid`);
  }
  const expectedMode = data.currentSprint ? "currentSprint" : "lastVerifiedSprint";
  if (data.goalPolicy?.currentPointerMode !== expectedMode) {
    collector.fail(`${owner}: goalPolicy.currentPointerMode must be ${expectedMode}`);
  }
  for (const field of ["currentSprint", "lastVerifiedSprint"]) {
    if (data[field] == null) continue;
    try {
      resolveInsideRoot(root, data[field], { forbiddenDirs: config.context.forbiddenDirs });
    } catch (error) {
      collector.fail(`${owner}.${field}: ${error.message}`);
    }
  }

  return collector.flush();
}
