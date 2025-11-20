<?php
/**
 * Change Password API Endpoint
 * Allows logged-in users to change their password
 * Method: POST
 * Returns: JSON
 * Requires: Authentication
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Require authentication
requireAuth();

// Get POST data
$currentPassword = $_POST['current_password'] ?? '';
$newPassword = $_POST['new_password'] ?? '';

// Validate required fields
if (empty($currentPassword)) {
    jsonError('Current password is required');
}

if (empty($newPassword)) {
    jsonError('New password is required');
}

// Validate new password strength
$validation = validatePassword($newPassword);
if (!$validation['valid']) {
    jsonError($validation['message']);
}

// Get current user
$userId = getCurrentUserId();
$user = dbFetchOne($con, "SELECT id, password FROM users WHERE id = ?", 'i', [$userId]);

if (!$user) {
    jsonError('User not found', 404);
}

// Verify current password
if (!verifyPassword($currentPassword, $user['password'])) {
    jsonError('Current password is incorrect', 401);
}

// Hash new password
$hashedPassword = hashPassword($newPassword);

// Update password
$result = dbExecute(
    $con,
    "UPDATE users SET password = ? WHERE id = ?",
    'si',
    [$hashedPassword, $userId]
);

if (!$result['success']) {
    error_log("Password update failed: " . $result['error']);
    jsonError('Failed to update password', 500);
}

jsonSuccess(null, 'Password changed successfully');
?>
