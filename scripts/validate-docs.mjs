#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const requiredDocs = [
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/TROUBLESHOOTING.md",
  "docs/RELEASE.md",
  "docs/MIGRATION.md"
];

let failures = 0;
for (const file of requiredDocs) {
  if (!fs.existsSync(file)) {
    console.error(`missing documentation file: ${file}`);
    failures += 1;
  }
}

if (fs.existsSync("docs/GITHUB_SETUP.md")) {
  const githubSetup = fs.readFileSync("docs/GITHUB_SETUP.md", "utf8");
  const obsoletePatterns = [
    /connector must be authorized/i,
    /create an empty public GitHub repository/i,
    /still needs to be published/i
  ];
  for (const pattern of obsoletePatterns) {
    if (pattern.test(githubSetup)) {
      console.error(`docs/GITHUB_SETUP.md: obsolete text matches ${pattern}`);
      failures += 1;
    }
  }
}

if (fs.existsSync("docs/INDEX.md")) {
  const docsIndex = fs.readFileSync("docs/INDEX.md", "utf8");
  for (const label of ["TROUBLESHOOTING", "RELEASE", "MIGRATION"]) {
    if (!docsIndex.includes(label)) {
      console.error(`docs/INDEX.md: missing ${label}`);
      failures += 1;
    }
  }
}

if (fs.existsSync("docs/REVIEW.md")) {
  const review = fs.readFileSync("docs/REVIEW.md", "utf8");
  for (const column of ["Command", "Environment", "Exit Code", "Result", "Evidence", "Criterion", "Limitations", "Residual Risk"]) {
    if (!review.includes(column)) {
      console.error(`docs/REVIEW.md: missing review evidence column ${column}`);
      failures += 1;
    }
  }
}

const markdownFiles = ["README.md", ...fs.readdirSync("docs").filter((entry) => entry.endsWith(".md")).map((entry) => path.join("docs", entry))];
const markdownLinkPattern = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)([^)]+)\)/g;
for (const file of markdownFiles) {
  const text = fs.readFileSync(file, "utf8");
  let match;
  while ((match = markdownLinkPattern.exec(text)) !== null) {
    const target = match[1].split("#")[0];
    if (target.length === 0) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) {
      console.error(`${file}: broken relative link ${target}`);
      failures += 1;
    }
  }
}

if (failures > 0) process.exit(1);
console.log("AgentOS documentation validation passed.");
