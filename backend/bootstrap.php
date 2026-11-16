<?php
declare(strict_types=1);

/**
 * Included at the top of every API endpoint. Loads config, CORS, error handling.
 * Session start + auth/role/CSRF middleware are added in Phase 4.
 */
require_once __DIR__ . '/helpers/env.php';
require_once __DIR__ . '/helpers/response.php';

load_env(__DIR__ . '/.env');

$GLOBALS['app_config'] = require __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/cors.php';

date_default_timezone_set('Asia/Kolkata');
mb_internal_encoding('UTF-8');

ini_set('display_errors', $GLOBALS['app_config']['debug'] ? '1' : '0');
error_reporting(E_ALL);

set_exception_handler(function (Throwable $e): void {
    error_log('[DPP] ' . $e::class . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, 'ERROR: ' . $e->getMessage() . "\n");
        exit(1);
    }
    $msg = $GLOBALS['app_config']['debug'] ? $e->getMessage() : 'Internal server error';
    json_error($msg, 500);
});

if (PHP_SAPI !== 'cli') {
    apply_cors($GLOBALS['app_config']);
}

function app_config(): array
{
    return $GLOBALS['app_config'];
}
