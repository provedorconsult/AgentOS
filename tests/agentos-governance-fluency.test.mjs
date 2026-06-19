import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("CI exposes a single quality gate with path-aware docs-only validation", () => {
  const ci = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.match(ci, /\bquality-gate:/);
  assert.match(ci, /\bchanges:/);
  assert.match(ci, /\bdocs_only:/);
  assert.match(ci, /npm run validate:docs-only/);
  assert.match(ci, /npm run audit:pr/);
  assert.match(ci, /needs:\s*\[changes, validate, docs_only\]/);
  assert.doesNotMatch(ci, /npm audit --audit-level=moderate/);
});

test("legacy checklist workflow is removed from the required status surface", () => {
  assert.equal(fs.existsSync(".github/workflows/agent-review.yml"), false);
  const ci = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.doesNotMatch(ci, /\bchecklist:/);
});

test("package scripts split pull-request and release audit surfaces", () => {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.equal(pkg.scripts["audit:pr"], "npm audit --audit-level=high");
  assert.equal(pkg.scripts["audit:release"], "npm audit --audit-level=moderate");
  assert.match(pkg.scripts["validate:docs-only"], /npm run doctor/);
  assert.match(pkg.scripts["validate:docs-only"], /npm run validate:docs/);
  assert.match(pkg.scripts["validate:docs-only"], /npm run validate:license/);
});

test("release audit remains enforced outside the pull-request fast path", () => {
  const audit = fs.readFileSync(".github/workflows/security-audit.yml", "utf8");
  assert.match(audit, /npm run audit:release/);
  assert.match(audit, /schedule:/);
  assert.match(audit, /workflow_dispatch:/);
});

test("review and release docs describe owner-merge governance without stale blockers", () => {
  const release = fs.readFileSync("docs/RELEASE.md", "utf8");
  const review = fs.readFileSync("docs/REVIEW.md", "utf8");
  const combined = `${release}\n${review}`;
  assert.match(combined, /quality-gate/i);
  assert.match(combined, /owner-approved merge/i);
  assert.match(combined, /required reviews? (is|are) disabled/i);
  assert.match(combined, /auto-merge/i);
  assert.match(combined, /update branch/i);
  assert.match(combined, /squash-only/i);
  assert.doesNotMatch(combined, /checklist status/i);
  assert.doesNotMatch(combined, /conversation resolution is clean/i);
});
