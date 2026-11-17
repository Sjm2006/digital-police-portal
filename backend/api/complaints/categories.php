
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    dpp_fail('Method not allowed.', 405);
}

$pdo = db();

$stmt = $pdo->query(
    "SELECT id, name, description
     FROM complaint_categories
     WHERE is_active = 1
     ORDER BY name ASC"
);

$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

dpp_ok('Complaint categories retrieved successfully.', $categories);
