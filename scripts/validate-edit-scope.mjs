#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readJson, readText, resolveInsideRoot, toPosix } from "./lib/agentos-config.mjs";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function runGit(args, options = {}) {
  return spawnSync("git", args, { cwd: root, encoding: "utf8", ...options });
}

function parseArgs(argv) {
  const result = { base: null, head: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base") result.base = argv[++index];
    else if (arg === "--head") result.head = argv[++index];
    else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return result;
}

function defaultBase() {
  const mergeBase = runGit(["merge-base", "HEAD", "origin/main"]);
  if (mergeBase.status === 0 && mergeBase.stdout.trim()) return mergeBase.stdout.trim();
  const head = runGit(["rev-parse", "HEAD"]);
  if (head.status === 0 && head.stdout.trim()) {
    warnings.push("origin/main unavailable; using HEAD as the local scope-validation base");
    return head.stdout.trim();
  }
  throw new Error("unable to determine git diff base");
}

function splitZ(output) {
  return output.split("\0").filter((part) => part.length > 0);
}

function collectGitChanges(base, head) {
  const args = head
    ? ["diff", "--name-status", "-z", base, head]
    : ["diff", "--name-status", "-z", base];
  const diff = runGit(args);
  if (diff.status !== 0) throw new Error(diff.stderr.trim() || "git diff failed");

  const parts = splitZ(diff.stdout);
  const changes = [];
  for (let index = 0; index < parts.length;) {
    const status = parts[index++];
    if (/^[RC]/.test(status)) {
      changes.push({ status, path: parts[index + 1], oldPath: parts[index] });
      index += 2;
    } else {
      changes.push({ status, path: parts[index++] });
    }
  }

  if (!head) {
    const status = runGit(["status", "--porcelain=v1", "-z", "-uall"]);
    if (status.status !== 0) throw new Error(status.stderr.trim() || "git status failed");
    const statusParts = splitZ(status.stdout);
    for (let index = 0; index < statusParts.length; index += 1) {
      const entry = statusParts[index];
      const code = entry.slice(0, 2);
      const file = entry.slice(3);
      if (code === "??") {
        changes.push({ status: "A", path: file });
      }
    }
  }

  const unique = new Map();
  for (const change of changes) {
    const key = change.oldPath ? `${change.status}:${change.oldPath}:${change.path}` : `${change.status}:${change.path}`;
    unique.set(key, change);
  }
  return [...unique.values()];
}

function activeSprintPath() {
  const statePath = path.join(root, ".harness", "project-state.json");
  if (fs.existsSync(statePath)) {
    const state = readJson(statePath);
    if (state.currentSprint) return state.currentSprint;
    if (state.lastVerifiedSprint) return state.lastVerifiedSprint;
  }
  const currentPath = path.join(root, ".harness", "current.txt");
  if (fs.existsSync(currentPath)) {
    const current = readText(currentPath).trim();
    if (current.length > 0) return current;
  }
  return null;
}

function normalizeAllowedPath(owner, target) {
  try {
    return resolveInsideRoot(root, target);
  } catch (error) {
    fail(`${owner}: ${error.message}`);
    return null;
  }
}

function assertSafePatterns(patterns) {
  const broad = new Set(["*", "**", "**/*", "./**", "docs/**", "scripts/**"]);
  for (const pattern of patterns) {
    if (broad.has(pattern)) fail(`scopePolicy.allowPatterns contains broad pattern without justification: ${pattern}`);
    if (path.isAbsolute(pattern) || pattern.includes("\0")) fail(`scopePolicy.allowPatterns contains unsafe pattern: ${pattern}`);
  }
}

function patternToRegExp(pattern) {
  const escaped = toPosix(pattern).replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", "[^/]*");
  return new RegExp(`^${escaped}$`);
}

function loadScope() {
  const sprintRef = activeSprintPath();
  if (!sprintRef) {
    fail("no currentSprint, lastVerifiedSprint or .harness/current.txt pointer found for scope validation");
    return null;
  }
  const sprintPath = normalizeAllowedPath("sprint pointer", sprintRef);
  if (!sprintPath) return null;
  const sprintFullPath = path.join(root, sprintPath);
  if (!fs.existsSync(sprintFullPath)) {
    fail(`sprint pointer does not exist: ${sprintRef}`);
    return null;
  }

  const sprint = readJson(sprintFullPath);
  const policy = sprint.scopePolicy ?? {};
  const declared = new Map();
  const declaredTouched = new Set();
  const evidence = new Set();
  const generated = new Set();
  const patterns = Array.isArray(policy.allowPatterns) ? policy.allowPatterns : [];
  assertSafePatterns(patterns);

  for (const [index, target] of (policy.allowEvidenceFiles ?? []).entries()) {
    const safe = normalizeAllowedPath(`scopePolicy.allowEvidenceFiles[${index}]`, target);
    if (safe) evidence.add(safe);
  }
  for (const [index, target] of (policy.allowGeneratedFiles ?? []).entries()) {
    const safe = normalizeAllowedPath(`scopePolicy.allowGeneratedFiles[${index}]`, target);
    if (safe) generated.add(safe);
  }
  for (const [taskIndex, task] of (sprint.tasks ?? []).entries()) {
    for (const [fileIndex, file] of (task.files ?? []).entries()) {
      const owner = `tasks[${taskIndex}].files[${fileIndex}]`;
      if (!file || typeof file.path !== "string" || typeof file.action !== "string") {
        fail(`${owner}: file entry must include path and action`);
        continue;
      }
      const safe = normalizeAllowedPath(owner, file.path);
      if (!safe) continue;
      if (!["create", "modify", "delete"].includes(file.action)) {
        fail(`${owner}: invalid action ${file.action}`);
        continue;
      }
      const actions = declared.get(safe) ?? new Set();
      actions.add(file.action);
      declared.set(safe, actions);
    }
  }

  return {
    sprintRef,
    declared,
    declaredTouched,
    evidence,
    generated,
    patternMatchers: patterns.map(patternToRegExp)
  };
}

function safeChangePath(owner, target) {
  try {
    return resolveInsideRoot(root, target);
  } catch (error) {
    fail(`${owner}: ${error.message}`);
    return null;
  }
}

function isException(scope, safePath) {
  return scope.evidence.has(safePath) || scope.generated.has(safePath) || scope.patternMatchers.some((pattern) => pattern.test(safePath));
}

function requireAction(scope, safePath, action, status) {
  if (scope.declared.has(safePath)) scope.declaredTouched.add(safePath);
  if (isException(scope, safePath)) return;
  const actions = scope.declared.get(safePath);
  if (!actions) {
    fail(`${safePath}: changed file is outside declared sprint scope (${status})`);
    return;
  }
  scope.declaredTouched.add(safePath);
  if (!actions.has(action)) {
    fail(`${safePath}: git status requires action ${action}, but sprint declares ${[...actions].join(", ")}`);
  }
}

function validateChanges(scope, changes) {
  for (const change of changes) {
    const status = change.status;
    if (/^R/.test(status)) {
      const oldPath = safeChangePath("rename source", change.oldPath);
      const newPath = safeChangePath("rename target", change.path);
      if (oldPath) requireAction(scope, oldPath, "delete", "rename source");
      if (newPath) requireAction(scope, newPath, "create", "rename target");
      continue;
    }
    if (/^A/.test(status)) {
      const safe = safeChangePath("added file", change.path);
      if (safe) requireAction(scope, safe, "create", status);
      continue;
    }
    if (/^D/.test(status)) {
      const safe = safeChangePath("deleted file", change.path);
      if (safe) requireAction(scope, safe, "delete", status);
      continue;
    }
    const safe = safeChangePath("modified file", change.path);
    if (safe) requireAction(scope, safe, "modify", status);
  }

  for (const declaredPath of scope.declared.keys()) {
    if (!scope.declaredTouched.has(declaredPath)) {
      warnings.push(`${declaredPath}: declared in sprint but not changed`);
    }
  }
}

try {
  const args = parseArgs(process.argv.slice(2));
  const scope = loadScope();
  const base = args.base ?? defaultBase();
  const changes = collectGitChanges(base, args.head);
  if (scope) validateChanges(scope, changes);
  if (warnings.length > 0) {
    for (const warning of warnings) console.warn(`warning: ${warning}`);
  }
  if (failures.length > 0) {
    for (const failure of failures) console.error(failure);
    process.exit(1);
  }
  console.log(`Edit scope validation passed (${changes.length} changed path record(s)).`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
