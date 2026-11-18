
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/audit.php';
require_once __DIR__ . '/../../services/email.php';

$pdo = db();
$admin = dpp_require_role($pdo, 'ADMIN');
$method = $_SERVER['REQUEST_METHOD'];

// ==========================================
// ADMIN: VIEW COMPLAINTS AND ACTIVE OFFICERS
// ==========================================

if ($method === 'GET') {

    $status = trim((string)($_GET['status'] ?? ''));

    $allowedStatuses = [
        'SUBMITTED',
        'UNDER_REVIEW',
        'ASSIGNED',
        'INVESTIGATION_IN_PROGRESS',
        'RESOLVED',
        'CLOSED',
        'REJECTED'
    ];

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
            citizen.user_id AS citizen_user_id,
            citizen.full_name AS citizen_name,
            citizen.email AS citizen_email,
            citizen.phone AS citizen_phone,
            cc.name AS category_name,
            officer.full_name AS officer_name,
            ps.name AS police_station
        FROM complaints c
        INNER JOIN users citizen
            ON citizen.id = c.citizen_id
        INNER JOIN complaint_categories cc
            ON cc.id = c.category_id
        LEFT JOIN users officer
            ON officer.id = c.assigned_officer_id
        LEFT JOIN police_stations ps
            ON ps.id = c.police_station_id
    ";

    $params = [];

    if ($status !== '') {

        if (!in_array($status, $allowedStatuses, true)) {
            dpp_fail('Invalid complaint status filter.', 422);
        }

        $sql .= " WHERE c.status = :status";
        $params['status'] = $status;
    }

    $sql .= " ORDER BY c.submitted_at DESC LIMIT 200";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get active officers for assignment dropdown.
    $officerStmt = $pdo->query("
        SELECT
            u.id,
            u.user_id,
            u.full_name,
            op.designation,
            ps.name AS police_station
        FROM users u
        INNER JOIN officer_profiles op
            ON op.user_id = u.id
        LEFT JOIN police_stations ps
            ON ps.id = op.police_station_id
        WHERE u.role = 'OFFICER'
          AND u.status = 'ACTIVE'
        ORDER BY u.full_name ASC
    ");

    $officers = $officerStmt->fetchAll(PDO::FETCH_ASSOC);

    dpp_ok('Complaints retrieved successfully.', [
        'complaints' => $complaints,
        'officers' => $officers
    ]);
}

// ==========================================
// ADMIN: ASSIGN OFFICER OR UPDATE STATUS
// ==========================================

if ($method === 'PATCH' || $method === 'POST') {

    dpp_require_csrf();

    $data = dpp_input();

    // ======================================
    // ASSIGN COMPLAINT TO OFFICER
    // ======================================

    if (($data['action'] ?? '') === 'assign') {

        $complaintId = filter_var(
            $data['complaint_id'] ?? null,
            FILTER_VALIDATE_INT
        );

        $officerId = filter_var(
            $data['officer_id'] ?? null,
            FILTER_VALIDATE_INT
        );

        if (
            !$complaintId ||
            $complaintId < 1 ||
            !$officerId ||
            $officerId < 1
        ) {
            dpp_fail(
                'Valid complaint and officer IDs are required.',
                422
            );
        }

        try {

            $pdo->beginTransaction();

            // Lock complaint.
            $find = $pdo->prepare("
                SELECT
                    id,
                    citizen_id,
                    complaint_ref,
                    status
                FROM complaints
                WHERE id = :id
                FOR UPDATE
            ");

            $find->execute([
                'id' => $complaintId
            ]);

            $complaint = $find->fetch(PDO::FETCH_ASSOC);

            if (!$complaint) {
                $pdo->rollBack();
                dpp_fail('Complaint not found.', 404);
            }

            if (in_array(
                $complaint['status'],
                ['CLOSED', 'REJECTED', 'RESOLVED'],
                true
            )) {
                $pdo->rollBack();
                dpp_fail(
                    'This complaint cannot be assigned.',
                    409
                );
            }

            // Verify active officer and assigned station.
            $officerQuery = $pdo->prepare("
                SELECT
                    u.id,
                    u.full_name,
                    op.police_station_id
                FROM users u
                INNER JOIN officer_profiles op
                    ON op.user_id = u.id
                WHERE u.id = :id
                  AND u.role = 'OFFICER'
                  AND u.status = 'ACTIVE'
                LIMIT 1
            ");

            $officerQuery->execute([
                'id' => $officerId
            ]);

            $officer = $officerQuery->fetch(PDO::FETCH_ASSOC);

            if (!$officer) {
                $pdo->rollBack();
                dpp_fail('Active officer not found.', 404);
            }

            if (empty($officer['police_station_id'])) {
                $pdo->rollBack();
                dpp_fail(
                    'The selected officer has no police station assigned.',
                    422
                );
            }

            $oldStatus = $complaint['status'];

            // Assign officer and update complaint status.
            $update = $pdo->prepare("
                UPDATE complaints
                SET
                    assigned_officer_id = :officer_id,
                    police_station_id = :station_id,
                    status = 'ASSIGNED'
                WHERE id = :id
            ");

            $update->execute([
                'officer_id' => $officerId,
                'station_id' => $officer['police_station_id'],
                'id' => $complaintId
            ]);

            // Save complaint history.
            $history = $pdo->prepare("
                INSERT INTO complaint_updates
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
                    'ASSIGNED',
                    :remark,
                    1
                )
            ");

            $history->execute([
                'complaint_id' => $complaintId,
                'updated_by' => $admin['id'],
                'old_status' => $oldStatus,
                'remark' => 'Complaint assigned to officer '
                    . $officer['full_name']
            ]);

            // Notify officer.
            $notification = $pdo->prepare("
                INSERT INTO notifications
                (
                    user_id,
                    complaint_id,
                    type,
                    title,
                    message
                )
                VALUES
                (
                    :user_id,
                    :complaint_id,
                    'COMPLAINT_ASSIGNED',
                    :title,
                    :message
                )
            ");

            $notification->execute([
                'user_id' => $officerId,
                'complaint_id' => $complaintId,
                'title' => 'New complaint assigned',
                'message' => 'Complaint '
                    . $complaint['complaint_ref']
                    . ' has been assigned to you.'
            ]);

            // Notify citizen.
            $citizenNotification = $pdo->prepare("
                INSERT INTO notifications
                (
                    user_id,
                    complaint_id,
                    type,
                    title,
                    message
                )
                VALUES
                (
                    :user_id,
                    :complaint_id,
                    'STATUS_CHANGED',
                    :title,
                    :message
                )
            ");

            $citizenNotification->execute([
                'user_id' => $complaint['citizen_id'],
                'complaint_id' => $complaintId,
                'title' => 'Complaint assigned',
                'message' => 'Your complaint '
                    . $complaint['complaint_ref']
                    . ' has been assigned to a police officer.'
            ]);

            // Record audit log.
            audit_log(
                $pdo,
                (int)$admin['id'],
                'COMPLAINT_ASSIGNED',
                'COMPLAINT',
                (string)$complaintId,
                [
                    'officer_id' => $officerId,
                    'officer_name' => $officer['full_name'],
                    'old_status' => $oldStatus,
                    'new_status' => 'ASSIGNED'
                ]
            );

            $pdo->commit();

            dpp_ok('Complaint assigned successfully.', [
                'complaint_id' => $complaintId,
                'officer_id' => $officerId,
                'officer_name' => $officer['full_name'],
                'status' => 'ASSIGNED'
            ]);

        } catch (Throwable $e) {

            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            throw $e;
        }
    }

    // ======================================
    // UPDATE COMPLAINT STATUS
    // ======================================

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

    $rejectionReason = trim(
        (string)($data['rejection_reason'] ?? '')
    );

    $allowedStatuses = [
        'UNDER_REVIEW',
        'INVESTIGATION_IN_PROGRESS',
        'RESOLVED',
        'CLOSED',
        'REJECTED'
    ];

    if (!$complaintId || $complaintId < 1) {
        dpp_fail('A valid complaint ID is required.', 422);
    }

    if (!in_array($newStatus, $allowedStatuses, true)) {
        dpp_fail('Invalid status selected.', 422);
    }

    if (
        mb_strlen($remark) < 3 ||
        mb_strlen($remark) > 1000
    ) {
        dpp_fail(
            'Please enter a remark between 3 and 1000 characters.',
            422
        );
    }

    if (
        $newStatus === 'REJECTED' &&
        $rejectionReason === ''
    ) {
        dpp_fail('A rejection reason is required.', 422);
    }

    if (mb_strlen($rejectionReason) > 500) {
        dpp_fail('Rejection reason is too long.', 422);
    }

    try {

        $pdo->beginTransaction();

        // Find and lock complaint.
        $find = $pdo->prepare("
            SELECT
                c.id,
                c.citizen_id,
                c.complaint_ref,
                c.status,
                citizen.full_name AS citizen_name,
                citizen.email AS citizen_email
            FROM complaints c
            INNER JOIN users citizen
                ON citizen.id = c.citizen_id
            WHERE c.id = :id
            FOR UPDATE
        ");

        $find->execute([
            'id' => $complaintId
        ]);

        $complaint = $find->fetch(PDO::FETCH_ASSOC);

        if (!$complaint) {
            $pdo->rollBack();
            dpp_fail('Complaint not found.', 404);
        }

        $oldStatus = $complaint['status'];

        if ($oldStatus === $newStatus) {
            $pdo->rollBack();
            dpp_fail(
                'Complaint already has this status.',
                409
            );
        }

        if (in_array(
            $oldStatus,
            ['CLOSED', 'REJECTED'],
            true
        )) {
            $pdo->rollBack();
            dpp_fail(
                'A closed or rejected complaint cannot be updated.',
                409
            );
        }

        // Update status.
        $update = $pdo->prepare("
            UPDATE complaints
            SET
                status = :status,
                rejection_reason = :rejection_reason,
                resolved_at = CASE
                    WHEN :is_resolved = 1
                    THEN COALESCE(resolved_at, NOW())
                    ELSE resolved_at
                END
            WHERE id = :id
        ");

        $isResolved = in_array(
            $newStatus,
            ['RESOLVED', 'CLOSED'],
            true
        ) ? 1 : 0;

        $update->execute([
            'status' => $newStatus,
            'rejection_reason' => $newStatus === 'REJECTED'
                ? $rejectionReason
                : null,
            'is_resolved' => $isResolved,
            'id' => $complaintId
        ]);

        // Save complaint history.
        $history = $pdo->prepare("
            INSERT INTO complaint_updates
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
            )
        ");

        $history->execute([
            'complaint_id' => $complaintId,
            'updated_by' => $admin['id'],
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'remark' => $remark
        ]);

        // Notify citizen.
        $notification = $pdo->prepare("
            INSERT INTO notifications
            (
                user_id,
                complaint_id,
                type,
                title,
                message
            )
            VALUES
            (
                :user_id,
                :complaint_id,
                'STATUS_CHANGED',
                :title,
                :message
            )
        ");

        $notification->execute([
            'user_id' => $complaint['citizen_id'],
            'complaint_id' => $complaintId,
            'title' => 'Complaint status updated',
            'message' => 'Your complaint '
                . $complaint['complaint_ref']
                . ' status changed to '
                . $newStatus
                . '. Remark: '
                . $remark
        ]);

        // Record audit log.
        audit_log(
            $pdo,
            (int)$admin['id'],
            'COMPLAINT_STATUS_UPDATED',
            'COMPLAINT',
            (string)$complaintId,
            [
                'complaint_ref' => $complaint['complaint_ref'],
                'old_status' => $oldStatus,
                'new_status' => $newStatus
            ]
        );

        $pdo->commit();

        // Send citizen email after successful database update.
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
                'Complaint status email error: '
                . $emailError->getMessage()
            );
        }

        dpp_ok('Complaint status updated successfully.', [
            'complaint_id' => $complaintId,
            'complaint_ref' => $complaint['complaint_ref'],
            'old_status' => $oldStatus,
            'new_status' => $newStatus
        ]);

    } catch (Throwable $e) {

        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $e;
    }
}

// ==========================================
// METHOD NOT ALLOWED
// ==========================================

dpp_fail('Method not allowed.', 405);
