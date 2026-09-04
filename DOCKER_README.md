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
cp .env.example .env          # then edit passwords + DOCKERHUB_USER
docker compose up -d --build
```

- App: https://localhost (Caddy serves a local cert when `DOMAIN` is left as `localhost`; your browser will warn about it being self-signed — that's expected for local dev)

Stop / reset:
```bash
docker compose down            # keep data
docker compose down -v         # also wipe the DB volume (re-imports db/init on next up)
```

## B. Push to Docker Hub

```bash
# set DOCKERHUB_USER and TAG in .env first
docker login
docker compose build
docker compose push            # pushes <user>/lef-backend and <user>/lef-frontend
```

## C. Deploy on a fresh Ubuntu server (real domain, HTTPS)

1. Point your domain's **A/AAAA record** at the server's IP before you start —
   Caddy needs to be reachable on 80/443 to get a Let's Encrypt certificate.
2. Copy these to the server: `docker-compose.yml`, `Caddyfile`, `.env.example`,
   `deploy-ubuntu.sh`, and the `db/init/` folder.
3. **Rotate every secret** — don't reuse values from any previous deployment,
   especially one that was compromised. Generate fresh ones:
   ```bash
   openssl rand -base64 48   # run once per secret: DB_PASSWORD, DB_ROOT_PASSWORD, JWT_SECRET, SYNC_API_KEY
   ```
4. ```bash
   cp .env.example .env && nano .env
   # set DOMAIN, FRONTEND_URL (https://your-domain), DOCKERHUB_USER, and the rotated secrets
   chmod +x deploy-ubuntu.sh
   ./deploy-ubuntu.sh
   ```

The script opens the firewall to SSH/80/443 only (if `ufw` is present), installs
Docker if needed, pulls your images (or builds), and starts everything. Caddy
requests the TLS cert automatically on first boot — give it a minute.

> If you only copy `docker-compose.yml` + `.env` (no `backend/`/`frontend/` source),
> make sure your images are on Docker Hub so `docker compose pull` can fetch them,
> and keep the `db/init/` folder present for the first-run import.

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
