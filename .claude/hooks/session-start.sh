#!/bin/bash
set -uo pipefail

# Only needed in Claude Code on the web / remote sessions — local dev environments
# are expected to already have the right Node version via .nvmrc.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# The container's default `node` on PATH can be one patch version behind what
# .nvmrc / package.json engines pins (Angular CLI enforces this strictly and
# refuses to run otherwise). Try a pre-cached install first (fast, no network),
# then fall back to `nvm install`. Persist the resolved bin dir onto PATH for
# the rest of the session via $CLAUDE_ENV_FILE so later shells pick it up
# without re-running `nvm use` by hand.
PINNED_VERSION="$(cat .nvmrc 2>/dev/null || true)"
NODE_BIN_DIR=""

if [ -n "$PINNED_VERSION" ] && [ -x "/versions/node/v${PINNED_VERSION}/bin/node" ]; then
  NODE_BIN_DIR="/versions/node/v${PINNED_VERSION}/bin"
elif type nvm >/dev/null 2>&1; then
  nvm install && NODE_BIN_DIR="$(dirname "$(command -v node)")"
elif [ -s /opt/nvm/nvm.sh ]; then
  # shellcheck disable=SC1091
  . /opt/nvm/nvm.sh
  nvm install && NODE_BIN_DIR="$(dirname "$(command -v node)")"
fi

if [ -n "$NODE_BIN_DIR" ]; then
  echo "export PATH=\"$NODE_BIN_DIR:\$PATH\"" >>"$CLAUDE_ENV_FILE"
  export PATH="$NODE_BIN_DIR:$PATH"
else
  echo "session-start.sh: could not resolve a pinned Node install; continuing with default PATH node ($(command -v node 2>/dev/null || echo none))." >&2
fi

npm install
