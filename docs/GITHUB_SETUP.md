# GitHub Setup

Target repository: `provedorconsult/AgentOS`

## Current State

- repository exists;
- default branch is `main`;
- no pull request is open at the moment;
- `main` has a green `AgentOS CI` run after the audit-hardening merge;
- release-candidate work should happen through feature branches and pull requests;
- branch protection is not enforced yet on `main`;
- the tag `v2.0.0-rc.1` has not been created yet.

## Open Governance Items

- issue `#5`: refresh pinned GitHub Actions to Node 24-native revisions;
- issue `#6`: enforce branch protection and required review on `main`.

## Publication Flow

1. create a branch from `main`;
2. run `npm run doctor`, `npm run validate`, `npm test` and `git diff --check`;
3. push the branch;
4. open a PR with Summary, Verification, Risks, Migration, Rollback and Files Changed;
5. wait for green checks and an actual required review policy on `main`;
6. close issues `#5` and `#6`;
7. tag the approved release candidate when governance gates are satisfied.
