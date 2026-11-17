
<?php
function dpp_json(int $status, array $body): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function dpp_ok(string $message, mixed $data = null, int $status = 200): never {
    dpp_json($status, [
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
}

function dpp_fail(string $message, int $status = 400, array $errors = []): never {
    dpp_json($status, [
        'success' => false,
        'message' => $message,
        'errors' => $errors
    ]);
}

function dpp_input(): array {
    $data = json_decode(file_get_contents('php://input') ?: '', true);

    if (!is_array($data)) {
        dpp_fail('Invalid JSON request body.', 400);
    }

    return $data;
}

function dpp_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('dpp_session');

    session_set_cookie_params([
        'lifetime' => 1800,
        'path' => '/digital-police-portal/backend/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    session_start();
}

function dpp_csrf_token(): string {
    dpp_start_session();

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function dpp_require_csrf(): void {
    dpp_start_session();

    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $stored = $_SESSION['csrf_token'] ?? '';

    if (!$provided || !$stored || !hash_equals($stored, $provided)) {
        dpp_fail('Invalid or missing CSRF token.', 403);
    }
}

function dpp_current_user(PDO $pdo): ?array {
    dpp_start_session();

    $id = $_SESSION['auth_user_id'] ?? null;

    if (!$id) {
        return null;
    }

    $stmt = $pdo->prepare(
        "SELECT id, user_id, full_name, email, phone, role, status
         FROM users WHERE id = :id LIMIT 1"
    );

    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['status'] !== 'ACTIVE') {
        $_SESSION = [];
        session_destroy();
        return null;
    }

    return $user;
}

function dpp_require_user(PDO $pdo): array {
    $user = dpp_current_user($pdo);

    if (!$user) {
        dpp_fail('Authentication required. Please log in.', 401);
    }

    return $user;
}

function dpp_require_role(PDO $pdo, string $role): array {
    $user = dpp_require_user($pdo);

    if ($user['role'] !== $role) {
        dpp_fail('You are not authorised to access this resource.', 403);
    }

    return $user;
}

function dpp_normalize_email(string $email): string {
    return strtolower(trim($email));
}

function dpp_normalize_phone(string $phone): string {
    return preg_replace('/\D+/', '', $phone) ?? '';
}

function dpp_valid_password(string $password): bool {
    return strlen($password) >= 12
        && strlen($password) <= 128
        && preg_match('/[A-Z]/', $password)
        && preg_match('/[a-z]/', $password)
        && preg_match('/[0-9]/', $password)
        && preg_match('/[^A-Za-z0-9]/', $password);
}
