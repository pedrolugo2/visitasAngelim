#!/usr/bin/env bash
# Postdeploy script: restores functions/package.json back to the workspace
# wildcard reference after Firebase deploy is complete.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FUNCTIONS_PKG="$REPO_ROOT/packages/functions/package.json"

echo "==> Restoring functions/package.json to workspace reference..."
sed -i 's|"@visitas-angelim/shared": "file:[^"]*"|"@visitas-angelim/shared": "*"|' "$FUNCTIONS_PKG"
echo "==> Done."
