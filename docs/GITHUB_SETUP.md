# GitHub Setup

Target repository: `provedorconsult/AgentOS`

## Current State

- repository exists;
- default branch is `main`;
- release-candidate work should happen through feature branches and pull requests;
- CI must be green on Windows and Linux before merge.

## Publication Flow

1. create a branch from `main`;
2. run `npm run doctor`, `npm run validate`, `npm test` and `git diff --check`;
3. push the branch;
4. open a PR with Summary, Verification, Risks, Migration, Rollback and Files Changed;
5. wait for required review and green checks;
6. tag the approved release candidate when governance gates are satisfied.
