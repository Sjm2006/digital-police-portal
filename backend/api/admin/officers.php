
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/ids.php';
require_once __DIR__ . '/../../helpers/audit.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    dpp_start_session();
}

$pdo = db();
dpp_require_role($pdo, 'ADMIN');

$method = $_SERVER['REQUEST_METHOD'];

function officer_require_csrf(): void
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

function officer_validate_station(PDO $pdo, int $stationId): void
{
    $stmt = $pdo->prepare(
        'SELECT id FROM police_stations
         WHERE id = :id AND is_active = 1
         LIMIT 1'
    );
    $stmt->execute(['id' => $stationId]);

    if (!$stmt->fetchColumn()) {
        dpp_fail('Please select an active police station.', 422);
    }
}

/*
|--------------------------------------------------------------------------
| GET: List officers and active police stations
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {
    $search = trim((string) ($_GET['search'] ?? ''));
    $status = strtoupper(trim((string) ($_GET['status'] ?? '')));

    $sql = "
        SELECT
            u.id,
            u.user_id,
            u.full_name,
            u.email,
            u.phone,
            u.status,
            u.created_at,
            op.designation,
            op.department,
            op.police_station_id,
            ps.station_code,
            ps.name AS police_station_name,
            ps.district,
            ps.state
        FROM users u
        INNER JOIN officer_profiles op ON op.user_id = u.id
        LEFT JOIN police_stations ps ON ps.id = op.police_station_id
        WHERE u.role = 'OFFICER'
    ";

    $params = [];

    if ($search !== '') {
        $sql .= "
            AND (
                u.full_name LIKE :search_name
                OR u.email LIKE :search_email
                OR u.user_id LIKE :search_user_id
                OR u.phone LIKE :search_phone
                OR ps.name LIKE :search_station
            )
        ";

        $term = '%' . $search . '%';
        $params = [
            'search_name' => $term,
            'search_email' => $term,
            'search_user_id' => $term,
            'search_phone' => $term,
            'search_station' => $term
        ];
    }

    if ($status !== '') {
        if (!in_array($status, ['ACTIVE', 'INACTIVE', 'SUSPENDED'], true)) {
            dpp_fail('Invalid officer status filter.', 422);
        }

        $sql .= ' AND u.status = :status';
        $params['status'] = $status;
    }

    $sql .= ' ORDER BY u.created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $officers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stationStmt = $pdo->query(
        'SELECT id, station_code, name, district, state
         FROM police_stations
         WHERE is_active = 1
         ORDER BY name ASC'
    );

    dpp_ok('Officer records retrieved successfully.', [
        'officers' => $officers,
        'stations' => $stationStmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
}

/*
|--------------------------------------------------------------------------
| POST: Create officer
|--------------------------------------------------------------------------
*/
if ($method === 'POST') {
    officer_require_csrf();

    $data = dpp_input();

    $name = trim((string) ($data['full_name'] ?? ''));
    $email = dpp_normalize_email((string) ($data['email'] ?? ''));
    $phone = dpp_normalize_phone((string) ($data['phone'] ?? ''));
    $password = (string) ($data['password'] ?? '');
    $designation = trim((string) ($data['designation'] ?? ''));
    $department = trim((string) ($data['department'] ?? ''));
    $stationId = filter_var(
        $data['police_station_id'] ?? null,
        FILTER_VALIDATE_INT
    );

    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
        dpp_fail('Please enter a valid full name.', 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
        dpp_fail('Please enter a valid email address.', 422);
    }

    if (!preg_match('/^[0-9]{10}$/', $phone)) {
        dpp_fail('Enter a valid 10-digit Indian mobile number.', 422);
    }

    if (!dpp_valid_password($password)) {
        dpp_fail(
            'Password must contain at least 12 characters, uppercase, lowercase, a number and a symbol.',
            422
        );
    }

    if (
        mb_strlen($designation) < 2 ||
        mb_strlen($designation) > 100 ||
        mb_strlen($department) < 2 ||
        mb_strlen($department) > 100
    ) {
        dpp_fail('Enter a valid designation and department.', 422);
    }

    if (!$stationId || $stationId < 1) {
        dpp_fail('Please select a police station.', 422);
    }

    officer_validate_station($pdo, (int) $stationId);

    $adminId = (int) ($_SESSION['auth_user_id'] ?? 0);

    if ($adminId < 1) {
        dpp_fail('Admin session is invalid. Please log in again.', 401);
    }

    try {
        $pdo->beginTransaction();

        $check = $pdo->prepare(
            'SELECT id FROM users
             WHERE email = :email OR phone = :phone
             LIMIT 1'
        );
        $check->execute([
            'email' => $email,
            'phone' => $phone
        ]);

        if ($check->fetch()) {
            $pdo->rollBack();
            dpp_fail('Email or phone number is already registered.', 409);
        }

        $publicId = generate_user_id($pdo, 'OFFICER');
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $insertUser = $pdo->prepare(
            "INSERT INTO users
            (user_id, full_name, email, phone, password_hash, role, status)
            VALUES
            (:user_id, :full_name, :email, :phone, :password_hash, 'OFFICER', 'ACTIVE')"
        );

        $insertUser->execute([
            'user_id' => $publicId,
            'full_name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password_hash' => $passwordHash
        ]);

        $officerId = (int) $pdo->lastInsertId();

        $insertProfile = $pdo->prepare(
            'INSERT INTO officer_profiles
            (user_id, designation, department, police_station_id, created_by)
            VALUES
            (:user_id, :designation, :department, :station_id, :created_by)'
        );

        $insertProfile->execute([
            'user_id' => $officerId,
            'designation' => $designation,
            'department' => $department,
            'station_id' => (int) $stationId,
            'created_by' => $adminId
        ]);

        audit_log(
            $pdo,
            $adminId,
            'OFFICER_CREATED',
            'USER',
            (string) $officerId,
            ['user_id' => $publicId]
        );

        $pdo->commit();

        dpp_ok('Officer account created successfully.', [
            'officer' => [
                'id' => $officerId,
                'user_id' => $publicId,
                'full_name' => $name,
                'email' => $email,
                'phone' => $phone,
                'designation' => $designation,
                'department' => $department,
                'police_station_id' => (int) $stationId,
                'status' => 'ACTIVE'
            ]
        ], 201);

    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        if ($e->getCode() === '23000') {
            dpp_fail('An account with these details already exists.', 409);
        }

        throw $e;
    }
}

