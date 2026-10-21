#!/usr/bin/env bash
# The one command the GitHub Actions deploy key may run: ~/.ssh/authorized_keys forces it. ssh hands
# over the commit to deploy as SSH_ORIGINAL_COMMAND.
set -euo pipefail
cd "$(dirname "$0")"

sha="${SSH_ORIGINAL_COMMAND:-}"
if [[ ! "$sha" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Expected a commit SHA, got: '$sha'" >&2
  exit 1
fi

git fetch --quiet origin master
git checkout --quiet master
git merge --quiet --ff-only "$sha"
TAG="$sha" ./deploy.sh
