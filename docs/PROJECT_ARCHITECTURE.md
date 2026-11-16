# Project Architecture

```
Browser → React (Vercel) → HTTPS JSON → PHP API (PHP host) → PDO → MySQL (cloud)
```
The frontend never touches MySQL. The backend independently enforces authentication, role and ownership on every protected endpoint.

## Decisions
- **Monorepo**: `frontend/`, `backend/`, `database/`, `docs/`.
- **Tailwind CSS v3** (config-file based, stable with Vite 5). Design tokens (navy, gold, success/warning/danger, surface grey, Manrope font) live in `frontend/tailwind.config.js`.
- **API base URL** comes only from `VITE_API_BASE_URL`; one Axios instance (`src/services/apiClient.js`) with `withCredentials: true`.
- **Backend entry**: every endpoint starts with `require_once bootstrap.php` (env, config, error handler, CORS). One PDO factory `db()`; one response helper (`json_success` / `json_error`).
- **Config**: `.env` locally, real environment variables in production (env vars take priority).
- **Auth**: server-side PHP sessions in HTTP-only cookies + CSRF token header; no auth state in localStorage.
- **Endpoint style**: file-per-endpoint under `backend/api/<module>/*.php`, as specified.

## Risks and corrections (flagged before implementing)
1. **Cross-site cookies.** Vercel (`*.vercel.app`) calling a separate PHP host is cross-site: modern browsers block or restrict third-party cookies, and `SameSite=None` is fragile. **Correction:** deploy under one parent domain (e.g. `app.example.com` + `api.example.com`) with `SESSION_DOMAIN=.example.com`, `SameSite=Lax`, `Secure`. A custom domain is therefore effectively required in production.
2. **Private storage inside the web root.** `backend/storage/private` sits under `backend/`, which is web-served on XAMPP/shared hosting. Mitigation now: `.htaccess` deny rules. **Correction for production:** set `STORAGE_PATH` to an absolute path outside the document root; evidence is served only through authenticated PHP endpoints.
3. **Directory protection relies on Apache.** `.htaccess` is ignored by Nginx hosts; the deployment guide must give equivalent Nginx rules, and the document root should ideally be `backend/api` only.
4. **Free/shared PHP hosts** may lack `pdo_mysql`, HTTPS, or env-var support, and some block remote MySQL. Choose a host that supports all three; verify in Phase 10.
5. **Session rate limiting** needs a DB table or file store (login attempts). Phase 1 will add a `login_attempts` table to the specified 12; this is a small extension of the spec.
6. **Vercel SPA routing** needs a `vercel.json` rewrite to `index.html` (added in Phase 10).
7. **Vite env vars are public**: only non-secret values may use the `VITE_` prefix.
