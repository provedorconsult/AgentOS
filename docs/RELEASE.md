# Release

## Candidate Flow

1. open a PR from a scoped implementation branch;
2. run the pull-request CI path and require `quality-gate`;
3. keep `npm run audit:pr` in PR CI and run `npm run audit:release` before tags or prereleases;
4. require `npm run validate:scope` for implementation changes;
5. require harness discovery through `npm run validate:templates`;
6. require explicit owner approval in the task, PR, or review context;
7. merge with squash-only after `quality-gate` passes;
8. delete the source branch after merge;
9. create the next unused `v2.0.0-rc.N` annotated tag only for a formal release;
10. publish a GitHub prerelease from `CHANGELOG.md` and `docs/REVIEW.md` only after the release audit passes.

AgentOS is currently maintained by the repository owner. Owner-approved merge is allowed when all required checks pass. Required reviews are disabled until an eligible independent reviewer exists and is explicitly requested. Administrative bypass should not be used for normal development flow; keep required checks enabled and keep the merge path available to the owner.

## Required Checks

- `quality-gate`: required.
- CI Windows and CI Ubuntu: required by `quality-gate` for code, workflow, script and harness changes.
- Docs-only validation: selected by `quality-gate` for documentation-only changes.
- Pull-request dependency audit: `npm run audit:pr`.
- Release dependency audit: `npm run audit:release` before tag or prerelease.
- Scope validation: required for implementation changes.
- Sprint discovery: required for implementation changes.
- Branch protection: required.
- Required reviews are disabled for owner-maintained flow.
- Owner-approved merge: allowed after required checks pass.
- Auto-merge: enabled.
- Update branch: enabled.
- Squash-only merge: required.
- Clean worktree: required.
- Changelog and REVIEW: required.
- Tag and prerelease: release-only after all prior gates pass.

## Rollback

- revert the release-candidate commit or restore backed-up adapter files;
- do not run a deploy unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.
