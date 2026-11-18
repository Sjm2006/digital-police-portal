
<?php

require_once __DIR__ . '/../../bootstrap.php';
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../helpers/ids.php';
require_once __DIR__ . '/../../helpers/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    dpp_fail('Method not allowed.', 405);
}

// Accept both JSON and multipart form submissions.
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (stripos($contentType, 'multipart/form-data') !== false) {
    $data = $_POST;
} else {
    $data = dpp_input();
}

$name = trim((string)($data['full_name'] ?? ''));
$email = dpp_normalize_email((string)($data['email'] ?? ''));
$phone = dpp_normalize_phone((string)($data['phone'] ?? ''));
$password = (string)($data['password'] ?? '');

if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    dpp_fail('Please enter a valid full name.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    dpp_fail('Please enter a valid email address.', 422);
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    dpp_fail('Enter a valid 10-digit Indian mobile number.', 422);
}

if (!dpp_valid_password($password)) {
    dpp_fail(
        'Password must contain at least 12 characters, uppercase, lowercase, a number and a symbol.',
        422
    );
}

// Optional document upload.
$document = $_FILES['document'] ?? null;
$documentType = trim((string)($data['document_type'] ?? ''));

$storedPath = null;
$storedFilename = null;
$originalFilename = null;
$mimeType = null;
$fileSize = null;

$allowedDocumentTypes = [
    'AADHAAR',
    'PAN',
    'VOTER_ID',
    'DRIVING_LICENSE',
    'PASSPORT',
    'OTHER'
];

if ($document !== null && $document['error'] !== UPLOAD_ERR_NO_FILE) {

    if ($document['error'] !== UPLOAD_ERR_OK) {
        dpp_fail('Document upload failed. Please try again.', 422);
    }

    if (!in_array($documentType, $allowedDocumentTypes, true)) {
        dpp_fail('Please select a valid document type.', 422);
    }

    if ($document['size'] <= 0 || $document['size'] > 5 * 1024 * 1024) {
        dpp_fail('Document size must not exceed 5 MB.', 422);
    }

    if (!is_uploaded_file($document['tmp_name'])) {
        dpp_fail('Invalid document upload.', 422);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($document['tmp_name']);

    $allowedMimeTypes = [
        'application/pdf' => 'pdf',
        'image/jpeg' => 'jpg',
        'image/png' => 'png'
    ];

    if (!isset($allowedMimeTypes[$mimeType])) {
        dpp_fail('Only PDF, JPG and PNG documents are allowed.', 422);
    }

    $storageDirectory = __DIR__ . '/../../storage/private_documents';

    if (!is_dir($storageDirectory) || !is_writable($storageDirectory)) {
        dpp_fail('Document storage is not available. Please contact the administrator.', 500);
    }

    $storedFilename = bin2hex(random_bytes(24)) . '.' . $allowedMimeTypes[$mimeType];
    $storedPath = $storageDirectory . DIRECTORY_SEPARATOR . $storedFilename;

    $originalFilename = basename((string)$document['name']);
    $originalFilename = mb_substr($originalFilename, 0, 255);
    $fileSize = (int)$document['size'];

    if (!move_uploaded_file($document['tmp_name'], $storedPath)) {
        $storedPath = null;
        dpp_fail('Unable to save the uploaded document.', 500);
    }
}

$pdo = db();

try {
    $pdo->beginTransaction();

    $check = $pdo->prepare(
        'SELECT id FROM users
         WHERE email = :email OR phone = :phone
         LIMIT 1'
    );

    $check->execute([
        'email' => $email,
        'phone' => $phone
    ]);

    if ($check->fetch()) {
        $pdo->rollBack();

        if ($storedPath && file_exists($storedPath)) {
            unlink($storedPath);
        }

        dpp_fail('Email or phone number is already registered.', 409);
    }

    $userId = generate_user_id($pdo, 'CITIZEN');
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insert = $pdo->prepare(
        "INSERT INTO users
        (user_id, full_name, email, phone, password_hash, role, status)
        VALUES
        (:user_id, :name, :email, :phone, :password_hash, 'CITIZEN', 'ACTIVE')"
    );

    $insert->execute([
        'user_id' => $userId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'password_hash' => $passwordHash
    ]);

    $internalId = (int)$pdo->lastInsertId();

    $profile = $pdo->prepare(
        'INSERT INTO citizen_profiles (user_id) VALUES (:user_id)'
    );

    $profile->execute(['user_id' => $internalId]);

    // Save document metadata if a document was uploaded.
    if ($storedFilename !== null) {
        $documentInsert = $pdo->prepare(
            "INSERT INTO citizen_documents
            (
                citizen_id,
                document_type,
                original_filename,
                stored_filename,
                mime_type,
                file_size,
                verification_status
            )
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING')"
        );

        $documentInsert->execute([
            $internalId,
            $documentType,
            $originalFilename,
            $storedFilename,
            $mimeType,
            $fileSize
        ]);

        audit_log(
            $pdo,
            $internalId,
            'CITIZEN_DOCUMENT_UPLOADED',
            'CITIZEN_DOCUMENT',
            (string)$pdo->lastInsertId(),
            []
        );
    }

    audit_log(
        $pdo,
        $internalId,
        'CITIZEN_REGISTERED',
        'USER',
        (string)$internalId,
        []
    );

    $pdo->commit();

    // Create authenticated session.
    dpp_start_session();
    session_regenerate_id(true);

    $_SESSION['auth_user_id'] = $internalId;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    dpp_ok('Registration successful.', [
        'user' => [
            'user_id' => $userId,
            'full_name' => $name,
            'email' => $email,
            'phone' => $phone,
            'role' => 'CITIZEN'
        ],
        'csrf_token' => $_SESSION['csrf_token'],
        'document_status' => $storedFilename !== null ? 'PENDING' : 'NOT_SUBMITTED'
    ], 201);

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($storedPath && file_exists($storedPath)) {
        unlink($storedPath);
    }

    if ($e instanceof PDOException && $e->getCode() === '23000') {
        dpp_fail('An account with these details already exists.', 409);
    }

    throw $e;
}
