<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';

// Public connectivity check: confirms PHP runs, CORS works, and (optionally) the DB is reachable.
$dbOk = false;
try {
    db()->query('SELECT 1');
    $dbOk = true;
} catch (Throwable $e) {
    error_log('[DPP] health: DB unreachable');
}
json_success('API is running', ['php' => PHP_VERSION, 'database' => $dbOk ? 'connected' : 'unreachable']);
