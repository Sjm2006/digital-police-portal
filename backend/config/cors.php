<?php
declare(strict_types=1);

/**
 * Credentialed CORS. Only the single configured frontend origin is allowed (never "*",
 * which browsers reject when cookies are involved anyway).
 */
function apply_cors(array $app): void
{
    $allowed = $app['frontend_origin'];
    $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($allowed !== '' && hash_equals($allowed, $origin)) {
        header('Access-Control-Allow-Origin: ' . $allowed);
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, Accept');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Vary: Origin');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
