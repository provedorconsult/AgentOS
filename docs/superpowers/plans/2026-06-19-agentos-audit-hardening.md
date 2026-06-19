# AgentOS Audit Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining short-horizon P0/P1 gaps from the 2026-06-19 audit without adding new product scope or performing a real deploy.

**Architecture:** Keep `docs/ARCHITECTURE.md` as the top-level contract, keep `codex-layer/` as the canonical Codex source, centralize mechanical checks in Node-based validators, and treat workflows/adapters/docs/license as contract surfaces validated by tests and dedicated commands. Execution stays local, file-first, and reversible.

**Tech Stack:** Node.js 22+, `node:test`, PowerShell compatibility wrappers, GitHub Actions YAML, JSON harness files, Markdown docs

---

### Task 1: Replace the legacy CI gate with canonical multi-OS validation

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/deploy.yml`
- Test: `tests/agentos-2-contracts.test.mjs`

- [ ] **Step 1: Write the failing tests**

```javascript
test("ci workflow runs the canonical validation matrix", () => {
  const ci = read(".github/workflows/ci.yml");

  assert.match(ci, /ubuntu-latest/);
  assert.match(ci, /windows-latest/);
  assert.match(ci, /npm run doctor/);
  assert.match(ci, /npm run validate/);
  assert.match(ci, /git diff --check/);
  assert.doesNotMatch(ci, /validate\.ps1/);
});

