# Release

## Current State

- `2.0.0-rc.1` is the active release-candidate baseline;
- the candidate is merged on `main`;
- the tag `v2.0.0-rc.1` does not exist yet;
- real deploy remains blocked unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.

## Candidate Flow

1. close issue `#5` by refreshing pinned GitHub Actions revisions;
2. close issue `#6` by enforcing branch protection and required review on `main`;
3. confirm green CI on `main`;
4. confirm changelog and review evidence still match the current repository state;
5. create tag `v2.0.0-rc.1`;
6. publish release notes from `CHANGELOG.md` and `docs/REVIEW.md`.

## Rollback

- delete the tag if publication was premature;
- revert the release-candidate commit if the baseline itself is invalid;
- restore backed-up adapter files if a future adapter publication regresses local installs;
- do not run a deploy unless `AGENTOS_DEPLOY_COMMAND` is explicitly configured and approved.
