
<?php
require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/ids.php';
require_once __DIR__ . '/../../helpers/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    dpp_fail('Method not allowed.', 405);
}

$data = dpp_input();

$name = trim((string)($data['full_name'] ?? ''));
$email = dpp_normalize_email((string)($data['email'] ?? ''));
$phone = dpp_normalize_phone((string)($data['phone'] ?? ''));
$password = (string)($data['password'] ?? '');

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

$pdo = db();

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

    $userId = generate_user_id($pdo, 'CITIZEN');
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insert = $pdo->prepare(
        "INSERT INTO users
        (user_id, full_name, email, phone, password_hash, role, status)
        VALUES
        (:user_id, :name, :email, :phone, :password_hash, 'CITIZEN', 'ACTIVE')"
    );

    $insert->execute([
        'user_id' => $userId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'password_hash' => $passwordHash
    ]);

    $internalId = (int)$pdo->lastInsertId();

    $profile = $pdo->prepare(
        'INSERT INTO citizen_profiles (user_id) VALUES (:user_id)'
    );

    $profile->execute(['user_id' => $internalId]);

    audit_log(
        $pdo,
        $internalId,
        'CITIZEN_REGISTERED',
        'USER',
        (string)$internalId,
        null
    );

    $pdo->commit();

    dpp_start_session();
    session_regenerate_id(true);

    $_SESSION['auth_user_id'] = $internalId;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    dpp_ok('Registration successful.', [
        'user_id' => $userId,
        'full_name' => $name,
        'email' => $email,
        'role' => 'CITIZEN',
        'csrf_token' => $_SESSION['csrf_token']
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
