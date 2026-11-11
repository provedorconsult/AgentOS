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

This owner-approved merge policy is a temporary governance exception, not a target state. When a second eligible maintainer exists, required review must be re-enabled for `main`. Automated agent review may complement human review but never replaces it for merges to `main` or release publication.

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

## Contexto histórico preservado da PR #20

O trecho abaixo descreve o estado observado na PR #20, não o estado atual. Consulte [coordenação/governança](security-audit/COORDINATION_GOVERNANCE.md) para protected=true, revisão mínima zero e bypass ainda não comprovado. Os gates atuais de Checker/autorização continuam obrigatórios para esta entrega.

## Observed enforcement gap — F0-AUD-003

On 2026-11-11, main at `e2eedcc6249e08c389aef6282bcb13ae40d2f76a` reports `protected=false`. The policy above remains required but is not proven enforced. The integration cannot read or change detailed protection (HTTP 403, no administration permission). [The remediation record](F0-AUD-003.md) specifies the administrative gate. Do not merge, tag or publish a release while the required protection is unverified.
