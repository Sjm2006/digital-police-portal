# Deployment Guide
Status: skeleton. Completed in Phase 10.

## 1. Local development
1. Install XAMPP (PHP 8.2+, MySQL 8 or MariaDB equivalent), Node 18+, Git.
2. Place the project in `htdocs/digital-police-portal`.
3. Create `backend/.env` from `.env.example`; set `FRONTEND_ORIGIN=http://localhost:5173`.
4. Create `frontend/.env` from `.env.example`; set `VITE_API_BASE_URL`.
5. `cd frontend && npm install && npm run dev`.
6. Verify `GET {API}/api/health.php`.

Remaining sections (database import, PHP hosting, Vercel, CORS/sessions, admin bootstrap, production auth tests) will be written as those features exist.
