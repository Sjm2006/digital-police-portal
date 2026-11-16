# API Documentation
Envelope: success `{ "success": true, "message": "...", "data": {} }`; error `{ "success": false, "message": "...", "errors": {} }`.
Status codes: 200, 201, 400, 401, 403, 404, 422, 500.

## Implemented
### GET /api/health.php
Auth: none. Returns `{ php, database: "connected" | "unreachable" }`. Not yet tested against a live PHP runtime.

## Planned (Phase 5+)
POST /api/auth/register.php · POST /api/auth/login.php · POST /api/auth/logout.php · GET /api/auth/me.php
