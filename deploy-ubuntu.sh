#!/usr/bin/env bash
# ============================================================================
#  LEF ERP — one-shot deploy on a fresh Ubuntu server
# ----------------------------------------------------------------------------
#  Usage:
#     1. Copy this repo (or at least: docker-compose.yml, Caddyfile, .env,
#        db/init/, and — if building on the server — backend/ & frontend/)
#        to the server.
#     2. Point your domain's A/AAAA record at this server's IP.
#     3. cp .env.example .env   &&   nano .env      # real secrets + DOMAIN
#     4. chmod +x deploy-ubuntu.sh && ./deploy-ubuntu.sh
#
#  If you PUSHED images to Docker Hub, this pulls them. If not, it builds.
#  Caddy handles HTTPS automatically once DNS points here — no certbot step.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Firewall: allow only SSH/HTTP/HTTPS (skips silently if ufw is missing)…"
if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow OpenSSH || true
  sudo ufw allow 80/tcp || true
  sudo ufw allow 443/tcp || true
  sudo ufw --force enable || true
fi

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

echo "==> Waiting for services to come up (Caddy needs a few seconds to fetch the TLS cert)…"
sleep 5
$DC ps

DOMAIN=$(grep -E '^DOMAIN=' .env | cut -d= -f2 || echo "your-domain")

echo ""
echo "============================================================"
echo " LEF ERP is up."
echo "   App: https://${DOMAIN}"
echo ""
echo " phpMyAdmin is OFF by default. To use it temporarily:"
echo "   $DC --profile admin-tools up -d phpmyadmin"
echo "   ssh -L 8081:127.0.0.1:8081 <user>@<this-server>   (from your laptop)"
echo "   then open http://localhost:8081  —  stop it again when done:"
echo "   $DC stop phpmyadmin"
echo "============================================================"
echo "The database auto-imported db/init/*.sql on first run."
echo "Nightly DB backups land in ./db/backups (kept 14 days) — copy them"
echo "off this box regularly; a local-only backup won't survive losing the server."
echo "Useful:  $DC logs -f   |   $DC restart   |   $DC down"
