<?php
declare(strict_types=1);

/**
 * Generates a unique public user ID such as CIT-483920, OFF-120554, ADM-771203.
 * Uses a CSPRNG and checks uniqueness; the UNIQUE index remains the final guard.
 */
function generate_user_id(PDO $pdo, string $role): string
{
    $prefix = ['CITIZEN' => 'CIT', 'OFFICER' => 'OFF', 'ADMIN' => 'ADM'][$role] ?? throw new InvalidArgumentException('Unknown role');
    $stmt = $pdo->prepare('SELECT 1 FROM users WHERE user_id = ?');
    for ($i = 0; $i < 10; $i++) {
        $candidate = $prefix . '-' . random_int(100000, 999999);
        $stmt->execute([$candidate]);
        if (!$stmt->fetchColumn()) {
            return $candidate;
        }
    }
    throw new RuntimeException('Could not generate a unique user ID');
}
