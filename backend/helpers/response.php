<?php
declare(strict_types=1);

/** Consistent JSON envelope: { success, message, data | errors } */
function json_response(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_success(string $message = 'Operation completed successfully', array $data = [], int $status = 200): never
{
    json_response($status, ['success' => true, 'message' => $message, 'data' => (object) $data]);
}

function json_error(string $message, int $status = 400, array $errors = []): never
{
    $body = ['success' => false, 'message' => $message];
    if ($errors) {
        $body['errors'] = $errors;
    }
    json_response($status, $body);
}
