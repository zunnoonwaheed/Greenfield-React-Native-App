<?php
/**
 * Reset Password API Endpoint
 * Resets password using token from forgot-password
 * Method: POST
 * Returns: JSON
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Get input
$token = trim($_POST['token'] ?? '');
$newPassword = $_POST['new_password'] ?? '';

// Validate required fields
if (empty($token) || empty($newPassword)) {
    jsonError('Token and new password are required', 422);
}

// Validate password strength
$passwordValidation = validatePassword($newPassword);
if (!$passwordValidation['valid']) {
    jsonError($passwordValidation['message'], 422);
}

// Check if token is valid and not expired
$query = "SELECT pr.*, u.id as user_id, u.email, u.name FROM password_resets pr
          JOIN users u ON pr.email = u.email
          WHERE pr.token = ? AND pr.expires_at > NOW()
          LIMIT 1";
$resetData = dbFetchOne($con, $query, 's', [$token]);

if (!$resetData) {
    jsonError('Invalid or expired reset token', 400);
}

// Hash new password
$hashedPassword = hashPassword($newPassword);

// Update user password
$updateQuery = "UPDATE users SET password = ? WHERE email = ?";
$result = dbExecute($con, $updateQuery, 'ss', [$hashedPassword, $resetData['email']]);

if ($result['success']) {
    // Delete used token
    $deleteQuery = "DELETE FROM password_resets WHERE token = ?";
    dbExecute($con, $deleteQuery, 's', [$token]);

    jsonSuccess(null, 'Password reset successful. Please login with your new password');
} else {
    jsonError('Failed to reset password', 500);
}
