#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

export function toPosix(value) {
  return value.replaceAll("\\", "/");
}

export function resolveFromRoot(root, targetPath) {
  return path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
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

function captureScalar(text, key, fallback = null) {
  const match = text.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : fallback;
}

function captureNumber(text, key, fallback) {
  const value = captureScalar(text, key, fallback == null ? null : String(fallback));
  return value == null ? fallback : Number(value);
}

function captureBoolean(text, key, fallback = false) {
  const value = captureScalar(text, key, String(fallback));
  return String(value).trim() === "true";
}

function captureList(text, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escapedKey}:\\s*\\r?\\n((?:\\s+-\\s+.+\\r?\\n?)*)`, "m"));
  if (!match) return [];
  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim().replace(/^["']|["']$/g, ""));
}

export function loadAgentosConfig(root = process.cwd()) {
  const text = readText(path.join(root, "agentos.yaml"));
  return {
    version: captureScalar(text, "version", "0.0.0"),
    context: {
      maxSpecRangeLines: captureNumber(text, "max_spec_range_lines", 120),
      maxReadonlyFilesPerTask: captureNumber(text, "max_readonly_files_per_task", 3),
      maxAcceptanceCriteriaPerTask: captureNumber(text, "max_acceptance_criteria_per_task", 5),
      forbiddenDirs: captureList(text, "forbidden_dirs")
    },
    verification: {
      requireExitCode: captureBoolean(text, "require_exit_code", true),
      requireEvidencePerCriterion: captureBoolean(text, "require_evidence_per_criterion", true),
      requireReviewFile: captureBoolean(text, "require_review_file", true),
      requireNoSecretsScan: captureBoolean(text, "require_no_secrets_scan", true)
    }
  };
}
