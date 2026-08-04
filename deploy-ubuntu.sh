#!/usr/bin/env bash
# ============================================================================
#  LEF ERP — one-shot deploy on a fresh Ubuntu server
# ----------------------------------------------------------------------------
#  Usage:
#     1. Copy this repo (or at least: docker-compose.yml, .env, db/init/,
#        and — if building on the server — backend/ & frontend/) to the server.
#     2. cp .env.example .env   &&   nano .env      # set real passwords/secrets
#     3. chmod +x deploy-ubuntu.sh && ./deploy-ubuntu.sh
#
#  If you PUSHED images to Docker Hub, this pulls them. If not, it builds.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Installing Docker Engine + Compose plugin (if missing)…"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER" || true
  echo "   Docker installed. You may need to log out/in for group changes."
fi

# Prefer the compose plugin; fall back to legacy docker-compose
if docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  echo "   Installing docker compose plugin…"
  sudo apt-get update -y && sudo apt-get install -y docker-compose-plugin
  DC="docker compose"
fi

if [ ! -f .env ]; then
  echo "==> No .env found — creating from .env.example. EDIT IT before real use!"
  cp .env.example .env
fi

echo "==> Pulling images (falls back to build if not on a registry)…"
$DC pull || true
$DC up -d --build

echo "==> Waiting for services to come up…"
sleep 5
$DC ps

# Read ports from .env for the summary
FRONTEND_PORT=$(grep -E '^FRONTEND_PORT=' .env | cut -d= -f2 || echo 8080)
PMA_PORT=$(grep -E '^PMA_PORT=' .env | cut -d= -f2 || echo 8081)
IP=$(hostname -I 2>/dev/null | awk '{print $1}')

echo ""
echo "============================================================"
echo " LEF ERP is up."
echo "   App:        http://${IP:-localhost}:${FRONTEND_PORT:-8080}"
echo "   phpMyAdmin: http://${IP:-localhost}:${PMA_PORT:-8081}"
echo "   (log in with DB_USER / DB_PASSWORD from your .env)"
echo "============================================================"
echo "The database auto-imported db/init/*.sql on first run."
echo "Useful:  $DC logs -f   |   $DC restart   |   $DC down"
