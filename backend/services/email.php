<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/PHPMailer/src/Exception.php';
require_once __DIR__ . '/../vendor/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../vendor/PHPMailer/src/SMTP.php';

/**
 * Send an email through the configured SMTP server.
 * Returns false if email is not configured or delivery fails.
 */
function dpp_send_email(
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlBody,
    string $plainBody
): bool {
    if (
        !filter_var($toEmail, FILTER_VALIDATE_EMAIL) ||
        !function_exists('env') ||
        !env('SMTP_HOST') ||
        !env('SMTP_USERNAME') ||
        !env('SMTP_PASSWORD') ||
        !env('SMTP_FROM_EMAIL')
    ) {
        error_log('DPP email skipped: SMTP configuration is incomplete.');
        return false;
    }

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = (string) env('SMTP_HOST');
        $mail->SMTPAuth = true;
        $mail->Username = (string) env('SMTP_USERNAME');
        $mail->Password = (string) env('SMTP_PASSWORD');
        $mail->Port = (int) env('SMTP_PORT', '587');

        $encryption = strtolower((string) env('SMTP_ENCRYPTION', 'tls'));

        if ($encryption === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($encryption === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }

        $mail->CharSet = 'UTF-8';
        $mail->setFrom(
            (string) env('SMTP_FROM_EMAIL'),
            (string) env('SMTP_FROM_NAME', 'Digital Police Portal')
        );

        $mail->addAddress($toEmail, $toName);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $plainBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('DPP email delivery failed: ' . $mail->ErrorInfo);
        return false;
    } catch (Throwable $e) {
        error_log('DPP email error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Send complaint submission acknowledgement.
 */
function dpp_send_complaint_acknowledgement(
    string $email,
    string $name,
    string $reference
): bool {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeReference = htmlspecialchars($reference, ENT_QUOTES, 'UTF-8');

    $subject = "Complaint received - {$reference}";

    $html = "
        <h2>Complaint Submitted Successfully</h2>
        <p>Hello {$safeName},</p>
        <p>Your complaint has been successfully registered with the Digital Police Portal.</p>
        <p><strong>Complaint Reference:</strong> {$safeReference}</p>
        <p><strong>Current Status:</strong> SUBMITTED</p>
        <p>Please keep your reference number safe to track your complaint.</p>
        <p>Regards,<br>Digital Police Portal Team</p>
    ";

    $plain = "Hello {$name},\n\n"
        . "Your complaint has been successfully registered.\n"
        . "Complaint Reference: {$reference}\n"
        . "Current Status: SUBMITTED\n\n"
        . "Please keep your reference number safe.\n"
        . "Digital Police Portal Team";

    return dpp_send_email($email, $name, $subject, $html, $plain);
}

/**
 * Send complaint status update.
 */
function dpp_send_complaint_status_update(
    string $email,
    string $name,
    string $reference,
    string $status,
    string $remarks = ''
): bool {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeReference = htmlspecialchars($reference, ENT_QUOTES, 'UTF-8');
    $safeStatus = htmlspecialchars(str_replace('_', ' ', $status), ENT_QUOTES, 'UTF-8');
    $safeRemarks = nl2br(htmlspecialchars($remarks, ENT_QUOTES, 'UTF-8'));

    $subject = "Complaint status updated - {$reference}";

    $html = "
        <h2>Complaint Status Update</h2>
        <p>Hello {$safeName},</p>
        <p>The status of your complaint has been updated.</p>
        <p><strong>Complaint Reference:</strong> {$safeReference}</p>
        <p><strong>New Status:</strong> {$safeStatus}</p>
        " . ($remarks !== '' ? "<p><strong>Remarks:</strong><br>{$safeRemarks}</p>" : "") . "
        <p>Regards,<br>Digital Police Portal Team</p>
    ";

    $plain = "Hello {$name},\n\n"
        . "Your complaint status has been updated.\n"
        . "Complaint Reference: {$reference}\n"
        . "New Status: " . str_replace('_', ' ', $status) . "\n"
        . ($remarks !== '' ? "Remarks: {$remarks}\n" : "")
        . "\nDigital Police Portal Team";

    return dpp_send_email($email, $name, $subject, $html, $plain);
}
