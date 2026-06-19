# Release

## Candidate Flow

1. green CI on Windows and Linux;
2. branch protection and required checks confirmed on `main`;
3. formal `APPROVE` review on the PR;
4. changelog and review evidence updated;
5. create the next unused `v2.0.0-rc.N` tag;
6. publish a GitHub prerelease from `CHANGELOG.md` and `docs/REVIEW.md`.

If the repository has no eligible external reviewer, an administrative merge is allowed only with explicit owner authorization, proof that the approval rule blocked the merge first, immediate restoration of the rule, and an accurate record in `docs/REVIEW.md`. This exception does not count as a formal review.

## Rollback

- revert the release-candidate commit or restore backed-up adapter files;
- do not run a deploy unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.
