<?php
declare(strict_types=1);

/**
 * One-time initial administrator creation (CLI only).
 *
 *   php backend/cli/create_admin.php
 *
 * Security properties:
 *  - Refuses to run outside the PHP CLI (cannot be triggered over HTTP; folder also denied by .htaccess).
 *  - Refuses to run if ANY administrator already exists => permanently disabled after first success.
 *  - Serialised with a MySQL named lock so two concurrent runs cannot both succeed.
 *  - Password is entered interactively (hidden where the OS allows) and is never written to disk, logs or argv.
 *    For automation you may set ADMIN_SEED_NAME / _EMAIL / _PHONE / _PASSWORD environment variables;
 *    unset them afterwards.
 *  - Stored as password_hash(); the action is recorded in audit_logs without secrets.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../helpers/ids.php';
require_once __DIR__ . '/../helpers/audit.php';

function cli_fail(string $msg): never
{
    fwrite(STDERR, "ERROR: {$msg}\n");
    exit(1);
}

function cli_prompt(string $label): string
{
    echo $label . ': ';
    return trim((string) fgets(STDIN));
}

function cli_prompt_hidden(string $label): string
{
    if (stripos(PHP_OS_FAMILY, 'Windows') === 0) {
        $cmd = 'powershell -NoProfile -Command "$p = Read-Host \'' . $label . '\' -AsSecureString; '
             . '[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($p))"';
        return trim((string) shell_exec($cmd));
    }
    echo $label . ': ';
    shell_exec('stty -echo');
    $value = trim((string) fgets(STDIN));
    shell_exec('stty echo');
    echo "\n";
    return $value;
}

try {
    $pdo = db();
} catch (Throwable $e) {
    cli_fail('Cannot connect to the database. Check backend/.env. (' . $e->getMessage() . ')');
}

// Serialise concurrent runs.
$lock = $pdo->query("SELECT GET_LOCK('dpp_admin_bootstrap', 10)")->fetchColumn();
if ((int) $lock !== 1) {
    cli_fail('Could not acquire setup lock. Try again.');
}

if ((int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'ADMIN'")->fetchColumn() > 0) {
    cli_fail('An administrator already exists. Initial setup is disabled. Use the admin dashboard to manage accounts.');
}

echo "Digital Police Portal: initial administrator setup\n\n";

$name  = getenv('ADMIN_SEED_NAME')  ?: cli_prompt('Full name');
$email = normalize_email(getenv('ADMIN_SEED_EMAIL') ?: cli_prompt('Email'));
$phoneRaw = getenv('ADMIN_SEED_PHONE') ?: cli_prompt('Mobile number (10 digits)');
$password = getenv('ADMIN_SEED_PASSWORD') ?: cli_prompt_hidden('Password (min 12 chars)');
if (!getenv('ADMIN_SEED_PASSWORD')) {
    $confirm = cli_prompt_hidden('Confirm password');
    if (!hash_equals($password, $confirm)) {
        cli_fail('Passwords do not match.');
    }
}

$errors = [];
if (mb_strlen($name) < 3 || mb_strlen($name) > 120) { $errors[] = 'Name must be 3-120 characters.'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) { $errors[] = 'Email is not valid.'; }
$phone = normalize_phone($phoneRaw);
if ($phone === null) { $errors[] = 'Mobile number must be a valid 10-digit Indian number.'; }
if ($e = validate_password_strength($password)) { $errors[] = $e; }
if ($errors) {
    cli_fail(implode("\n       ", $errors));
}

$dup = $pdo->prepare('SELECT 1 FROM users WHERE email = ? OR phone = ?');
$dup->execute([$email, $phone]);
if ($dup->fetchColumn()) {
    cli_fail('Email or mobile number is already registered.');
}

try {
    $pdo->beginTransaction();
    $userId = generate_user_id($pdo, 'ADMIN');
    $pdo->prepare(
        "INSERT INTO users (user_id, full_name, email, phone, password_hash, role, status)
         VALUES (?, ?, ?, ?, ?, 'ADMIN', 'ACTIVE')"
    )->execute([$userId, $name, $email, $phone, password_hash($password, PASSWORD_DEFAULT)]);
    $id = (int) $pdo->lastInsertId();
    $pdo->prepare('INSERT INTO admin_profiles (user_id) VALUES (?)')->execute([$id]);
    audit_log($pdo, $id, 'ADMIN_BOOTSTRAPPED', 'user', $userId, ['method' => 'cli']);
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) { $pdo->rollBack(); }
    cli_fail('Setup failed: ' . $e->getMessage());
} finally {
    $pdo->query("SELECT RELEASE_LOCK('dpp_admin_bootstrap')");
}

echo "\nAdministrator created. Login ID: {$userId}\n";
echo "Setup is now disabled. Unset any ADMIN_SEED_* variables you used.\n";
