#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", ".venv", "dist", "build", ".next", "coverage", "vendor"]);
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
const safePlaceholderPatterns = [
  /^OPENAI_API_KEY=$/m,
  /^GITHUB_TOKEN=$/m,
  /sk-example-openai-key/,
  /ghp_example_github_token/,
  /replace-me/i,
  /xxxxxxxx/i
];

function scan(file) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (path.basename(file) === ".env") {
    console.error(`${rel}: real .env files are not allowed`);
    failures += 1;
    return;
  }
  const text = fs.readFileSync(file, "utf8");
  for (const [pattern, label] of patterns) {
    if (pattern.test(text) && !safePlaceholderPatterns.some((placeholder) => placeholder.test(text))) {
      console.error(`${rel}: possible ${label}`);
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
