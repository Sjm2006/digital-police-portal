
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    dpp_fail('Method not allowed.', 405);
}

$pdo = db();
$officer = dpp_require_role($pdo, 'OFFICER');

$statsStmt = $pdo->prepare(
    "SELECT
        COUNT(*) AS total_assigned,
        SUM(CASE WHEN status IN (
            'SUBMITTED',
            'ASSIGNED',
            'UNDER_REVIEW'
        ) THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'INVESTIGATION_IN_PROGRESS'
            THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'RESOLVED'
            THEN 1 ELSE 0 END) AS resolved,
        SUM(CASE WHEN status = 'CLOSED'
            THEN 1 ELSE 0 END) AS closed
     FROM complaints
     WHERE assigned_officer_id = :officer_id"
);

$statsStmt->execute([
    'officer_id' => $officer['id']
]);

$stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

$recentStmt = $pdo->prepare(
    "SELECT
        c.id,
        c.complaint_ref,
        c.subject,
        c.status,
        c.submitted_at,
        c.updated_at,
        cc.name AS category_name,
        citizen.full_name AS citizen_name
     FROM complaints c
     INNER JOIN complaint_categories cc
        ON cc.id = c.category_id
     INNER JOIN users citizen
        ON citizen.id = c.citizen_id
     WHERE c.assigned_officer_id = :officer_id
     ORDER BY c.updated_at DESC
     LIMIT 5"
);

$recentStmt->execute([
    'officer_id' => $officer['id']
]);

$recentComplaints = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

dpp_ok(
    'Officer dashboard retrieved successfully.',
    [
        'stats' => $stats,
        'recent_complaints' => $recentComplaints
    ]
);
