#!/usr/bin/env sh
# POSIX shim for the Windows hook check-no-secrets.ps1; both delegate to the canonical Node scanner.
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$root"
exec node scripts/validate-no-secrets.mjs
