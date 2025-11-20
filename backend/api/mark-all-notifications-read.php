<?php
/**
 * Mark All Notifications as Read API Endpoint
 * Marks all user notifications as read
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

// Update all unread notifications for this user
$result = dbExecute(
    $con,
    "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0",
    'i',
    [$userId]
);

if (!$result['success']) {
    error_log("Bulk notification update failed: " . $result['error']);
    jsonError('Failed to mark notifications as read', 500);
}

jsonSuccess([
    'updated_count' => $result['affected_rows']
], 'All notifications marked as read');
?>
