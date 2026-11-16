<?php
declare(strict_types=1);

/** Shared field validators/normalisers (extended in Phase 4). Return error string or null. */

function normalize_email(string $email): string
{
    return strtolower(trim($email));
}

/** Accepts 10-digit Indian mobile numbers, optionally prefixed +91 / 91 / 0. Returns 10 digits or null. */
function normalize_phone(string $phone): ?string
{
    $digits = preg_replace('/[\s\-()]/', '', $phone);
    $digits = preg_replace('/^(\+91|91|0)(?=[6-9]\d{9}$)/', '', $digits);
    return preg_match('/^[6-9]\d{9}$/', $digits) ? $digits : null;
}

function validate_password_strength(string $password): ?string
{
    if (strlen($password) < 12) {
        return 'Password must be at least 12 characters.';
    }
    if (strlen($password) > 128) {
        return 'Password must be at most 128 characters.';
    }
    if (!preg_match('/[a-z]/', $password) || !preg_match('/[A-Z]/', $password)
        || !preg_match('/\d/', $password) || !preg_match('/[^a-zA-Z0-9]/', $password)) {
        return 'Password must include upper-case, lower-case, a digit and a symbol.';
    }
    return null;
}
