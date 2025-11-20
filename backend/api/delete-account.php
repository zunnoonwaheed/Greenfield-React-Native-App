<?php
/**
 * Delete Account API Endpoint
 * Allows logged-in users to delete their account
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

$userId = getCurrentUserId();

// Optional: Verify password for additional security
$password = $_POST['password'] ?? '';
if (!empty($password)) {
    $user = dbFetchOne($con, "SELECT password FROM users WHERE id = ?", 'i', [$userId]);
    if ($user && !verifyPassword($password, $user['password'])) {
        jsonError('Incorrect password', 401);
    }
}

// Soft delete: Update status instead of hard delete
// This preserves order history and allows account recovery
$result = dbExecute(
    $con,
    "UPDATE users SET deleted_at = NOW(), status = 'deleted' WHERE id = ?",
    'i',
    [$userId]
);

if (!$result['success']) {
    error_log("Account deletion failed: " . $result['error']);
    jsonError('Failed to delete account', 500);
}

// Clear user session
clearUserSession();

jsonSuccess(null, 'Account deleted successfully');
?>
