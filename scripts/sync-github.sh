#!/usr/bin/env bash
set -euo pipefail

REPO="MAHESH-GANDE/Bad-boys-for-life"
BRANCH="${1:-main}"

if [ -z "${GH_TOKEN:-}" ] && [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Missing GitHub token."
  echo "Add GH_TOKEN to Cursor Cloud secrets (repo scope for ${REPO}), then rerun:"
  echo "  GH_TOKEN=*** ./scripts/sync-github.sh"
  exit 1
fi

TOKEN="${GH_TOKEN:-$GITHUB_TOKEN}"
REMOTE="https://x-access-token:${TOKEN}@github.com/${REPO}.git"

git remote get-url github >/dev/null 2>&1 || git remote add github "https://github.com/${REPO}.git"
git push "${REMOTE}" "${BRANCH}:${BRANCH}"
echo "Pushed ${BRANCH} to https://github.com/${REPO}"
