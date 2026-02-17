#!/usr/bin/env bash
# Predeploy script: builds and packs @visitas-angelim/shared into a tarball
# that can be installed by Firebase Cloud Build as a local file dependency.
# It also patches functions/package.json to reference the tarball instead of
# the workspace wildcard, since Cloud Build has no workspace context.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHARED_DIR="$REPO_ROOT/packages/shared"
FUNCTIONS_DIR="$REPO_ROOT/packages/functions"
FUNCTIONS_PKG="$FUNCTIONS_DIR/package.json"

echo "==> Building @visitas-angelim/shared..."
npm run build -w packages/shared

echo "==> Packing @visitas-angelim/shared..."
TARBALL=$(cd "$SHARED_DIR" && npm pack --pack-destination "$FUNCTIONS_DIR" 2>/dev/null | tail -1)
echo "==> Bundled shared package: $TARBALL"

echo "==> Patching functions/package.json for deploy..."
# Replace the workspace wildcard with the local tarball reference
sed -i 's|"@visitas-angelim/shared": "\*"|"@visitas-angelim/shared": "file:'"$TARBALL"'"|' "$FUNCTIONS_PKG"

echo "==> Done. functions/package.json updated for deploy."
