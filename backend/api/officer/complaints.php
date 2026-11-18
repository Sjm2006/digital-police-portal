
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/audit.php';
require_once __DIR__ . '/../../services/email.php';

$pdo = db();
$officer = dpp_require_role($pdo, 'OFFICER');

$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| GET: Retrieve complaints assigned to the logged-in officer
|--------------------------------------------------------------------------
*/

if ($method === 'GET') {

    $complaintId = filter_var(
        $_GET['id'] ?? null,
        FILTER_VALIDATE_INT
    );

    $sql = "
        SELECT
            c.id,
            c.complaint_ref,
            c.subject,
            c.description,
            c.incident_date,
            c.incident_location,
            c.status,
            c.rejection_reason,
            c.submitted_at,
            c.updated_at,
            citizen.full_name AS citizen_name,
            citizen.email AS citizen_email,
            citizen.phone AS citizen_phone,
            cc.name AS category_name,
            ps.name AS police_station
        FROM complaints c
        INNER JOIN users citizen
            ON citizen.id = c.citizen_id
        INNER JOIN complaint_categories cc
            ON cc.id = c.category_id
        LEFT JOIN police_stations ps
            ON ps.id = c.police_station_id
        WHERE c.assigned_officer_id = :officer_id
    ";

    $params = [
        'officer_id' => $officer['id']
    ];

    if ($complaintId) {
        $sql .= " AND c.id = :complaint_id";
        $params['complaint_id'] = $complaintId;
    }

    $sql .= " ORDER BY c.updated_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($complaintId && empty($complaints)) {
        dpp_fail('Assigned complaint not found.', 404);
    }

    if ($complaintId) {
        $history = $pdo->prepare(
            "SELECT
                cu.old_status,
                cu.new_status,
                cu.remark,
                cu.created_at,
                u.full_name AS updated_by_name
             FROM complaint_updates cu
             LEFT JOIN users u ON u.id = cu.updated_by
             WHERE cu.complaint_id = :complaint_id
             ORDER BY cu.created_at DESC"
        );

        $history->execute([
            'complaint_id' => $complaintId
        ]);

        $complaints[0]['history'] =
            $history->fetchAll(PDO::FETCH_ASSOC);
    }

    dpp_ok(
        'Assigned complaints retrieved successfully.',
        $complaintId ? $complaints[0] : $complaints
    );
}

/*
|--------------------------------------------------------------------------
| PATCH / POST: Update an assigned complaint
|--------------------------------------------------------------------------
*/

