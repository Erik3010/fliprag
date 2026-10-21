#!/usr/bin/env bash
# Run on the server from the repo root, after git pull. Migrating before `up` means the new server
# never starts against an old schema.
set -euo pipefail
cd "$(dirname "$0")"

compose() {
  docker compose -f docker-compose.prod.yml "$@"
}

compose build
compose run --rm server node /app/packages/db/dist/migrate.js
compose up -d
# Only this project's leftover images, not other projects' on the same machine.
docker image prune -f --filter label=com.docker.compose.project=fliprag-prod
