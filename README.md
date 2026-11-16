# Digital Police Portal (DPP)

Educational prototype of a citizen–police complaint management platform. **Not an official government or police service.** All data is fictional. In an emergency, call **112**.

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 3, React Router, Axios, Lucide, Recharts |
| Backend | Core PHP 8.2+, REST/JSON, PDO, PHP sessions |
| Database | MySQL 8+ (phpMyAdmin) |

## Run locally
1. Copy the project to `C:\xampp\htdocs\digital-police-portal` (or serve `backend/` with `php -S localhost:8000 -t backend`).
2. Start Apache + MySQL in XAMPP.
3. `cp backend/.env.example backend/.env` and edit the values.
4. `cd frontend && cp .env.example .env && npm install && npm run dev` → http://localhost:5173
5. Check the API: open `<VITE_API_BASE_URL>/api/health.php`.

Database import starts in Phase 1 (`database/schema.sql`).

## Docs
See `docs/`. Start with `DEVELOPMENT_PROGRESS.md` to continue work in a new session.
