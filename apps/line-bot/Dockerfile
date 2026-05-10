FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/line-bot/package.json ./apps/line-bot/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/line-bot/node_modules ./apps/line-bot/node_modules
COPY . .
RUN pnpm --filter @saifit/line-bot build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 linebot

COPY --from=builder --chown=linebot:nodejs /app/apps/line-bot/dist ./dist
COPY --from=builder /app/apps/line-bot/node_modules ./node_modules
COPY --from=builder /app/packages/db/src ./packages/db/src

USER linebot
EXPOSE 3001
CMD ["node", "dist/index.js"]
