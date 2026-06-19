# Release

## Candidate Flow

1. green CI on Windows and Linux;
2. branch protection and required checks confirmed on `main`;
3. `npm audit --audit-level=moderate`;
4. `npm run validate:scope`;
5. harness discovery through `npm run validate:templates`;
6. formal `APPROVE` review on the PR;
7. clean worktree;
8. changelog and review evidence updated;
9. create the next unused `v2.0.0-rc.N` annotated tag;
10. publish a GitHub prerelease from `CHANGELOG.md` and `docs/REVIEW.md`.

For final RC hardening, an administrative merge is not an acceptable substitute for formal review. If the repository has no eligible external reviewer, mark the release decision `BLOCKED`, do not merge, do not tag and do not publish a prerelease.

## Required Checks

- CI Windows: required.
- CI Ubuntu: required.
- Dependency audit: required.
- Scope validation: required.
- Sprint discovery: required.
- Branch protection: required.
- Formal review: required.
- Clean worktree: required.
- Changelog and REVIEW: required.
- Tag and prerelease: release-only after all prior gates pass.

## Rollback

- revert the release-candidate commit or restore backed-up adapter files;
- do not run a deploy unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.
