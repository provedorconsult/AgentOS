# Release

## Candidate Flow

1. green CI on Windows and Linux;
2. branch protection and required checks confirmed on `main`;
3. `npm audit --audit-level=moderate`;
4. `npm run validate:scope`;
5. harness discovery through `npm run validate:templates`;
6. owner approval is explicit in the task or PR context;
7. clean worktree;
8. changelog and review evidence updated;
9. create the next unused `v2.0.0-rc.N` annotated tag;
10. publish a GitHub prerelease from `CHANGELOG.md` and `docs/REVIEW.md`.

AgentOS is currently maintained by the repository owner. Owner-approved merge is allowed when all required checks pass and branch protection does not require an independent reviewer. Administrative bypass should not be used for normal development flow; instead, keep required checks enabled and remove the required-review rule when no eligible reviewer exists.

## Required Checks

- CI Windows: required.
- CI Ubuntu: required.
- Dependency audit: required.
- Scope validation: required.
- Sprint discovery: required.
- Branch protection: required.
- Formal review: optional unless an eligible reviewer is available and explicitly requested.
- Owner-approved merge: allowed after required checks pass.
- Clean worktree: required.
- Changelog and REVIEW: required.
- Tag and prerelease: release-only after all prior gates pass.

## Rollback

- revert the release-candidate commit or restore backed-up adapter files;
- do not run a deploy unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.
