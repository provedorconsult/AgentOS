#!/usr/bin/env bash
# Independent scanner; do not publish raw findings or validate credentials.
set -euo pipefail
scan_tmp="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/agentos-gitleaks.XXXXXX")"
trap 'rm -rf "$scan_tmp"' EXIT
curl -fsSL --max-time 60 \
  https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz \
  -o "$scan_tmp/gitleaks.tar.gz"
python3 - "$scan_tmp/gitleaks.tar.gz" <<'PY'
import hashlib, pathlib, sys
assert hashlib.sha256(pathlib.Path(sys.argv[1]).read_bytes()).hexdigest() == '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb', 'Scanner checksum mismatch'
PY
tar -xzf "$scan_tmp/gitleaks.tar.gz" -C "$scan_tmp" gitleaks
set +e
"$scan_tmp/gitleaks" git . --log-opts='--all --full-history -m' --redact=100 --no-banner > "$scan_tmp/result.log" 2>&1
scan_status=$?
set -e
if [ "$scan_status" -ne 0 ]; then
  echo 'Independent secret scan failed or was incomplete; review privately. Values and raw report omitted.' >&2
  exit "$scan_status"
fi
echo 'Gitleaks 8.30.1: no findings in locally reachable history. Not proof of absence.'
