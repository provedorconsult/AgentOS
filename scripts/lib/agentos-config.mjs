#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";
import { createSchemaValidator } from "./json-schema.mjs";

export function toPosix(value) {
  return value.replaceAll("\\", "/");
}

export function resolveFromRoot(root, targetPath) {
  return path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
}

function realpathWithExistingParent(targetPath) {
  let candidate = targetPath;
  const tail = [];
  while (!fs.existsSync(candidate)) {
    const parent = path.dirname(candidate);
    if (parent === candidate) break;
    tail.unshift(path.basename(candidate));
    candidate = parent;
  }
  const realParent = fs.realpathSync.native(candidate);
  return path.join(realParent, ...tail);
}

function isForeignAbsolutePath(targetPath) {
  return path.win32.isAbsolute(targetPath) || path.posix.isAbsolute(targetPath);
}

function isForbiddenRelativePath(targetPath, forbiddenDirs) {
  const normalized = toPosix(targetPath);
  return forbiddenDirs.some((dir) => {
    const normalizedDir = toPosix(dir).replace(/^\.?\//, "").replace(/\/$/, "");
    return normalized === normalizedDir || normalized.startsWith(`${normalizedDir}/`) || normalized.includes(`/${normalizedDir}/`);
  });
}

export function resolveInsideRoot(root, targetPath, options = {}) {
  if (typeof targetPath !== "string" || targetPath.trim().length === 0) {
    throw new Error("path must be a non-empty string");
  }
  if (targetPath.includes("\0")) throw new Error("path contains NUL");
  if (isForeignAbsolutePath(targetPath)) throw new Error(`absolute or UNC path is not allowed: ${targetPath}`);

  const realRoot = fs.realpathSync.native(root);
  const candidate = path.resolve(realRoot, targetPath);
  const resolved = realpathWithExistingParent(candidate);
  const normalizeCase = (value) => process.platform === "win32" ? value.toLowerCase() : value;
  const normalizedRoot = normalizeCase(realRoot);
  const normalizedResolved = normalizeCase(resolved);
  if (normalizedResolved !== normalizedRoot && !normalizedResolved.startsWith(`${normalizedRoot}${path.sep}`)) {
    throw new Error(`path is outside repository root: ${targetPath}`);
  }
  const relative = toPosix(path.relative(realRoot, resolved)) || ".";
  if (isForbiddenRelativePath(relative, options.forbiddenDirs ?? [])) {
    throw new Error(`path resolves under forbidden directory: ${relative}`);
  }
  return relative;
}

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

export function lineCount(filePath) {
  const text = readText(filePath);
  if (text.length === 0) return 0;
  return text.split(/\r?\n/).length;
}

function requirePositiveInteger(value, field) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${field} must be a positive integer`);
  return value;
}

export function loadAgentosConfig(root = process.cwd()) {
  const text = readText(path.join(root, "agentos.yaml"));
  const document = parseDocument(text, { uniqueKeys: true, strict: true });
  if (document.errors.length > 0) {
    throw new Error(`invalid agentos.yaml: ${document.errors.map((error) => error.message).join("; ")}`);
  }
  const data = document.toJS();
  if (!data || typeof data !== "object") throw new Error("agentos.yaml must contain an object");
  const configSchema = readJson(path.join(root, "core", "schemas", "agentos-config.schema.json"));
  const schemaFailures = createSchemaValidator({ config: configSchema }).validate(configSchema.$id, data);
  if (schemaFailures.length > 0) {
    throw new Error(`invalid agentos.yaml config: ${schemaFailures.join("; ")}`);
  }
  const availableAdapters = data.adapters?.available;
  if (!availableAdapters.includes(data.adapters.default)) {
    throw new Error("adapters.default must reference an available adapter");
  }

  return {
    version: data.agentos.version,
    raw: data,
    context: {
      maxSpecRangeLines: requirePositiveInteger(data.context?.max_spec_range_lines, "context.max_spec_range_lines"),
      maxReadonlyFilesPerTask: requirePositiveInteger(data.context?.max_readonly_files_per_task, "context.max_readonly_files_per_task"),
      maxAcceptanceCriteriaPerTask: requirePositiveInteger(data.context?.max_acceptance_criteria_per_task, "context.max_acceptance_criteria_per_task"),
      forbiddenDirs: data.context.forbidden_dirs
    },
    verification: {
      requireExitCode: data.verification.require_exit_code,
      requireEvidencePerCriterion: data.verification.require_evidence_per_criterion,
      requireReviewFile: data.verification.require_review_file,
      requireNoSecretsScan: data.verification.require_no_secrets_scan
    }
  };
}