test("deploy workflow is contract-only until a real target exists", () => {
  const deploy = read(".github/workflows/deploy.yml");

  assert.match(deploy, /environment:\s*\$\{\{\s*inputs\.environment\s*\}\}/);
  assert.match(deploy, /scripts\/deploy\.ps1/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: FAIL on missing Linux matrix and legacy PowerShell gate usage.

- [ ] **Step 3: Write minimal implementation**

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
steps:
  - uses: actions/checkout@<sha>
  - uses: actions/setup-node@<sha>
    with:
      node-version: 22
  - run: npm run doctor
  - run: npm run validate
  - run: git diff --check
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: PASS for CI and deploy workflow assertions.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/deploy.yml tests/agentos-2-contracts.test.mjs
git commit -m "test: harden ci workflow contracts"
```

### Task 2: Rebuild adapter installation around canonical mappings and backup safety

**Files:**
- Modify: `scripts/agentos-install-adapter.mjs`
- Modify: `adapters/codex/README.md`
- Modify: `adapters/codex/mapping.yaml`
- Modify: `adapters/generic-ide/README.md`
- Modify: `adapters/generic-ide/mapping.yaml`
- Modify: `.gitignore`
- Test: `tests/agentos-2-contracts.test.mjs`

- [ ] **Step 1: Write the failing tests**

```javascript
test("codex adapter installs from codex-layer without drift and supports dry-run", () => {
  const result = spawnSync("node", [
    "scripts/agentos-install-adapter.mjs",
    "codex",
    "--target",
    tempTarget,
    "--dry-run"
  ], { encoding: "utf8" });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /codex-layer/);
  assert.ok(!fs.existsSync(path.join(tempTarget, ".codex", "config.toml")));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: FAIL because installer copies `adapters/codex/templates/.codex` directly and lacks target-aware E2E behavior.

- [ ] **Step 3: Write minimal implementation**

```javascript
const adapterDefinitions = {
  codex: {
    copies: [
      { from: "codex-layer", to: ".codex" },
      { from: "adapters/codex/templates/AGENTS.md", to: "AGENTS.md" }
    ]
  },
  "generic-ide": {
    copies: [
      { from: "adapters/generic-ide/templates/AGENTS.md", to: "AGENTS.md" },
      { from: "adapters/generic-ide/templates/IDE_AGENT_GUIDE.md", to: "IDE_AGENT_GUIDE.md" }
    ]
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: PASS for codex/generic adapter dry-run, backup, idempotence and no-drift checks.

- [ ] **Step 5: Commit**

```bash
git add scripts/agentos-install-adapter.mjs adapters/codex/README.md adapters/codex/mapping.yaml adapters/generic-ide/README.md adapters/generic-ide/mapping.yaml .gitignore tests/agentos-2-contracts.test.mjs
git commit -m "feat: harden adapter installation contracts"
```

### Task 3: Enforce harness, state, range, workflow and metadata contracts

**Files:**
- Modify: `scripts/doctor.mjs`
- Modify: `scripts/validate-sprint-json.mjs`
- Modify: `scripts/validate-context-ranges.mjs`
- Create: `scripts/validate-state.mjs`
- Create: `scripts/validate-workflows.mjs`
- Create: `scripts/validate-adapters.mjs`
- Create: `scripts/validate-docs.mjs`
- Create: `scripts/validate-license.mjs`
- Modify: `package.json`
- Modify: `.harness/templates/task.json`
- Modify: `.harness/templates/sprint.json`
- Modify: `.harness/current.txt`
- Modify: `.harness/project-state.json`
- Create: `.harness/sprints/2026-06-19-agentos-audit-hardening.json`
- Test: `tests/agentos-2-contracts.test.mjs`

- [ ] **Step 1: Write the failing tests**

```javascript
test("validate command chains doctor, state, workflows, adapters, docs and license checks", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.match(pkg.scripts.validate, /npm run doctor/);
  assert.match(pkg.scripts.validate, /validate:state/);
  assert.match(pkg.scripts.validate, /validate:workflows/);
  assert.match(pkg.scripts.validate, /validate:adapters/);
  assert.match(pkg.scripts.validate, /validate:docs/);
  assert.match(pkg.scripts.validate, /validate:license/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: FAIL because current scripts and templates do not enforce those contracts.

- [ ] **Step 3: Write minimal implementation**

```javascript
"validate": "npm run doctor && npm run validate:templates && npm run validate:context && npm run validate:state && npm run validate:secrets && npm run validate:workflows && npm run validate:adapters && npm run validate:docs && npm run validate:license && npm test"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: PASS for package scripts, current pointer, state, workflow manifest and template range assertions.

- [ ] **Step 5: Commit**

```bash
git add scripts/doctor.mjs scripts/validate-sprint-json.mjs scripts/validate-context-ranges.mjs scripts/validate-state.mjs scripts/validate-workflows.mjs scripts/validate-adapters.mjs scripts/validate-docs.mjs scripts/validate-license.mjs package.json .harness/templates/task.json .harness/templates/sprint.json .harness/current.txt .harness/project-state.json .harness/sprints/2026-06-19-agentos-audit-hardening.json tests/agentos-2-contracts.test.mjs
git commit -m "feat: enforce harness and metadata contracts"
```

### Task 4: Harden secret scanning and portability without adding dependencies

**Files:**
- Modify: `scripts/validate-no-secrets.mjs`
- Modify: `tests/agentos-2-contracts.test.mjs`
- Modify: `.env.example`
- Modify: `docs/SECURITY.md`
- Create: `SECURITY.md`

- [ ] **Step 1: Write the failing tests**

```javascript
test("secret scanner evaluates .env.example placeholders without flagging safe examples", () => {
  const scanner = read("scripts/validate-no-secrets.mjs");

  assert.doesNotMatch(scanner, /ignoredFiles\s*=.*\.env\.example/);
  assert.match(scanner, /JWT|Slack|Discord|Telegram|Google/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: FAIL because `.env.example` is currently ignored and coverage is incomplete.

- [ ] **Step 3: Write minimal implementation**

```javascript
const placeholderAllowlist = [
  "sk-example-openai-key",
  "ghp_example_github_token",
  "replace-me"
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: PASS for scanner coverage, `.env.example` handling and security policy documentation.

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-no-secrets.mjs tests/agentos-2-contracts.test.mjs .env.example docs/SECURITY.md SECURITY.md
git commit -m "feat: harden secret scanning rules"
```

### Task 5: Reconcile docs, license, versioning and release-candidate artifacts

**Files:**
- Modify: `README.md`
- Modify: `docs/GITHUB_SETUP.md`
- Modify: `docs/INDEX.md`
- Create: `CHANGELOG.md`
- Create: `CONTRIBUTING.md`
- Create: `docs/TROUBLESHOOTING.md`
- Create: `docs/RELEASE.md`
- Create: `docs/MIGRATION.md`
- Modify: `docs/REVIEW.md`
- Modify: `docs/SPEC.md`
- Modify: `docs/PLAN.md`
- Modify: `package.json`
- Test: `tests/agentos-2-contracts.test.mjs`

- [ ] **Step 1: Write the failing tests**

```javascript
test("package metadata and docs agree on MIT, private package and Node 22+", () => {
  const pkg = JSON.parse(read("package.json"));
  const readme = read("README.md");

  assert.equal(pkg.license, "MIT");
  assert.equal(pkg.private, true);
  assert.equal(pkg.engines.node, ">=22");
  assert.match(readme, /AgentOS 2\.0\.0/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: FAIL because metadata and release docs are incomplete.

- [ ] **Step 3: Write minimal implementation**

```json
{
  "private": true,
  "license": "MIT",
  "engines": {
    "node": ">=22"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/agentos-2-contracts.test.mjs`
Expected: PASS for metadata, required docs and review evidence structure.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/GITHUB_SETUP.md docs/INDEX.md CHANGELOG.md CONTRIBUTING.md docs/TROUBLESHOOTING.md docs/RELEASE.md docs/MIGRATION.md docs/REVIEW.md docs/SPEC.md docs/PLAN.md package.json tests/agentos-2-contracts.test.mjs
git commit -m "docs: reconcile release candidate contracts"
```
