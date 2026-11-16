# Database

Database name: `digital_police_portal` (utf8mb4, InnoDB).

## Setup
1. phpMyAdmin → New → name `digital_police_portal`, collation `utf8mb4_unicode_ci`.
2. Select it → **Import** → `schema.sql`.
3. Import `seed.sql` (categories and fictional demo police stations; contains no users).
4. Configure `backend/.env` (DB_*).
5. Create the first administrator from a terminal:
   ```
   cd backend
   php cli/create_admin.php
   ```
   It prompts for name, email, mobile and password, refuses weak passwords, and **refuses to run again once any administrator exists**.

On cloud MySQL use the same steps against the provided database; omit any `CREATE DATABASE` step.
Never re-import `schema.sql` into a database that already holds data.
See `docs/DATABASE_DESIGN.md` for the design.
