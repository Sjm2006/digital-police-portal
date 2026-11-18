
<?php

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers/auth.php';

$pdo = db();

dpp_start_session();

$user = dpp_require_user($pdo);

$method = $_SERVER['REQUEST_METHOD'];

// GET: Retrieve logged-in user's profile
if ($method === 'GET') {

    $stmt = $pdo->prepare("
        SELECT
            u.id,
            u.user_id,
            u.full_name,
            u.email,
            u.phone,
            u.role,
            u.status,
            u.created_at,
            u.last_login_at,
            op.designation,
            op.department,
            op.police_station_id,
            ps.name AS police_station_name,
            ps.district AS police_station_district
        FROM users u
        LEFT JOIN officer_profiles op
            ON op.user_id = u.id
        LEFT JOIN police_stations ps
            ON ps.id = op.police_station_id
        WHERE u.id = ?
        LIMIT 1
    ");

    $stmt->execute([$user['id']]);

    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        dpp_fail('Profile not found.', 404);
    }

    dpp_ok('Profile retrieved successfully.', [
        'profile' => $profile
    ]);
}

// PATCH: Update profile
if ($method === 'PATCH') {

    dpp_require_csrf();

    $input = dpp_input();

    $fullName = trim($input['full_name'] ?? '');
    $phone = trim($input['phone'] ?? '');

    if ($fullName === '' || mb_strlen($fullName) > 120) {
        dpp_fail('Please enter a valid full name.', 422);
    }

    if ($phone === '' || !preg_match('/^\+?[0-9]{10,15}$/', $phone)) {
        dpp_fail('Please enter a valid phone number.', 422);
    }

    $currentPassword = $input['current_password'] ?? '';
    $newPassword = $input['new_password'] ?? '';

    // Password change is optional
    if ($newPassword !== '') {

        if ($currentPassword === '') {
            dpp_fail('Current password is required.', 422);
        }

        if (strlen($newPassword) < 8) {
            dpp_fail('New password must contain at least 8 characters.', 422);
        }

        $stmt = $pdo->prepare("
            SELECT password_hash
            FROM users
            WHERE id = ?
            LIMIT 1
        ");

        $stmt->execute([$user['id']]);

        $passwordHash = $stmt->fetchColumn();

        if (!$passwordHash || !password_verify($currentPassword, $passwordHash)) {
            dpp_fail('Current password is incorrect.', 422);
        }
    }

    try {

        if ($newPassword !== '') {

            $newPasswordHash = password_hash(
                $newPassword,
                PASSWORD_DEFAULT
            );

            $stmt = $pdo->prepare("
                UPDATE users
                SET
                    full_name = ?,
                    phone = ?,
                    password_hash = ?,
                    updated_at = NOW()
                WHERE id = ?
            ");

            $stmt->execute([
                $fullName,
                $phone,
                $newPasswordHash,
                $user['id']
            ]);

        } else {

            $stmt = $pdo->prepare("
                UPDATE users
                SET
                    full_name = ?,
                    phone = ?,
                    updated_at = NOW()
                WHERE id = ?
            ");

            $stmt->execute([
                $fullName,
                $phone,
                $user['id']
            ]);
        }

        dpp_ok('Profile updated successfully.', [
            'full_name' => $fullName,
            'phone' => $phone
        ]);

    } catch (PDOException $e) {

        dpp_fail('Unable to update profile. Please try again.', 500);
    }
}

dpp_fail('Method not allowed.', 405);
