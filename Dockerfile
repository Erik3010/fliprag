# Node and pnpm, shared by every stage
FROM node:22-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# The whole workspace, compiled
FROM base AS build
ENV SKIP_SIMPLE_GIT_HOOKS=1
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @fliprag/schemas build \
  && pnpm --filter @fliprag/db build \
  && pnpm --filter @fliprag/server build \
  && pnpm --filter @fliprag/web build

# The API: production dependencies and the compiled output only
FROM base AS server
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Every workspace package.json, so the lockfile still matches; only the server's tree is installed.
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/db/package.json packages/db/
COPY packages/schemas/package.json packages/schemas/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --prod --frozen-lockfile --ignore-scripts --filter @fliprag/server...
COPY --from=build /app/packages/schemas/dist packages/schemas/dist
COPY --from=build /app/packages/db/dist packages/db/dist
COPY --from=build /app/packages/db/migrations packages/db/migrations
COPY --from=build /app/apps/server/dist apps/server/dist
WORKDIR /app/apps/server
USER node
CMD ["node", "dist/index.js"]

# Caddy with the built web app
FROM caddy:2.10 AS web
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/web/dist /srv/web
