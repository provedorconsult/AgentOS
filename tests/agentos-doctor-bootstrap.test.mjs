import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const repoRoot = process.cwd();

test("doctor fails with an npm ci hint when pinned dependencies are missing", () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "doctor-bootstrap-"));
  fs.mkdirSync(path.join(target, "scripts", "lib"), { recursive: true });
  fs.copyFileSync(path.join(repoRoot, "scripts", "doctor.mjs"), path.join(target, "scripts", "doctor.mjs"));
  for (const entry of fs.readdirSync(path.join(repoRoot, "scripts", "lib"))) {
    fs.copyFileSync(path.join(repoRoot, "scripts", "lib", entry), path.join(target, "scripts", "lib", entry));
  }

  const result = spawnSync("node", [path.join(target, "scripts", "doctor.mjs")], { cwd: target, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing pinned dependencies/);
  assert.match(result.stderr, /npm ci/);
  assert.doesNotMatch(result.stderr, /ERR_MODULE_NOT_FOUND/);
});

test("doctor keeps passing when pinned dependencies are installed", () => {
  const result = spawnSync("node", ["scripts/doctor.mjs"], { cwd: repoRoot, encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /AgentOS doctor passed\./);
});
