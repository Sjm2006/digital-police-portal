<?php
declare(strict_types=1);

/**
 * Append an audit record. Never pass passwords, hashes, session IDs or tokens in $details.
 */
function audit_log(PDO $pdo, ?int $actorUserId, string $action, ?string $entityType = null, ?string $entityId = null, array $details = []): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, details, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $actorUserId,
        $action,
        $entityType,
        $entityId,
        $details ? json_encode($details, JSON_UNESCAPED_UNICODE) : null,
        $_SERVER['REMOTE_ADDR'] ?? null,
        isset($_SERVER['HTTP_USER_AGENT']) ? mb_substr($_SERVER['HTTP_USER_AGENT'], 0, 255) : null,
    ]);
}
