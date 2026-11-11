import { parseDocument } from 'yaml';

export function validateWorkflowSecurity(text) {
  const errors = [];
  const doc = parseDocument(text, { uniqueKeys: true, strict: true });
  if (doc.errors.length) return ['invalid workflow YAML'];
  const data = doc.toJS();
  if (!data || typeof data !== 'object') return ['workflow must be a mapping'];
  if (!data.permissions || data.permissions.contents !== 'read') errors.push('workflow must declare contents: read');
  const checkPermissions = permissions => {
    if (typeof permissions !== 'object' || !permissions || Object.values(permissions).some(v => !['read', 'none'].includes(v))) errors.push('write or broad token permissions require a separate reviewed policy');
  };
  if (data.permissions) checkPermissions(data.permissions);
  const events = typeof data.on === 'string' ? [data.on] : Array.isArray(data.on) ? data.on : Object.keys(data.on ?? {});
  if (events.includes('pull_request_target') || events.includes('workflow_run')) errors.push('privileged cross-trust trigger is not permitted by this repository policy');
  for (const job of Object.values(data.jobs ?? {})) {
    if (job.permissions) checkPermissions(job.permissions);
    if (!Number.isInteger(job['timeout-minutes']) || job['timeout-minutes'] <= 0) errors.push('job timeout required');
    for (const step of job.steps ?? []) {
      if (step.uses && !/^[\w.-]+\/[\w./-]+@[a-f0-9]{40}$/.test(step.uses)) errors.push('action must be pinned by immutable SHA');
      if (step.uses?.startsWith('actions/checkout@') && step.with?.['persist-credentials'] !== false) errors.push('checkout must not persist credentials');
      if (typeof step.run === 'string' && /\$\{\{[^}]*\b(?:inputs\.|github\.event\.)/.test(step.run)) errors.push('untrusted event/input must be passed as data, not interpolated into shell');
    }
  }
  return errors;
}
