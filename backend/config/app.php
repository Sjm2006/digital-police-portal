<?php
declare(strict_types=1);

return [
    'name'     => env('APP_NAME', 'Digital Police Portal'),
    'env'      => env('APP_ENV', 'production'),
    'debug'    => env_bool('APP_DEBUG', false),
    'frontend_origin' => rtrim((string) env('FRONTEND_ORIGIN', ''), '/'),
    'session'  => [
        'name'     => env('SESSION_NAME', 'dpp_session'),
        'lifetime' => (int) env('SESSION_LIFETIME', '1800'),
        'samesite' => env('SESSION_SAMESITE', 'Lax'),
        'secure'   => env_bool('SESSION_SECURE', false),
        'domain'   => env('SESSION_DOMAIN', ''),
    ],
    'storage' => [
        'path'      => env('STORAGE_PATH', __DIR__ . '/../storage/private'),
        'max_bytes' => (int) env('UPLOAD_MAX_BYTES', '5242880'),
    ],
];
