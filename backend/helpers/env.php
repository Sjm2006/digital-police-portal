<?php
declare(strict_types=1);

/**
 * Minimal .env loader plus typed accessors. Real environment variables win over .env,
 * so hosting-panel variables work in production without a .env file.
 */
function load_env(string $path): void
{
    if (!is_readable($path)) {
        return;
    }
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        // Strip trailing inline comment (only when preceded by whitespace) and surrounding quotes.
        if ($value !== '' && $value[0] !== '"' && $value[0] !== "'") {
            $value = trim(preg_replace('/\s+#.*$/', '', $value));
        }
        $value = trim($value, "\"'");
        if (getenv($key) === false && !isset($_ENV[$key])) {
            $_ENV[$key] = $value;
        }
    }
}

function env(string $key, ?string $default = null): ?string
{
    $real = getenv($key);
    if ($real !== false) {
        return $real;
    }
    return $_ENV[$key] ?? $default;
}

function env_bool(string $key, bool $default = false): bool
{
    $v = env($key);
    return $v === null ? $default : filter_var($v, FILTER_VALIDATE_BOOLEAN);
}
