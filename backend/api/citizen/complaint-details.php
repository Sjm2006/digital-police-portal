
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    dpp_fail('Method not allowed.', 405);
}

$pdo = db();
$user = dpp_require_role($pdo, 'CITIZEN');

$complaintRef = trim($_GET['ref'] ?? '');

if ($complaintRef === '') {
    dpp_fail('Complaint reference is required.', 422);
}

// Fetch only a complaint belonging to the logged-in citizen.
$stmt = $pdo->prepare(
    "SELECT
        c.id,
        c.complaint_ref,
        c.subject,
        c.description,
        c.incident_date,
        c.incident_location,
        c.status,
        c.rejection_reason,
        c.submitted_at,
        c.resolved_at,
        cat.name AS category_name,
        ps.name AS police_station_name
     FROM complaints c
     INNER JOIN complaint_categories cat
        ON cat.id = c.category_id
     LEFT JOIN police_stations ps
        ON ps.id = c.police_station_id
     WHERE c.complaint_ref = :complaint_ref
       AND c.citizen_id = :citizen_id
     LIMIT 1"
);

$stmt->execute([
    'complaint_ref' => $complaintRef,
    'citizen_id' => $user['id']
]);

$complaint = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$complaint) {
    dpp_fail('Complaint not found.', 404);
}

// Fetch citizen-visible status history.
$historyStmt = $pdo->prepare(
    "SELECT
        cu.old_status,
        cu.new_status,
        cu.remark,
        cu.created_at
     FROM complaint_updates cu
     WHERE cu.complaint_id = :complaint_id
       AND cu.is_visible_to_citizen = 1
     ORDER BY cu.created_at ASC"
);

$historyStmt->execute([
    'complaint_id' => $complaint['id']
]);

$complaint['history'] = $historyStmt->fetchAll(PDO::FETCH_ASSOC);

dpp_ok('Complaint details retrieved successfully.', $complaint);
