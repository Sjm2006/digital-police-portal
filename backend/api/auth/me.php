
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    dpp_fail('Method not allowed.', 405);
}

$pdo = db();

$user = dpp_require_user($pdo);

dpp_ok('Authenticated user.', [
    'user' => [
        'user_id' => $user['user_id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role' => $user['role']
    ],
    'csrf_token' => dpp_csrf_token()
]);
