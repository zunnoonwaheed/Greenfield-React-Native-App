<?php
/**
 * Forgot Password API Endpoint
 * Initiates password reset process
 * Method: POST
 * Returns: JSON
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");
require_once("../helpers/email.php");

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Get email
$email = trim($_POST['email'] ?? '');

// Validate required fields
if (empty($email)) {
    jsonError('Email is required', 422);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Invalid email format', 422);
}

// Check if user exists
$user = dbFetchOne($con, "SELECT id, email, name FROM users WHERE email = ? LIMIT 1", 's', [$email]);

if ($user) {
    // Generate reset token
    $token = bin2hex(random_bytes(32));

    // Delete any existing tokens for this email
    $deleteQuery = "DELETE FROM password_resets WHERE email = ?";
    dbExecute($con, $deleteQuery, 's', [$email]);

    // Insert new reset token (expires_at = NOW() + 1 HOUR)
    $query = "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))";
    $result = dbExecute($con, $query, 'ss', [$email, $token]);

    if ($result['success']) {
        // Send password reset email
        $emailSent = sendPasswordResetEmail($email, $user['name'], $token);

        if ($emailSent) {
            // Email sent successfully
            jsonSuccess([
                'token' => $token, // For development/testing - remove in production
                'email_sent' => true
            ], 'Password reset link sent to your email. Please check your inbox.');
        } else {
            // Email failed but token created - still allow testing
            error_log("⚠️ Failed to send email to $email, but token created: $token");
            jsonSuccess([
                'token' => $token, // For development/testing
                'email_sent' => false,
                'note' => 'Email sending failed. Token available for testing.'
            ], 'Password reset token created. (Email delivery may have failed)');
        }
    } else {
        jsonError('Failed to generate reset token', 500);
    }
} else {
    // Return success even if user doesn't exist (security best practice)
    jsonSuccess(null, 'If email exists, reset link has been sent');
}
