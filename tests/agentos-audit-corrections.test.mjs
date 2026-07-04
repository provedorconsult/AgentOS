import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

test("posix hook shims delegate to the canonical node validators", () => {
  const secrets = read("codex-layer/hooks/check-no-secrets.sh");
  assert.match(secrets, /^#!\/usr\/bin\/env sh/m);
  assert.match(secrets, /node scripts\/validate-no-secrets\.mjs/);

  const execPlan = read("codex-layer/hooks/check-exec-plan.sh");
  assert.match(execPlan, /^#!\/usr\/bin\/env sh/m);
  assert.match(execPlan, /docs\/EXEC_PLANS\/active/);

  const result = spawnSync("sh", ["codex-layer/hooks/check-no-secrets.sh"], { encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /No secrets detected\./);
});

test("health and review workflows use the canonical doctor and pinned actions", () => {
  const health = read(".github/workflows/environment-health.yml");
  const review = read(".github/workflows/agent-review.yml");

  assert.match(health, /npm ci/);
  assert.match(health, /npm run doctor/);
  assert.doesNotMatch(health, /doctor\.ps1/);
  for (const workflow of [health, review]) {
    for (const match of workflow.matchAll(/uses:\s*\S+@(\S+)/g)) {
      assert.match(match[1], /^[0-9a-f]{40}$/, `action not pinned by SHA: ${match[0]}`);
    }
  }
});

test("instruction surfaces stay aligned and legacy material is fenced", () => {
  const validateAdapters = read("scripts/validate-adapters.mjs");
  assert.match(validateAdapters, /Source Order/);

  assert.ok(!fs.existsSync("scripts/doctor.ps1"));
  assert.ok(!fs.existsSync("scripts/validate.ps1"));
  assert.ok(!fs.existsSync("docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx"));
  assert.ok(!fs.existsSync("docs/SECURITY.md"));
  assert.ok(fs.existsSync("docs/SECURITY_GUARDRAILS.md"));
  assert.ok(fs.existsSync("docs/legacy/README.md"));
  assert.match(read("docs/legacy/OPERATING_MODEL.md"), /^> \*\*LEGACY/);
  assert.match(read("scripts/legacy/bootstrap-project.ps1"), /^# DEPRECATED/);
});