if ($method === 'PATCH' || $method === 'POST') {

    dpp_require_csrf();

    $data = dpp_input();

    $complaintId = filter_var(
        $data['complaint_id'] ?? null,
        FILTER_VALIDATE_INT
    );

    $newStatus = strtoupper(
        trim((string)($data['status'] ?? ''))
    );

    $remark = trim(
        (string)($data['remark'] ?? '')
    );

    $allowedStatuses = [
        'UNDER_REVIEW',
        'INVESTIGATION_IN_PROGRESS',
        'RESOLVED'
    ];

    if (!$complaintId || $complaintId < 1) {
        dpp_fail('A valid complaint ID is required.', 422);
    }

    if (!in_array($newStatus, $allowedStatuses, true)) {
        dpp_fail('Invalid complaint status.', 422);
    }

    if (
        mb_strlen($remark) < 3 ||
        mb_strlen($remark) > 1000
    ) {
        dpp_fail(
            'Remark must contain between 3 and 1000 characters.',
            422
        );
    }

    try {

        $pdo->beginTransaction();

        /*
         * Lock only a complaint assigned to this officer.
         * This prevents officers from modifying other officers' cases.
         */

        $find = $pdo->prepare(
            "SELECT
                c.id,
                c.citizen_id,
                c.complaint_ref,
                c.status,
                citizen.full_name AS citizen_name,
                citizen.email AS citizen_email
             FROM complaints c
             INNER JOIN users citizen
                ON citizen.id = c.citizen_id
             WHERE c.id = :complaint_id
               AND c.assigned_officer_id = :officer_id
             FOR UPDATE"
        );

        $find->execute([
            'complaint_id' => $complaintId,
            'officer_id' => $officer['id']
        ]);

        $complaint = $find->fetch(PDO::FETCH_ASSOC);

        if (!$complaint) {
            $pdo->rollBack();
            dpp_fail(
                'Complaint not found or not assigned to you.',
                404
            );
        }

        $oldStatus = $complaint['status'];

        if ($oldStatus === $newStatus) {
            $pdo->rollBack();
            dpp_fail(
                'Complaint already has this status.',
                409
            );
        }

        if (
            in_array(
                $oldStatus,
                ['RESOLVED', 'CLOSED', 'REJECTED'],
                true
            )
        ) {
            $pdo->rollBack();
            dpp_fail(
                'This complaint can no longer be updated by the officer.',
                409
            );
        }

        $isResolved = $newStatus === 'RESOLVED' ? 1 : 0;

        $update = $pdo->prepare(
            "UPDATE complaints
             SET status = :status,
                 resolved_at = CASE
                     WHEN :is_resolved = 1
                     THEN COALESCE(resolved_at, NOW())
                     ELSE resolved_at
                 END
             WHERE id = :complaint_id
               AND assigned_officer_id = :officer_id"
        );

        $update->execute([
            'status' => $newStatus,
            'is_resolved' => $isResolved,
            'complaint_id' => $complaintId,
            'officer_id' => $officer['id']
        ]);

        // Store complaint status history.

        $history = $pdo->prepare(
            "INSERT INTO complaint_updates
             (
                 complaint_id,
                 updated_by,
                 old_status,
                 new_status,
                 remark,
                 is_visible_to_citizen
             )
             VALUES
             (
                 :complaint_id,
                 :updated_by,
                 :old_status,
                 :new_status,
                 :remark,
                 1
             )"
        );

        $history->execute([
            'complaint_id' => $complaintId,
            'updated_by' => $officer['id'],
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'remark' => $remark
        ]);

        // Create an in-app notification for the citizen.

        $notification = $pdo->prepare(
            "INSERT INTO notifications
             (user_id, complaint_id, type, title, message)
             VALUES
             (
                 :user_id,
                 :complaint_id,
                 'STATUS_CHANGED',
                 'Complaint status updated',
                 :message
             )"
        );

        $notification->execute([
            'user_id' => $complaint['citizen_id'],
            'complaint_id' => $complaintId,
            'message' =>
                'Your complaint ' .
                $complaint['complaint_ref'] .
                ' status changed to ' .
                $newStatus .
                '. Remark: ' .
                $remark
        ]);

        // Record the officer's action in the audit log.

        audit_log(
            $pdo,
            (int)$officer['id'],
            'OFFICER_COMPLAINT_STATUS_UPDATED',
            'COMPLAINT',
            (string)$complaintId,
            [
                'complaint_ref' => $complaint['complaint_ref'],
                'old_status' => $oldStatus,
                'new_status' => $newStatus
            ]
        );

        $pdo->commit();

        // Send an email after the database transaction succeeds.

        try {
            dpp_send_complaint_status_update(
                (string)($complaint['citizen_email'] ?? ''),
                (string)($complaint['citizen_name'] ?? 'Citizen'),
                (string)$complaint['complaint_ref'],
                $newStatus,
                $remark
            );
        } catch (Throwable $emailError) {
            error_log(
                'Officer status email error: ' .
                $emailError->getMessage()
            );
        }

        dpp_ok(
            'Complaint status updated successfully.',
            [
                'complaint_id' => $complaintId,
                'complaint_ref' => $complaint['complaint_ref'],
                'old_status' => $oldStatus,
                'new_status' => $newStatus
            ]
        );

    } catch (Throwable $e) {

        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $e;
    }
}

dpp_fail('Method not allowed.', 405);
