#!/usr/bin/env bash
# Migrates before starting the new version, so it never runs against an old database schema.
#   ./deploy.sh               latest images
#   TAG=<sha> ./deploy.sh     one commit's images (rollback)
#   ./deploy.sh --build       build locally instead of pulling
set -euo pipefail
cd "$(dirname "$0")"

compose() {
  docker compose -f docker-compose.prod.yml "$@"
}

if [[ "${1:-}" == "--build" ]]; then
  compose build
else
  compose pull
fi
compose run --rm server node /app/packages/db/dist/migrate.js
compose up -d
# Deletes old fliprag images; the label filter leaves other projects' images alone.
docker image prune -af --filter label=org.opencontainers.image.source=https://github.com/Erik3010/fliprag
