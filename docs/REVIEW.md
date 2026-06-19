# REVIEW

## Current Release Candidate

- Package metadata: `2.0.0-rc.1`.
- Formal prerelease: not published.
- Release decision: ready for owner-approved merge after branch protection removes required review and required checks remain green.

## Current Commit

- Base commit: `d190752ea30eb25ace03f0af84d795186034ac67`.
- Base source: merge commit for PR #8, `fix: close AgentOS post-audit findings`.
- Working branch: `fix/agentos-rc-final-hardening`.
- Published head before governance evidence update: `163b0447bcb57a486be533fadf914dcf039dccd9`.

## Current Pull Request

- PR: [#11](https://github.com/provedorconsult/AgentOS/pull/11).
- PR author: `provedorconsult`.
- Review decision before governance change: `REVIEW_REQUIRED`.
- Merge state before governance change: `BLOCKED`.
- Merge commit: pending.
- Tag: not created.
- GitHub prerelease: not created.

## Governance

- `main` branch protection must require Ubuntu and Windows validation checks plus checklist status.
- Required review is disabled while the repository has only the owner as eligible maintainer.
- Owner-approved merge is allowed after required checks pass and conversation resolution is clean.
- Administrative bypass remains unnecessary for normal development flow.
- Issue [#12](https://github.com/provedorconsult/AgentOS/issues/12) is superseded by this governance policy change.
- PR #7 and PR #8 remain historical evidence only.

## CI Evidence

- PR checks before governance evidence update:
  - checklist: passed, run `27834630266`.
  - AgentOS CI: passed, run `27834630272`.
  - `validate (ubuntu-latest)`: passed, job `82379573516`.
  - `validate (windows-latest)`: passed, job `82379573530`.
- CI executed `npm ci`, dependency audit, doctor, validate, diff hygiene and clean-worktree checks.

## Local Verification

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| `node --version` | Windows local | 0 | `v24.15.0` | Node runtime available. | Runtime prerequisite. | Local host only. | None. |
| `npm --version` | Windows local | 0 | `11.12.1` | npm runtime available. | Package manager prerequisite. | Local host only. | None. |
| `npm ci` with repo-local npm cache | Windows local | 0 | Dependencies installed. | Default npm cache returned EPERM; repo-local cache succeeded. | Reproducible install. | Local cache workaround. | None after workaround. |
| `npm audit --audit-level=moderate` | Windows local | 0 | `found 0 vulnerabilities`. | Moderate-or-higher audit clean. | Dependency audit. | Current dependency graph only. | None known. |
| `npm run doctor` | Windows local | 0 | AgentOS doctor passed. | Required files and prerequisites present. | Doctor gate. | Local host only. | None known. |
| `npm run validate` | Windows local | 0 | Final validation passed. | Doctor, discovery, context, state, secrets, scope, workflows, adapters, docs, license and tests passed. | Complete local validation. | Local host only. | None known. |
| `npm test` | Windows local | 0 | `38` tests passed. | Edit-scope, harness discovery and extended secret scanner regressions passed. | Test suite. | Node test suite only. | None known. |
| `git diff --check` | Windows local | 0 | Final whitespace check passed. | No whitespace errors. | Diff hygiene. | Local diff only. | None known. |
| `gh pr checks 11 --repo provedorconsult/AgentOS` | GitHub Actions | 0 | Checklist, Ubuntu and Windows passed before governance policy update. | Cross-platform CI green for PR #11 head `13f188e`. | A docs-only governance policy commit requires a refreshed check run after push. | None if checks remain green. |
| `gh api repos/provedorconsult/AgentOS/branches/main/protection` | GitHub API | 0 | Strict checks, one approval, last-push approval, admin enforcement, force-push/deletion disabled before policy update. | Branch protection readback. | Must remove required review to align with owner-merge policy. | None after readback confirms review rule removed. |

## Negative Tests

- Edit-scope test coverage rejects undeclared extra files, undeclared renames, wrong create/delete/modify actions, traversal paths and absolute paths.
- Harness discovery test coverage rejects invalid JSON, duplicate sprint ids, invalid archive files, current pointers to archive files, unknown template JSON and invalid templates.
- Secret scanner test coverage rejects special-character assignments, base64-like values, YAML assignments, JSON assignments, Markdown assignments and comment assignments.
- Existing negative coverage still rejects false-success evidence, path escapes, invalid schema values, YAML type bypasses and secret occurrence masking.

## Scope Validation

- Validator: `scripts/validate-edit-scope.mjs`.
- Default base: merge-base of `HEAD` and `origin/main`; fallback is `HEAD` when `origin/main` is unavailable.
- Scope source: `.harness/project-state.json` current sprint, then last verified sprint, then `.harness/current.txt`.
- Required contract: every changed file must match `task.files[]` action unless explicitly allowed by `scopePolicy`.
- Current sprint exceptions: `docs/REVIEW.md`, `.harness/current.txt`, `.harness/project-state.json`.
- Latest local scope result: passed with `21` changed path records.

## Dependency Audit

- `npm audit --audit-level=moderate` is required locally and in CI.
- Current baseline result: zero moderate-or-higher vulnerabilities.

## Security

- Secret scanner now parses `NAME=VALUE`, `NAME: VALUE` and JSON-style `"NAME": "VALUE"` assignments.
- Sensitive names include password, secret, token, API key, private key, access token and client secret variants.
- Diagnostics redact values and preserve placeholder allowlists such as `REPLACE_ME`, `${VAR}`, `<token>` and `YOUR_TOKEN_HERE`.
- Optional history command: `npm run validate:secrets:history`. It is intentionally documented as a conservative local scan and does not claim unreachable-object coverage.

## Residual Risks

- Independent formal review is optional until an eligible reviewer exists; owner-approved merge is the active governance path.
- Tag and GitHub prerelease remain blocked until formal review and CI complete.
- Real deploy remains intentionally fail-closed without `AGENTOS_DEPLOY_COMMAND`.

## Release Decision

`READY FOR OWNER MERGE` after required checks are green and branch protection confirms required reviews are disabled.