/*
|--------------------------------------------------------------------------
| PATCH: Update officer details or account status
|--------------------------------------------------------------------------
*/
if ($method === 'PATCH') {
    officer_require_csrf();

    $data = dpp_input();

    $officerId = filter_var(
        $data['officer_id'] ?? $data['id'] ?? null,
        FILTER_VALIDATE_INT
    );

    if (!$officerId || $officerId < 1) {
        dpp_fail('A valid officer ID is required.', 422);
    }

    $find = $pdo->prepare(
        "SELECT id FROM users
         WHERE id = :id AND role = 'OFFICER'
         LIMIT 1"
    );
    $find->execute(['id' => $officerId]);

    if (!$find->fetch()) {
        dpp_fail('Officer not found.', 404);
    }

    $name = trim((string) ($data['full_name'] ?? ''));
    $email = dpp_normalize_email((string) ($data['email'] ?? ''));
    $phone = dpp_normalize_phone((string) ($data['phone'] ?? ''));
    $designation = trim((string) ($data['designation'] ?? ''));
    $department = trim((string) ($data['department'] ?? ''));
    $stationId = filter_var(
        $data['police_station_id'] ?? null,
        FILTER_VALIDATE_INT
    );
    $status = strtoupper(trim((string) ($data['status'] ?? '')));
    $password = (string) ($data['password'] ?? '');

    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
        dpp_fail('Please enter a valid full name.', 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
        dpp_fail('Please enter a valid email address.', 422);
    }

    if (!preg_match('/^[0-9]{10}$/', $phone)) {
        dpp_fail('Enter a valid 10-digit Indian mobile number.', 422);
    }

    if (
        mb_strlen($designation) < 2 ||
        mb_strlen($designation) > 100 ||
        mb_strlen($department) < 2 ||
        mb_strlen($department) > 100
    ) {
        dpp_fail('Enter a valid designation and department.', 422);
    }

    if (!$stationId || $stationId < 1) {
        dpp_fail('Please select a police station.', 422);
    }

    if (!in_array($status, ['ACTIVE', 'INACTIVE', 'SUSPENDED'], true)) {
        dpp_fail('Select a valid account status.', 422);
    }

    if ($password !== '' && !dpp_valid_password($password)) {
        dpp_fail(
            'New password must contain at least 12 characters, uppercase, lowercase, a number and a symbol.',
            422
        );
    }

    officer_validate_station($pdo, (int) $stationId);

    $duplicate = $pdo->prepare(
        'SELECT id FROM users
         WHERE (email = :email OR phone = :phone)
         AND id <> :id
         LIMIT 1'
    );
    $duplicate->execute([
        'email' => $email,
        'phone' => $phone,
        'id' => $officerId
    ]);

    if ($duplicate->fetch()) {
        dpp_fail('Another account already uses this email or phone number.', 409);
    }

    try {
        $pdo->beginTransaction();

        if ($password !== '') {
            $updateUser = $pdo->prepare(
                'UPDATE users
                 SET full_name = :name,
                     email = :email,
                     phone = :phone,
                     password_hash = :password_hash,
                     status = :status
                 WHERE id = :id AND role = "OFFICER"'
            );

            $updateUser->execute([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'status' => $status,
                'id' => $officerId
            ]);
        } else {
            $updateUser = $pdo->prepare(
                'UPDATE users
                 SET full_name = :name,
                     email = :email,
                     phone = :phone,
                     status = :status
                 WHERE id = :id AND role = "OFFICER"'
            );

            $updateUser->execute([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'status' => $status,
                'id' => $officerId
            ]);
        }

        $updateProfile = $pdo->prepare(
            'UPDATE officer_profiles
             SET designation = :designation,
                 department = :department,
                 police_station_id = :station_id
             WHERE user_id = :user_id'
        );

        $updateProfile->execute([
            'designation' => $designation,
            'department' => $department,
            'station_id' => (int) $stationId,
            'user_id' => $officerId
        ]);

        $adminId = (int) ($_SESSION['auth_user_id'] ?? 0);

        audit_log(
            $pdo,
            $adminId,
            'OFFICER_UPDATED',
            'USER',
            (string) $officerId,
            ['status' => $status]
        );

        $pdo->commit();

        dpp_ok('Officer details updated successfully.', [
            'officer_id' => (int) $officerId,
            'status' => $status
        ]);

    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        if ($e->getCode() === '23000') {
            dpp_fail('An account with these details already exists.', 409);
        }

        throw $e;
    }
}

dpp_fail('Method not allowed.', 405);
