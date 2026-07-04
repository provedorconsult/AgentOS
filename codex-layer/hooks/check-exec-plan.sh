#!/usr/bin/env sh
# POSIX shim for the Windows hook check-exec-plan.ps1; same advisory behavior.
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$root"
plans=$(find docs/EXEC_PLANS/active -type f ! -name ".gitkeep" 2>/dev/null || true)
if [ -n "$plans" ]; then
  echo "Active execution plans present:"
  printf '%s\n' "$plans" | while IFS= read -r plan; do
    echo "- $(basename "$plan")"
  done
else
  echo "No active execution plan found. For substantial work, create one from templates/EXEC_PLAN.md."
fi
