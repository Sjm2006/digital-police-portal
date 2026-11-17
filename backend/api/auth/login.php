
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    dpp_fail('Method not allowed.', 405);
}

$data = dpp_input();

$identifier = trim((string)($data['identifier'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($identifier === '' || $password === '') {
    dpp_fail('Enter your email/User ID and password.', 422);
}

$pdo = db();

$ip = substr($_SERVER['REMOTE_ADDR'] ?? 'unknown', 0, 45);
$normalized = strtolower($identifier);

// Check recent login attempts
$attempts = $pdo->prepare(
    "SELECT COUNT(*) FROM login_attempts
     WHERE attempted_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)
     AND (identifier = :identifier OR ip_address = :ip)"
);

$attempts->execute([
    'identifier' => $normalized,
    'ip' => $ip
]);

if ((int)$attempts->fetchColumn() >= 10) {
    dpp_fail('Too many login attempts. Try again after 15 minutes.', 429);
}

// Find account using email or public User ID
$stmt = $pdo->prepare(
    "SELECT id, user_id, full_name, email, phone,
            password_hash, role, status
     FROM users
     WHERE email = :email OR user_id = :user_id
     LIMIT 1"
);

$stmt->execute([
    'email' => $normalized,
    'user_id' => strtoupper($identifier)
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

$valid = $user
    && $user['status'] === 'ACTIVE'
    && password_verify($password, $user['password_hash']);

// Record login attempt
$log = $pdo->prepare(
    "INSERT INTO login_attempts
     (identifier, ip_address, was_successful)
     VALUES (:identifier, :ip, :successful)"
);

$log->execute([
    'identifier' => $normalized,
    'ip' => $ip,
    'successful' => $valid ? 1 : 0
]);

if (!$valid) {
    dpp_fail('Invalid login credentials or inactive account.', 401);
}

// Update last login time
$update = $pdo->prepare(
    'UPDATE users SET last_login_at = NOW() WHERE id = :id'
);

$update->execute(['id' => $user['id']]);

// Record audit event
audit_log(
    $pdo,
    (int)$user['id'],
    'USER_LOGIN',
    'USER',
    (string)$user['id'],
    []
);

// Create authenticated session
dpp_start_session();
session_regenerate_id(true);

$_SESSION['auth_user_id'] = (int)$user['id'];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

dpp_ok('Login successful.', [
    'user' => [
        'user_id' => $user['user_id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role' => $user['role']
    ],
    'csrf_token' => $_SESSION['csrf_token']
]);
