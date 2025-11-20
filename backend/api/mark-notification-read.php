<?php
/**
 * Mark Notification as Read API Endpoint
 * Marks a single notification as read
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

// Update notification as read (only if belongs to user)
$result = dbExecute(
    $con,
    "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ? AND user_id = ?",
    'ii',
    [$notificationId, $userId]
);

if (!$result['success']) {
    error_log("Notification update failed: " . $result['error']);
    jsonError('Failed to mark notification as read', 500);
}

if ($result['affected_rows'] === 0) {
    jsonError('Notification not found', 404);
}

jsonSuccess(null, 'Notification marked as read');
?>
