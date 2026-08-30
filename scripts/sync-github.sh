#!/usr/bin/env bash
set -euo pipefail

REPO="MAHESH-GANDE/Bad-boys-for-life"
BRANCH="${1:-main}"
REPO_URL="https://github.com/${REPO}"

repo_exists() {
  local status
  status="$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/${REPO}")"
  [ "$status" = "200" ]
}

ensure_github_remote() {
  if git remote get-url github >/dev/null 2>&1; then
    git remote set-url github "${REPO_URL}.git"
  else
    git remote add github "${REPO_URL}.git"
  fi
}

push_with_token() {
  local token="$1"
  local remote="https://x-access-token:${token}@github.com/${REPO}.git"
  ensure_github_remote
  git push "${remote}" "${BRANCH}:${BRANCH}"
  echo "Pushed ${BRANCH} to ${REPO_URL}"
}

create_repo_with_gh() {
  if repo_exists; then
    return 0
  fi
  echo "Repository ${REPO} not found — creating with gh..."
  gh repo create "${REPO}" --public --source=. --remote=github --push
  echo "Created and pushed to ${REPO_URL}"
  exit 0
}

if [ -n "${GH_TOKEN:-}" ] || [ -n "${GITHUB_TOKEN:-}" ]; then
  TOKEN="${GH_TOKEN:-$GITHUB_TOKEN}"
  ensure_github_remote
  if ! repo_exists; then
    echo "Repository ${REPO} does not exist yet."
    echo "Create it at https://github.com/new (name: Bad-boys-for-life, public, no README), then rerun this script."
    echo "Or set GH_TOKEN and run: gh repo create ${REPO} --public --source=. --remote=github --push"
    exit 1
  fi
  push_with_token "${TOKEN}"
  exit 0
fi

if gh auth status >/dev/null 2>&1; then
  ensure_github_remote
  create_repo_with_gh
  git push -u github "${BRANCH}"
  echo "Pushed ${BRANCH} to ${REPO_URL}"
  exit 0
fi

echo "Missing GitHub authentication."
echo ""
echo "Option A — Personal access token (recommended for Cloud Agent):"
echo "  1. Create a token at https://github.com/settings/tokens (repo scope)"
echo "  2. Add GH_TOKEN to Cursor → Cloud → Secrets"
echo "  3. Rerun: ./scripts/sync-github.sh"
echo ""
echo "Option B — Device login (one-time in this environment):"
echo "  1. Run: gh auth login --hostname github.com --git-protocol https"
echo "  2. Open https://github.com/login/device and enter the code shown"
echo "  3. Rerun: ./scripts/sync-github.sh"
echo ""
echo "If the repository was deleted, recreate it first:"
echo "  https://github.com/new → Owner: MAHESH-GANDE → Name: Bad-boys-for-life → Public → Create (no README)"
echo "  Then: gh repo create ${REPO} --public --source=. --remote=github --push"
echo "  Or:   git push -u github main"
exit 1
