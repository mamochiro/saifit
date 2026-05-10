#!/usr/bin/env bash
# Usage: ./scripts/deploy.sh [server_ip] [ssh_user]
# Example: ./scripts/deploy.sh 1.2.3.4 root
set -euo pipefail

SERVER="${1:?Usage: deploy.sh <server_ip> [ssh_user]}"
SSH_USER="${2:-root}"
REMOTE="${SSH_USER}@${SERVER}"
DEPLOY_DIR="/opt/saifit"

echo "→ Deploying to ${REMOTE}:${DEPLOY_DIR}"

# 1. Rsync source (exclude dev artifacts)
rsync -az --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='.env.local' \
  ./ "${REMOTE}:${DEPLOY_DIR}/"

# 2. Install dependencies and build on server
ssh "${REMOTE}" "
  cd ${DEPLOY_DIR}
  docker compose -f docker-compose.prod.yml pull --quiet
  docker compose -f docker-compose.prod.yml build --parallel
  docker compose -f docker-compose.prod.yml up -d --remove-orphans
  docker compose -f docker-compose.prod.yml exec -T web node /app/apps/web/node_modules/.bin/drizzle-kit migrate || true
  docker image prune -f
"

echo "✓ Deployed successfully"
