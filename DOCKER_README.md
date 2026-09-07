# LEF ERP — Docker deployment

Full stack in one `docker compose`: **MariaDB + backend API + frontend (nginx) +
Caddy (automatic HTTPS) + nightly DB backups**, with phpMyAdmin available as an
opt-in tool.

```
db          MariaDB 10.11        (data persisted in a named volume, localhost-only)
db-backup   mysqldump loop       -> ./db/backups, nightly, 14-day retention
backend     Node/Express API     -> internal only, no host port
frontend    Vite build + nginx   -> internal only, no host port (proxies /api and /uploads to backend)
caddy       Caddy 2              -> 80/443 — the ONLY public port, auto TLS via Let's Encrypt
phpmyadmin  phpMyAdmin 5.2       -> off by default, opt-in via --profile admin-tools, 127.0.0.1 only
```

On first startup the database auto-imports everything in `db/init/`:
`01_lef_payroll.sql` (your existing HR schema + data) then
`02_lef_erp_modules.sql` (Finance + Inventory tables + reference data —
Procurement was retired; `suppliers` is kept as a shared vendor directory).

---

## A. Run locally (build on your machine)

```bash
cp .env.example .env          # then edit passwords + IMAGE_PREFIX
docker compose up -d --build
```

- App: https://localhost (Caddy serves a local cert when `DOMAIN` is left as `localhost`; your browser will warn about it being self-signed — that's expected for local dev)

Stop / reset:
```bash
docker compose down            # keep data
docker compose down -v         # also wipe the DB volume (re-imports db/init on next up)
```

## B. CI/CD — GitHub Actions builds & deploys automatically

`.github/workflows/deploy.yml` runs on every push to `main`:
1. **build** — installs deps, builds the frontend, syntax-checks the backend. Runs on PRs too, as a gate.
2. **build-and-push** — builds both Docker images and pushes them to GHCR
   (GitHub Container Registry) as `ghcr.io/<owner>/<repo>-backend` and
   `...-frontend`, tagged `latest` and the commit SHA. Uses the built-in
   `GITHUB_TOKEN` — no separate registry account needed.
3. **deploy** — SSHes into the server and runs `docker compose pull && up -d`.

**One-time setup**, in the GitHub repo's Settings → Secrets and variables → Actions:

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | Server IP or hostname |
| `DEPLOY_USER` | SSH user (non-root, in the `docker` group) |
| `DEPLOY_SSH_KEY` | Private key for that user (the matching public key must be in the server's `~/.ssh/authorized_keys`) |
| `DEPLOY_PATH` | Absolute path to the cloned repo on the server, e.g. `/opt/lef-payroll` |

The server itself only needs `docker-compose.yml` (rest is your locally-built history) and a real `.env` — see section C. `IMAGE_PREFIX` in that `.env` should match what CI publishes to, e.g. `ghcr.io/mromarjnr/payrolltoday` (all lowercase).

By default GHCR packages are private to the repo/org; the deploy job logs in
with `GITHUB_TOKEN` so that works out of the box. If you'd rather not manage
that, make the packages public instead (Package settings → Change visibility)
and drop the `docker login` line from the workflow's deploy step.

To redeploy without a code change (e.g. after editing `.env` on the server),
trigger the workflow manually from the Actions tab (`workflow_dispatch`).

## C. Deploy on a fresh Ubuntu server (real domain, HTTPS)

1. Point your domain's **A/AAAA record** at the server's IP before you start —
   Caddy needs to be reachable on 80/443 to get a Let's Encrypt certificate.
2. `git clone` this repo onto the server (CI's `deploy` job expects it already
   there at `DEPLOY_PATH`, since it only runs `docker compose pull && up -d`,
   never a fresh clone).
3. **Rotate every secret** — don't reuse values from any previous deployment,
   especially one that was compromised. Generate fresh ones:
   ```bash
   openssl rand -base64 48   # run once per secret: DB_PASSWORD, DB_ROOT_PASSWORD, JWT_SECRET, SYNC_API_KEY
   ```
4. ```bash
   cp .env.example .env && nano .env
   # set DOMAIN, FRONTEND_URL (https://your-domain), IMAGE_PREFIX, and the rotated secrets
   chmod +x deploy-ubuntu.sh
   ./deploy-ubuntu.sh
   ```
5. Add the four `DEPLOY_*` secrets in GitHub (see section B) so future pushes to
   `main` deploy here automatically.

The script opens the firewall to SSH/80/443 only (if `ufw` is present), installs
Docker if needed, pulls your images (or builds locally as a first-run fallback,
before CI has pushed anything), and starts everything. Caddy requests the TLS
cert automatically on first boot — give it a minute.

---

## Notes & safety

- **No passwords in images.** Everything sensitive is read from `.env` at runtime;
  `.env` is git-ignored and excluded from the images via `.dockerignore`.
- **HTTPS is automatic.** Caddy is the only container with a public port and
  handles cert issuance/renewal for `DOMAIN` — no manual certbot/nginx TLS config.
- **phpMyAdmin is off by default.** Start it only when you actually need it:
  ```bash
  docker compose --profile admin-tools up -d phpmyadmin
  ssh -L 8081:127.0.0.1:8081 <user>@<server>   # from your laptop
  # open http://localhost:8081, then when done:
  docker compose stop phpmyadmin
  ```
- **Backups:** `db-backup` dumps the database every 24h into `./db/backups`
  (gzip'd, 14-day local retention). A local-only backup doesn't protect you if
  the server itself is lost or compromised — copy dumps off-box regularly
  (rsync to another host, an S3-compatible bucket, etc.). Manual one-off dump:
  ```bash
  docker compose exec db mysqldump -u root -p lef_payroll > backup.sql
  ```
- **Re-import:** `db/init` only runs on an empty database. To re-seed, either
  `docker compose down -v` (wipes data) or import via phpMyAdmin.

### Server-level checklist (do this once, outside Docker, on the actual VPS)

- `ufw`: allow only OpenSSH, 80, 443 (the deploy script does this automatically
  if `ufw` is installed) — deny everything else.
- SSH: key-only auth, disable password login (`PasswordAuthentication no` in
  `sshd_config`), consider `fail2ban` for brute-force protection.
- `sudo apt install unattended-upgrades` so OS security patches apply automatically.
- Don't deploy/run as `root` day-to-day — use a non-root user in the `docker` group.
- Confirm `docker compose ps` shows only `caddy` with published ports before
  calling the deployment done — everything else should say `<no ports>` /
  `127.0.0.1:...` only.
