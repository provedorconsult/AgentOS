import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

test("architecture 2.0 is published as the canonical source", () => {
  const spec = read("docs/SPEC.md");
  const plan = read("docs/PLAN.md");
  const architecture = read("docs/ARCHITECTURE.md");
  const index = read("docs/INDEX.md");

  assert.match(spec, /canonical source/i);
  assert.match(spec, /architecture 2\.0/i);
  assert.match(plan, /canonical source/i);
  assert.match(architecture, /^# AgentOS Architecture 2\.0/m);
  assert.match(architecture, /Canonical Source/i);
  assert.match(index, /Architecture 2\.0/i);
});

test("project .codex layer has no drift from the canonical codex-layer", () => {
  assert.equal(read(".codex/config.toml"), read("codex-layer/config.toml"));
});

test("deploy script fails closed unless a real deployment command is configured", () => {
  const result = spawnSync(
    "node",
    ["scripts/deploy.mjs"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /AGENTOS_DEPLOY_COMMAND/);
  assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /placeholder/i);
});

test("secret scanner passes on repository placeholders and canonical secret rules", () => {
  const result = spawnSync(
    "node",
    ["scripts/validate-no-secrets.mjs"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /No secrets detected\./);
});
