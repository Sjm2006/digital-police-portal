
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    dpp_fail('Method not allowed.', 405);
}

$pdo = db();
$admin = dpp_require_role($pdo, 'ADMIN');

// Complaint totals grouped by status.
$statusStmt = $pdo->query(
    "SELECT status, COUNT(*) AS total
     FROM complaints
     GROUP BY status"
);

$statusRows = $statusStmt->fetchAll(PDO::FETCH_ASSOC);

$complaintStats = [
    'total' => 0,
    'submitted' => 0,
    'under_review' => 0,
    'assigned' => 0,
    'investigation_in_progress' => 0,
    'resolved' => 0,
    'closed' => 0,
    'rejected' => 0
];

foreach ($statusRows as $row) {
    $status = strtolower($row['status']);
    $count = (int) $row['total'];

    $complaintStats['total'] += $count;

    if (array_key_exists($status, $complaintStats)) {
        $complaintStats[$status] = $count;
    }
}

// Citizen and officer counts.
$userStmt = $pdo->query(
    "SELECT
        SUM(CASE WHEN role = 'CITIZEN' AND status = 'ACTIVE' THEN 1 ELSE 0 END) AS total_citizens,
        SUM(CASE WHEN role = 'OFFICER' AND status = 'ACTIVE' THEN 1 ELSE 0 END) AS total_officers
     FROM users"
);

$userStats = $userStmt->fetch(PDO::FETCH_ASSOC);

// Latest complaints.
$recentStmt = $pdo->query(
    "SELECT
        c.complaint_ref,
        c.subject,
        c.status,
        c.submitted_at,
        u.full_name AS citizen_name,
        cat.name AS category_name
     FROM complaints c
     INNER JOIN users u ON u.id = c.citizen_id
     INNER JOIN complaint_categories cat ON cat.id = c.category_id
     ORDER BY c.submitted_at DESC
     LIMIT 5"
);

$recentComplaints = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

dpp_ok('Admin dashboard statistics retrieved successfully.', [
    'complaints' => $complaintStats,
    'users' => [
        'citizens' => (int) ($userStats['total_citizens'] ?? 0),
        'officers' => (int) ($userStats['total_officers'] ?? 0)
    ],
    'recent_complaints' => $recentComplaints
]);
