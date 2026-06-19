#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", ".venv", "dist", "build", ".next", "coverage", "vendor"]);
const ignoredFiles = new Set(["scripts/validate-no-secrets.mjs"]);
const patterns = [
  [/-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/, "private key"],
  [/\bghp_[A-Za-z0-9_]{20,}\b/, "GitHub token"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/, "GitHub fine-grained token"],
  [/\bsk-[A-Za-z0-9]{20,}\b/, "API token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\b/, "JWT token"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, "Slack token"],
  [/\bN[A-Za-z\d]{23,}\.[A-Za-z\d]{6}\.[A-Za-z\d_-]{27,}\b/, "Discord token"],
  [/\b\d{8,10}:[A-Za-z0-9_-]{20,}\b/, "Telegram bot token"],
  [/\bAIza[0-9A-Za-z\-_]{35}\b/, "Google API key"],
  [/[a-z]+:\/\/[^/\s:@]+:[^/\s:@]+@[^/\s]+/i, "basic-auth URL"],
  [/\b(?:postgres(?:ql)?|mysql|sqlserver):\/\/[^/\s:@]+:[^/\s:@]+@[^/\s]+/i, "connection string"],
  [/-----BEGIN PRIVATE KEY-----/, "PKCS#8 private key"],
  [/\b(password|secret|token|api[_-]?key)\s*=\s*['"]?[^'"\s]{12,}/i, "secret assignment"]
];
let failures = 0;

export function isSafePlaceholder(match) {
  const value = String(match).trim();
  return [
    /^sk-example(?:-[A-Za-z0-9_-]+)*$/i,
    /^sk-x{8,}$/i,
    /^ghp_example(?:_[A-Za-z0-9_-]+)*$/i,
    /^ghp_x{8,}$/i,
    /^(?:REPLACE_ME|YOUR_TOKEN_HERE|<token>|x{8,})$/i
  ].some((pattern) => pattern.test(value));
}

function redact(value) {
  const text = String(value);
  if (text.length <= 10) return "…";
  return `${text.slice(0, 7)}…${text.slice(-4)}`;
}

function scan(file) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (ignoredFiles.has(rel)) return;
  if (path.basename(file) === ".env") {
    console.error(`${rel}: real .env files are not allowed`);
    failures += 1;
    return;
  }
  const text = fs.readFileSync(file, "utf8");
  for (const [pattern, label] of patterns) {
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    for (const match of text.matchAll(globalPattern)) {
      const value = match[0];
      if (isSafePlaceholder(value)) continue;
      console.error(`${rel}:${text.slice(0, match.index).split(/\r?\n/).length} possible ${label} ${redact(value)}`);
      failures += 1;
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name));
    } else if (entry.isFile()) {
      const full = path.join(dir, entry.name);
      try {
        scan(full);
      } catch {
        // Ignore binary or unreadable files.
      }
    }
  }
}

walk(root);
if (failures > 0) process.exit(1);
console.log("No secrets detected.");
