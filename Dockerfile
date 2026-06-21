# syntax=docker/dockerfile:1

# Scholar Grid — multi-stage Docker build
#
# Three stages:
#   1. deps    — installs node_modules, including compiling better-sqlite3's
#                native addon (needs python3/make/g++).
#   2. builder — copies source + deps, runs `next build` with
#                output: "standalone" (see next.config.ts).
#   3. runner  — minimal final image: just the standalone server, static
#                assets, and public/. No compilers, no full node_modules.
#
# Debian-slim (not Alpine) on purpose: better-sqlite3 ships prebuilt
# binaries for glibc targets, and when it does have to compile from
# source, node-gyp + glibc is the path of least friction. Alpine's musl
# libc is a common source of native-module headaches.

# Pinned to an exact patch version, not just "22" — Docker's `22` tag is a
# moving target that gets repointed to newer patch releases over time, and
# if a previous build cached a `deps` layer against a different underlying
# Node version, you can hit a NODE_MODULE_VERSION mismatch when
# better-sqlite3's compiled binary (built in `deps`) gets loaded by a
# different Node runtime later in the build. Pinning avoids that class of
# bug entirely. Bump this deliberately when you want a newer Node.
ARG NODE_VERSION=22.23.0

# ---------------------------------------------------------------------------
# Stage 1: deps — install dependencies (incl. compiling better-sqlite3)
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app

# build-essential + python3 are what node-gyp needs to compile
# better-sqlite3's native addon during `npm install`.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2: builder — build the Next.js app
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# `next build` runs route typegen as part of the build itself, and with
# output: "standalone" in next.config.ts, this also produces
# .next/standalone (a minimal server.js + only the node_modules it
# actually needs) and .next/static.
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: runner — minimal production image
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# `next start`/standalone server.js both honor these.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone output ships its own minimal server.js plus only the
# node_modules it traced as actually needed (including better-sqlite3's
# compiled .node binary, via outputFileTracingIncludes in next.config.ts).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets (JS/CSS bundles) and the public/ folder aren't included in
# `standalone` by design — Next expects you to serve them separately
# (e.g. via a CDN) or copy them in manually, which is what we do here.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# This is where the SQLite file lives (see app/lib/db.ts) — mount a
# volume here in compose.yaml so data survives container restarts/rebuilds.
RUN mkdir -p /app/app/data && chown nextjs:nodejs /app/app/data
VOLUME ["/app/app/data"]

# --- Seed tooling -----------------------------------------------------
# scripts/seed.ts needs tsx (and tsx's own deps, like esbuild) to run,
# none of which are part of the trimmed standalone server above — tsx is
# a dev dependency, so Next's tracer correctly leaves it out of the
# production bundle. Rather than cherry-pick individual node_modules
# subfolders into the server's own node_modules (fragile — breaks
# silently whenever a transitive dependency changes, and we hit exactly
# that resolving tsx -> esbuild during testing), this copies the full,
# already-correctly-resolved node_modules from the `deps` stage into its
# *own* sibling directory, /app/seed-tool, so Node's normal module
# resolution (which walks up looking for a real node_modules folder)
# works without special-casing anything.
#
# app/data is symlinked to the shared volume path so seeding from here
# writes to the exact same scholargrid.db the server reads from /app.
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./seed-tool/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./seed-tool/scripts
COPY --from=builder --chown=nextjs:nodejs /app/app/lib ./seed-tool/app/lib
COPY --from=builder --chown=nextjs:nodejs /app/app/utils ./seed-tool/app/utils
RUN ln -s /app/app/data /app/seed-tool/app/data \
    && chown -h nextjs:nodejs /app/seed-tool/app/data

USER nextjs

EXPOSE 3000

# server.js is the minimal production server that standalone output
# generates — equivalent to `next start` but without needing the rest of
# node_modules.
#
# To seed the database (see compose.yaml for the documented one-off way to
# run this), invoke tsx from the seed-tool directory's own node_modules:
#
#   docker compose run --rm app ./seed-tool/node_modules/.bin/tsx seed-tool/scripts/seed.ts
#
CMD ["node", "server.js"]