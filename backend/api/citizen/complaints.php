
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/audit.php';
require_once __DIR__ . '/../../services/email.php';

$pdo = db();
$user = dpp_require_role($pdo, 'CITIZEN');

$method = $_SERVER['REQUEST_METHOD'];

// Retrieve complaints belonging to the logged-in citizen.
if ($method === 'GET') {
    $stmt = $pdo->prepare(
        "SELECT
            c.id,
            c.complaint_ref,
            c.subject,
            c.description,
            c.incident_date,
            c.incident_location,
            c.status,
            c.submitted_at,
            c.updated_at,
            cc.name AS category_name
         FROM complaints c
         INNER JOIN complaint_categories cc
            ON cc.id = c.category_id
         WHERE c.citizen_id = :citizen_id
         ORDER BY c.submitted_at DESC"
    );

    $stmt->execute(['citizen_id' => $user['id']]);

    dpp_ok(
        'Your complaints retrieved successfully.',
        $stmt->fetchAll(PDO::FETCH_ASSOC)
    );
}

// Only GET and POST methods are allowed.
if ($method !== 'POST') {
    dpp_fail('Method not allowed.', 405);
}

dpp_require_csrf();

$data = dpp_input();

$categoryId = filter_var(
    $data['category_id'] ?? null,
    FILTER_VALIDATE_INT
);

$subject = trim((string)($data['subject'] ?? ''));
$description = trim((string)($data['description'] ?? ''));
$incidentDate = trim((string)($data['incident_date'] ?? ''));
$location = trim((string)($data['incident_location'] ?? ''));

// Validate complaint category.
if (!$categoryId || $categoryId < 1) {
    dpp_fail('Please select a valid complaint category.', 422);
}

// Validate subject.
if (mb_strlen($subject) < 5 || mb_strlen($subject) > 200) {
    dpp_fail('Subject must contain between 5 and 200 characters.', 422);
}

// Validate description.
if (mb_strlen($description) < 20) {
    dpp_fail('Please provide at least 20 characters in the description.', 422);
}

if (mb_strlen($description) > 10000) {
    dpp_fail('Complaint description is too long.', 422);
}

// Validate incident location.
if ($location === '' || mb_strlen($location) > 255) {
    dpp_fail('Please enter a valid incident location.', 422);
}

// Validate incident date.
$date = DateTime::createFromFormat('!Y-m-d', $incidentDate);

if (!$date || $date->format('Y-m-d') !== $incidentDate) {
    dpp_fail('Please enter a valid incident date.', 422);
}

if ($incidentDate > date('Y-m-d')) {
    dpp_fail('Incident date cannot be in the future.', 422);
}

// Verify that the selected category is active.
$category = $pdo->prepare(
    'SELECT id FROM complaint_categories
     WHERE id = :id AND is_active = 1'
);

$category->execute(['id' => $categoryId]);

if (!$category->fetch()) {
    dpp_fail('Selected complaint category is unavailable.', 422);
}

try {
    $pdo->beginTransaction();

    // Generate a unique yearly complaint reference number.
    $year = (int)date('Y');

    $sequence = $pdo->prepare(
        "INSERT IGNORE INTO complaint_sequences
         (seq_year, last_number)
         VALUES (:year, 0)"
    );

    $sequence->execute(['year' => $year]);

    $increment = $pdo->prepare(
        "UPDATE complaint_sequences
         SET last_number = last_number + 1
         WHERE seq_year = :year"
    );

    $increment->execute(['year' => $year]);

    $readSequence = $pdo->prepare(
        "SELECT last_number
         FROM complaint_sequences
         WHERE seq_year = :year
         FOR UPDATE"
    );

    $readSequence->execute(['year' => $year]);

    $number = (int)$readSequence->fetchColumn();

    $reference = sprintf('DPP-%04d-%06d', $year, $number);

    // Insert the complaint.
    $insert = $pdo->prepare(
        "INSERT INTO complaints
        (
            complaint_ref,
            citizen_id,
            category_id,
            subject,
            description,
            incident_date,
            incident_location,
            status
        )
        VALUES
        (
            :reference,
            :citizen_id,
            :category_id,
            :subject,
            :description,
            :incident_date,
            :location,
            'SUBMITTED'
        )"
    );

    $insert->execute([
        'reference' => $reference,
        'citizen_id' => $user['id'],
        'category_id' => $categoryId,
        'subject' => $subject,
        'description' => $description,
        'incident_date' => $incidentDate,
        'location' => $location
    ]);

    $complaintId = (int)$pdo->lastInsertId();

    // Insert initial complaint status history.
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
            NULL,
            'SUBMITTED',
            'Complaint submitted successfully.',
            1
        )"
    );

    $history->execute([
        'complaint_id' => $complaintId,
        'updated_by' => $user['id']
    ]);

    // Create an in-app notification.
    $notification = $pdo->prepare(
        "INSERT INTO notifications
        (user_id, complaint_id, type, title, message)
        VALUES
        (
            :user_id,
            :complaint_id,
            'COMPLAINT_SUBMITTED',
            'Complaint submitted',
            :message
        )"
    );

    $notification->execute([
        'user_id' => $user['id'],
        'complaint_id' => $complaintId,
        'message' => 'Your complaint ' . $reference . ' has been submitted.'
    ]);

    // Record the action in the audit log.
    audit_log(
        $pdo,
        (int)$user['id'],
        'COMPLAINT_SUBMITTED',
        'COMPLAINT',
        (string)$complaintId,
        ['complaint_ref' => $reference]
    );

    // Commit database operations first.
    $pdo->commit();

    // Send acknowledgement email after successful submission.
    // Email failure must never cancel the complaint submission.
    try {
        dpp_send_complaint_acknowledgement(
            (string)($user['email'] ?? ''),
            (string)($user['full_name'] ?? 'Citizen'),
            $reference
        );
    } catch (Throwable $emailError) {
        error_log(
            'Complaint acknowledgement email error: '
            . $emailError->getMessage()
        );
    }

    // Return successful response to the frontend.
    dpp_ok('Complaint submitted successfully.', [
        'complaint_id' => $complaintId,
        'complaint_ref' => $reference,
        'status' => 'SUBMITTED'
    ], 201);

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    throw $e;
}
