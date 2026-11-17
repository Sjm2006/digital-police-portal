
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';

$pdo = db();
$user = dpp_require_role($pdo, 'CITIZEN');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = $pdo->prepare(
        "SELECT
            id,
            complaint_id,
            type,
            title,
            message,
            is_read,
            created_at
         FROM notifications
         WHERE user_id = :user_id
         ORDER BY created_at DESC
         LIMIT 50"
    );

    $stmt->execute(['user_id' => $user['id']]);

    dpp_ok('Notifications retrieved successfully.', [
        'notifications' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {

    dpp_require_csrf();

    $input = dpp_input();
    $notificationId = filter_var(
        $input['notification_id'] ?? null,
        FILTER_VALIDATE_INT
    );

    if (!$notificationId || $notificationId < 1) {
        dpp_fail('A valid notification ID is required.', 422);
    }

    $stmt = $pdo->prepare(
        "UPDATE notifications
         SET is_read = 1,
             read_at = CURRENT_TIMESTAMP
         WHERE id = :id
           AND user_id = :user_id"
    );

    $stmt->execute([
        'id' => $notificationId,
        'user_id' => $user['id']
    ]);

    if ($stmt->rowCount() === 0) {
        // Check whether it already exists and is already read.
        $check = $pdo->prepare(
            "SELECT id FROM notifications
             WHERE id = :id AND user_id = :user_id"
        );

        $check->execute([
            'id' => $notificationId,
            'user_id' => $user['id']
        ]);

        if (!$check->fetch()) {
            dpp_fail('Notification not found.', 404);
        }
    }

    dpp_ok('Notification marked as read.');
}

dpp_fail('Method not allowed.', 405);
