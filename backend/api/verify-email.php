<?php
/**
 * Email Verification API Endpoint
 * Verifies user email address using verification token
 * Method: POST or GET
 * Returns: JSON
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/verify-email.php';

// Get token from POST or GET
$token = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = trim($_POST['token'] ?? '');
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = trim($_GET['token'] ?? '');
}

logRequest($endpoint, $_SERVER['REQUEST_METHOD'], ['token' => substr($token, 0, 10) . '...']);

// Validate token
if (empty($token)) {
    logError($endpoint, 'Verification token is required');
    jsonError('Verification token is required', 422);
}

// Find user with this verification token that hasn't expired
$query = "SELECT id, name, email, email_verified, email_verification_expires_at
          FROM users
          WHERE email_verification_token = ?
          LIMIT 1";
$user = dbFetchOne($con, $query, 's', [$token]);

if (!$user) {
    logError($endpoint, 'Invalid verification token');
    jsonError('Invalid or expired verification token. Please request a new verification email.', 400);
}

// Check if already verified
if ($user['email_verified'] == 1) {
    logInfo("Email already verified for user ID: " . $user['id']);
    jsonSuccess([
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'email_verified' => true
        ]
    ], 'Email already verified. You can now login.');
}

// Check if token expired
$expiresAt = strtotime($user['email_verification_expires_at']);
if ($expiresAt < time()) {
    logError($endpoint, 'Verification token expired for user ID: ' . $user['id']);
    jsonError('Verification token has expired. Please request a new verification email.', 400);
}

// Verify the email
$updateQuery = "UPDATE users
                SET email_verified = 1,
                    email_verification_token = NULL,
                    email_verification_expires_at = NULL
                WHERE id = ?";
$result = dbExecute($con, $updateQuery, 'i', [$user['id']]);

if ($result['success']) {
    logInfo("Email verified successfully for user ID: " . $user['id'] . ", Email: " . $user['email']);
    logResponse($endpoint, true, null, "Email verified for " . $user['email']);
    endTimer($startTime, $endpoint);

    jsonSuccess([
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'email_verified' => true
        ]
    ], 'Email verified successfully! You can now login to your account.');
} else {
    logError($endpoint, 'Failed to verify email for user ID: ' . $user['id']);
    logResponse($endpoint, false, null, 'Email verification failed');
    endTimer($startTime, $endpoint);
    jsonError('Failed to verify email. Please try again.', 500);
}
?>
