#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", ".venv", "dist", "build", ".next", "coverage", "vendor"]);
const ignoredFiles = new Set(["scripts/validate-no-secrets.mjs"]);
const sensitiveNamePattern = /(?:^|[_-])(?:password|passwd|secret|token|api[_-]?key|private[_-]?key|access[_-]?token|client[_-]?secret)(?:$|[_-])/i;
const patterns = [
  [/-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/, "private key"],
  [/\bghp_[A-Za-z0-9_]{20,}\b/, "GitHub token"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/, "GitHub fine-grained token"],
  [/\bsk-[A-Za-z0-9_-]{20,}\b/, "API token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\b/, "JWT token"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, "Slack token"],
  [/\bN[A-Za-z\d]{23,}\.[A-Za-z\d]{6}\.[A-Za-z\d_-]{27,}\b/, "Discord token"],
  [/\b\d{8,10}:[A-Za-z0-9_-]{20,}\b/, "Telegram bot token"],
  [/\bAIza[0-9A-Za-z\-_]{35}\b/, "Google API key"],
  [/[a-z]+:\/\/[^/\s:@]+:[^/\s:@]+@[^/\s]+/i, "basic-auth URL"],
  [/\b(?:postgres(?:ql)?|mysql|sqlserver):\/\/[^/\s:@]+:[^/\s:@]+@[^/\s]+/i, "connection string"],
  [/-----BEGIN PRIVATE KEY-----/, "PKCS#8 private key"],
  [/\b[A-Za-z0-9_-]*(?:password|secret|token|api[_-]?key)[ \t]*=[ \t]*['"]?[A-Za-z0-9_./:+-]{12,}/i, "secret assignment"]
];
let failures = 0;

export function isSafePlaceholder(match) {
  const raw = String(match).trim();
  const value = raw;
  return [
    /^sk-example-openai-key$/i,
    /^sk-x{8,}$/i,
    /^ghp_example_github_token$/i,
    /^ghp_x{8,}$/i,
    /^(?:REPLACE_ME|YOUR_TOKEN_HERE|<token>|x{8,})$/i,
    /^\$\{[^}]+\}$/
  ].some((pattern) => pattern.test(value));
}

const fingerprintKey = randomBytes(32);
function redact(value) {
  // Per-process HMAC: no secret fragments and no public dictionary-checkable hash.
  return `[REDACTED fingerprint=${createHmac("sha256", fingerprintKey).update(String(value)).digest("hex").slice(0, 16)}]`;
}
let incomplete = 0;
let currentBlob = "";
let reviewedBinaryCount = 0;
let review = { historySyntheticValues: [], reviewedBinaryBlobs: [] };
const reviewPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "secret-scan-review.json");
try {
  if (fs.existsSync(reviewPath)) review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  if (!Array.isArray(review.historySyntheticValues) || !Array.isArray(review.reviewedBinaryBlobs)) throw new Error();
} catch {
  console.error("Secret-scan review metadata is invalid; scan incomplete.");
  process.exit(2);
}
function reviewedSynthetic(rel, value) {
  if (!currentBlob) return false;
  const digest = createHash("sha256").update(String(value)).digest("hex");
  const assignment = String(value).match(/^[A-Za-z_][A-Za-z0-9_]*[ \t]*=(.*)$/);
  const valueDigest = assignment ? createHash("sha256").update(stripValue(assignment[1])).digest("hex") : digest;
  return review.historySyntheticValues.some(item => item.path === rel && item.blob === currentBlob && (item.sha256 === digest || item.sha256 === valueDigest));
}
function sensitiveFile(rel) {
  const name = path.posix.basename(rel.replaceAll("\\", "/"));
  return (name === ".env" || (name.startsWith(".env.") && name !== ".env.example")) ||
    /^(?:id_rsa|id_dsa|id_ecdsa|id_ed25519|credentials\.json)$/i.test(name) ||
    /(?:\.p12|\.pfx|\.key|\.bak|\.backup)$/i.test(name);
}
function diagnostic(rel, label, value, line = null) {
  // JSON escaping keeps hostile filenames and control characters out of logs.
  console.error(`${JSON.stringify(rel)}${line ? ":" + line : ""}: ${label}${value === undefined ? "" : " " + redact(value)}${currentBlob ? " blob=" + currentBlob : ""}`);
  failures += 1;
}

function stripValue(value) {
  let text = String(value).trim();
  text = text.split("\\n")[0].trim();
  text = text.replace(/,$/, "").trim();
  const quoted = text.match(/^(['"])([\s\S]*)\1$/);
  if (quoted) return quoted[2];
  return text.replace(/\s+#.*$/, "").replace(/\s+-->/, "").replace(/['"]$/, "").trim();
}

function isSensitiveAssignmentName(name) {
  return sensitiveNamePattern.test(String(name).replaceAll(".", "_"));
}

function isSuspiciousValue(value) {
  const text = String(value).trim();
  if (text.length < 12) return false;
  if (isSafePlaceholder(text)) return false;
  if (/^\[|^\{|\.join\(|Buffer\.from\(/.test(text)) return false;
  if (/^(?:enabled|disabled|configured|true|false|yes|no|none|null|placeholder)$/i.test(text)) return false;
  return /[A-Za-z0-9]/.test(text);
}

function assignmentMatches(line) {
  const matches = [];
  const patterns = [
    /["']?([A-Za-z_][A-Za-z0-9_.-]*(?:PASSWORD|PASSWD|SECRET|TOKEN|API[_-]?KEY|PRIVATE[_-]?KEY|ACCESS[_-]?TOKEN|CLIENT[_-]?SECRET)[A-Za-z0-9_.-]*)["']?\s*[:=]\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s,<>][^\r\n]*)/gi,
    /["']?([A-Za-z_][A-Za-z0-9_.-]*)["']?\s*[:=]\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s,<>][^\r\n]*)/g
  ];
  for (const pattern of patterns) {
    for (const match of line.matchAll(pattern)) {
      const name = match[1];
      const value = stripValue(match[2]);
      if (isSensitiveAssignmentName(name) && isSuspiciousValue(value) &&
          !(/_env_var$/i.test(name) && /^[A-Z_][A-Z0-9_]*$/.test(value))) {
        matches.push({ name, value });
      }
    }
  }
  return matches;
}

function scanText(rel, text) {
  if (ignoredFiles.has(rel)) return;
  if (sensitiveFile(rel)) diagnostic(rel, "sensitive file is not allowed");
  for (const [lineIndex, line] of text.split(/\r?\n/).entries()) {
    for (const match of assignmentMatches(line)) {
      if (!reviewedSynthetic(rel, match.value)) diagnostic(rel, "possible secret assignment", match.value, lineIndex + 1);
    }
  }
  for (const [pattern, label] of patterns) {
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    for (const match of text.matchAll(globalPattern)) {
      const value = match[0];
      const placeholderValue = label === "secret assignment" ? stripValue(value.slice(value.indexOf("=") + 1)) : value;
      if (isSafePlaceholder(placeholderValue) || reviewedSynthetic(rel, value)) continue;
      diagnostic(rel, `possible ${label}`, value, text.slice(0, match.index).split(/\r?\n/).length);
    }
  }
}
function scanBuffer(rel, data) {
  if (data.includes(0)) {
    const reviewed = currentBlob && review.reviewedBinaryBlobs.some(item => item.path === rel && item.blob === currentBlob);
    if (reviewed) { reviewedBinaryCount += 1; return; }
    console.error(`${JSON.stringify(rel)}: binary requires independent content review; scan incomplete`);
    incomplete += 1;
    return;
  }
  scanText(rel, data.toString("utf8"));
}
function scan(file) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  scanBuffer(rel, fs.readFileSync(file));
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name));
    } else if (entry.isSymbolicLink()) {
      console.error(`${JSON.stringify(path.relative(root, path.join(dir, entry.name)))}: symlink not followed; review required`);
      incomplete += 1;
    } else if (entry.isFile()) {
      const full = path.join(dir, entry.name);
      try {
        scan(full);
      } catch {
        console.error("Unreadable file; scan incomplete (value omitted).");
        incomplete += 1;
      }
    }
  }
}

function git(args, options = {}) {
  const result = spawnSync("git", args, { cwd: root, maxBuffer: 64 * 1024 * 1024, ...options });
  if (result.status !== 0 || result.error) throw new Error("Git read failed; history coverage incomplete (output omitted).");
  return result.stdout;
}
function history() {
  if (git(["rev-parse", "--is-shallow-repository"]).toString().trim() !== "false") throw new Error("Shallow history is not complete; fetch full history before scanning.");
  const commits = git(["rev-list", "--all"]).toString().trim().split(/\r?\n/).filter(Boolean);
  if (!commits.length) throw new Error("No reachable commits; scan incomplete.");
  const objects = new Map();
  for (const commit of commits) {
    for (const row of git(["ls-tree", "-r", "-z", commit]).toString("utf8").split("\0").filter(Boolean)) {
      const [metadata, ...tail] = row.split("\t");
      const [, type, oid] = metadata.split(" ");
      if (type !== "blob") continue;
      const paths = objects.get(oid) ?? new Set();
      paths.add(tail.join("\t")); objects.set(oid, paths);
    }
  }
  const batch = git(["cat-file", "--batch"], { input: [...objects.keys()].join("\n") + "\n" });
  let offset = 0;
  for (const [oid, paths] of objects) {
    const end = batch.indexOf(10, offset);
    if (end < 0) throw new Error("Truncated blob batch; scan incomplete.");
    const [actual, type, length] = batch.subarray(offset, end).toString().split(" ");
    const size = Number(length);
    if (actual !== oid || type !== "blob" || !Number.isSafeInteger(size) || size < 0 || end + 1 + size >= batch.length) throw new Error("Invalid blob batch; scan incomplete.");
    const data = batch.subarray(end + 1, end + 1 + size);
    currentBlob = oid;
    for (const rel of paths) scanBuffer(rel, data);
    offset = end + 1 + size + 1;
  }
  currentBlob = "";
  console.log(`Reachable history: ${commits.length} commits; ${objects.size} unique blobs; ${reviewedBinaryCount} immutable binary review exceptions. Scope: locally available refs only.`);
}
const args = process.argv.slice(2);
if (args.some(arg => arg !== "--history")) { console.error("Unknown scanner option."); process.exit(2); }
try {
  if (args.includes("--history")) history();
  else {
    walk(root);
    // Tracked artifacts cannot hide behind directory exclusions such as dist/.
    const tracked = spawnSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" });
    if (tracked.status === 0) for (const rel of tracked.stdout.split("\0").filter(Boolean)) {
      if (rel.split("/").some(part => ignoredDirs.has(part))) {
        const file = path.join(root, rel);
        if (fs.lstatSync(file).isSymbolicLink()) { incomplete += 1; continue; }
        scan(file);
      }
    }
  }
} catch (error) {
  console.error(error instanceof Error && /history|blob|Git|Shallow|reachable/i.test(error.message) ? error.message : "Scan incomplete (details omitted).");
  incomplete += 1;
}
if (failures > 0) process.exit(1);
if (incomplete > 0) process.exit(2);
console.log("No secrets detected. This is a bounded scan, not proof of absence.");
