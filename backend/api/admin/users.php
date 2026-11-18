
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/audit.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    dpp_start_session();
}

$pdo = db();
dpp_require_role($pdo, 'ADMIN');

$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| CSRF Validation
|--------------------------------------------------------------------------
*/
function admin_users_require_csrf(): void
{
    $sessionToken = (string) ($_SESSION['csrf_token'] ?? '');
    $requestToken = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');

    if (
        $sessionToken === '' ||
        $requestToken === '' ||
        !hash_equals($sessionToken, $requestToken)
    ) {
        dpp_fail('Invalid or missing CSRF token.', 403);
    }
}

/*
|--------------------------------------------------------------------------
| GET: List registered citizens
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {

    $search = trim((string) ($_GET['search'] ?? ''));
    $status = strtoupper(trim((string) ($_GET['status'] ?? '')));

    $allowedStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

    if (
        $status !== '' &&
        !in_array($status, $allowedStatuses, true)
    ) {
        dpp_fail('Invalid account status filter.', 422);
    }

    $sql = "
        SELECT
            u.id,
            u.user_id,
            u.full_name,
            u.email,
            u.phone,
            u.status,
            u.last_login_at,
            u.created_at,
            u.updated_at,
            (
                SELECT COUNT(*)
                FROM complaints c
                WHERE c.citizen_id = u.id
            ) AS complaints_count
        FROM users u
        WHERE u.role = 'CITIZEN'
    ";

    $params = [];

    if ($search !== '') {
        $sql .= "
            AND (
                u.full_name LIKE :search_name
                OR u.email LIKE :search_email
                OR u.user_id LIKE :search_user_id
                OR u.phone LIKE :search_phone
            )
        ";

        $term = '%' . $search . '%';

        $params = [
            'search_name' => $term,
            'search_email' => $term,
            'search_user_id' => $term,
            'search_phone' => $term
        ];
    }

    if ($status !== '') {
        $sql .= ' AND u.status = :status';
        $params['status'] = $status;
    }

    $sql .= ' ORDER BY u.created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $statsStmt = $pdo->query("
        SELECT
            COUNT(*) AS total_users,
            SUM(status = 'ACTIVE') AS active_users,
            SUM(status = 'INACTIVE') AS inactive_users,
            SUM(status = 'SUSPENDED') AS suspended_users
        FROM users
        WHERE role = 'CITIZEN'
    ");

    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    dpp_ok('Citizen records retrieved successfully.', [
        'users' => $users,
        'stats' => $stats
    ]);
}

/*
|--------------------------------------------------------------------------
| PATCH: Activate, deactivate or suspend a citizen account
|--------------------------------------------------------------------------
*/
if ($method === 'PATCH') {

    admin_users_require_csrf();

    $data = dpp_input();

    $userId = filter_var(
        $data['user_id'] ?? $data['id'] ?? null,
        FILTER_VALIDATE_INT
    );

    $status = strtoupper(
        trim((string) ($data['status'] ?? ''))
    );

    if (!$userId || $userId < 1) {
        dpp_fail('A valid citizen ID is required.', 422);
    }

    if (!in_array(
        $status,
        ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        true
    )) {
        dpp_fail('Select a valid account status.', 422);
    }

    $adminId = (int) ($_SESSION['auth_user_id'] ?? 0);

    if ($adminId < 1) {
        dpp_fail('Admin session is invalid. Please log in again.', 401);
    }

    $find = $pdo->prepare("
        SELECT id, user_id, full_name, status
        FROM users
        WHERE id = :id
          AND role = 'CITIZEN'
        LIMIT 1
    ");

    $find->execute(['id' => $userId]);

    $user = $find->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        dpp_fail('Citizen account not found.', 404);
    }

    $oldStatus = $user['status'];

    if ($oldStatus === $status) {
        dpp_ok('The account already has this status.', [
            'user_id' => (int) $userId,
            'status' => $status
        ]);
    }

    try {
        $pdo->beginTransaction();

        $update = $pdo->prepare("
            UPDATE users
            SET status = :status
            WHERE id = :id
              AND role = 'CITIZEN'
        ");

        $update->execute([
            'status' => $status,
            'id' => $userId
        ]);

        audit_log(
            $pdo,
            $adminId,
            'CITIZEN_STATUS_UPDATED',
            'USER',
            (string) $userId,
            [
                'user_id' => $user['user_id'],
                'full_name' => $user['full_name'],
                'old_status' => $oldStatus,
                'new_status' => $status
            ]
        );

        $pdo->commit();

        dpp_ok('Citizen account status updated successfully.', [
            'user_id' => (int) $userId,
            'public_user_id' => $user['user_id'],
            'old_status' => $oldStatus,
            'status' => $status
        ]);

    } catch (PDOException $e) {

        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $e;
    }
}

dpp_fail('Method not allowed.', 405);
