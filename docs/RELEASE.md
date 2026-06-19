# Release

## Candidate Flow

1. green CI on Windows and Linux;
2. required review on the PR;
3. changelog and review evidence updated;
4. create tag `v2.0.0-rc.1`;
5. publish release notes from `CHANGELOG.md` and `docs/REVIEW.md`.

## Rollback

- revert the release-candidate commit or restore backed-up adapter files;
- do not run a deploy unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.
