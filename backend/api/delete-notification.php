<?php
/**
 * Delete Notification API Endpoint
 * Deletes a single notification
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
$notificationId = $_POST['notification_id'] ?? '';

if (empty($notificationId)) {
    jsonError('Notification ID is required');
}

// Delete notification (only if belongs to user)
$result = dbExecute(
    $con,
    "DELETE FROM notifications WHERE id = ? AND user_id = ?",
    'ii',
    [$notificationId, $userId]
);

if (!$result['success']) {
    error_log("Notification deletion failed: " . $result['error']);
    jsonError('Failed to delete notification', 500);
}

if ($result['affected_rows'] === 0) {
    jsonError('Notification not found', 404);
}

jsonSuccess(null, 'Notification deleted successfully');
?>
