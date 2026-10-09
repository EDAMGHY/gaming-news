# syntax=docker/dockerfile:1.7

# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.22.0-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# pnpm is the project's only package manager and the lockfile is authoritative.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are compiled into the client bundle. The optional build
# secret supplies the remaining build-time environment without copying it into
# an image layer. Platforms that inject build-time env vars can omit the secret.
ARG NEXT_PUBLIC_SERVER_URL
RUN --mount=type=secret,id=env_file,target=/app/.env,required=false \
  if [ -n "${NEXT_PUBLIC_SERVER_URL:-}" ]; then export NEXT_PUBLIC_SERVER_URL; fi; \
  pnpm run build

# Production image, copy all the files and run next
FROM node:22.22.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permissions for the prerender cache and the Dokploy media
# volume mount. The production volume must be writable by UID/GID 1001.
RUN mkdir -p .next /app/public/media && \
  chown nextjs:nodejs .next /app/public/media

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
