# LEF ERP — Docker deployment

Full stack in one `docker compose`: **MariaDB + backend API + frontend (nginx) +
phpMyAdmin**. All secrets live in `.env` (never in the Dockerfiles or images).

```
db          MariaDB 10.11        (data persisted in a named volume)
backend     Node/Express API     -> port 5000
frontend    Vite build + nginx   -> port 8080  (proxies /api and /uploads to backend)
phpmyadmin  phpMyAdmin 5.2       -> port 8081
```

On first startup the database auto-imports everything in `db/init/`:
`01_lef_payroll.sql` (your existing HR schema + data) then
`02_lef_erp_modules.sql` (Finance/Inventory/Procurement tables + reference data).

---

## A. Run locally (build on your machine)

```bash
cp .env.example .env          # then edit passwords + DOCKERHUB_USER
docker compose up -d --build
```

- App:        http://localhost:8080
- phpMyAdmin: http://localhost:8081  (log in with `DB_USER` / `DB_PASSWORD`)

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

## C. Deploy on a fresh Ubuntu server

Copy these to the server: `docker-compose.yml`, `.env.example`, `deploy-ubuntu.sh`,
and the `db/init/` folder (the DB seed files). Then:

```bash
cp .env.example .env && nano .env      # real secrets; set DOCKERHUB_USER to your repo
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

The script installs Docker if needed, pulls your images (or builds), and starts
everything. Because the frontend nginx proxies `/api`, you don't hardcode any
server IP — it just works on whatever host it runs on.

> If you only copy `docker-compose.yml` + `.env` (no `backend/`/`frontend/` source),
> make sure your images are on Docker Hub so `docker compose pull` can fetch them,
> and keep the `db/init/` folder present for the first-run import.

---

## Notes & safety

- **No passwords in images.** Everything sensitive is read from `.env` at runtime;
  `.env` is git-ignored and excluded from the images via `.dockerignore`.
- **Change `JWT_SECRET`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`** before going live.
- **Backups:** the DB lives in the `db_data` volume and uploads in `uploads_data`.
  Back up with `docker compose exec db mysqldump -u root -p lef_payroll > backup.sql`.
- **Re-import:** `db/init` only runs on an empty database. To re-seed, either
  `docker compose down -v` (wipes data) or import via phpMyAdmin.
- **HTTPS:** for a public server, put a reverse proxy (Caddy/Traefik/nginx) or
  Cloudflare in front of port 8080 to add TLS. Ask and I'll add a Caddy service.
