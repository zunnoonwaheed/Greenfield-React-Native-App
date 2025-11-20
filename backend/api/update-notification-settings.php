<?php
/**
 * Update Notification Settings API Endpoint
 * Update user notification preferences
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

// Get settings from POST data
$emailNotifications = isset($_POST['email_notifications']) ? (int)$_POST['email_notifications'] : null;
$pushNotifications = isset($_POST['push_notifications']) ? (int)$_POST['push_notifications'] : null;
$smsNotifications = isset($_POST['sms_notifications']) ? (int)$_POST['sms_notifications'] : null;
$orderUpdates = isset($_POST['order_updates']) ? (int)$_POST['order_updates'] : null;
$promotionalEmails = isset($_POST['promotional_emails']) ? (int)$_POST['promotional_emails'] : null;
$newProducts = isset($_POST['new_products']) ? (int)$_POST['new_products'] : null;

// Check if settings exist for user
$existing = dbFetchOne(
    $con,
    "SELECT user_id FROM notification_settings WHERE user_id = ?",
    'i',
    [$userId]
);

if ($existing) {
    // Update existing settings
    $updates = [];
    $types = '';
    $params = [];

    if ($emailNotifications !== null) {
        $updates[] = 'email_notifications = ?';
        $types .= 'i';
        $params[] = $emailNotifications;
    }
    if ($pushNotifications !== null) {
        $updates[] = 'push_notifications = ?';
        $types .= 'i';
        $params[] = $pushNotifications;
    }
    if ($smsNotifications !== null) {
        $updates[] = 'sms_notifications = ?';
        $types .= 'i';
        $params[] = $smsNotifications;
    }
    if ($orderUpdates !== null) {
        $updates[] = 'order_updates = ?';
        $types .= 'i';
        $params[] = $orderUpdates;
    }
    if ($promotionalEmails !== null) {
        $updates[] = 'promotional_emails = ?';
        $types .= 'i';
        $params[] = $promotionalEmails;
    }
    if ($newProducts !== null) {
        $updates[] = 'new_products = ?';
        $types .= 'i';
        $params[] = $newProducts;
    }

    if (empty($updates)) {
        jsonError('No settings provided to update');
    }

    $params[] = $userId;
    $types .= 'i';

    $query = "UPDATE notification_settings SET " . implode(', ', $updates) . " WHERE user_id = ?";
    $result = dbExecute($con, $query, $types, $params);
} else {
    // Insert new settings
    $result = dbExecute(
        $con,
        "INSERT INTO notification_settings (user_id, email_notifications, push_notifications, sms_notifications, order_updates, promotional_emails, new_products)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
        'iiiiiii',
        [
            $userId,
            $emailNotifications ?? 1,
            $pushNotifications ?? 1,
            $smsNotifications ?? 0,
            $orderUpdates ?? 1,
            $promotionalEmails ?? 1,
            $newProducts ?? 1
        ]
    );
}

if (!$result['success']) {
    error_log("Notification settings update failed: " . $result['error']);
    jsonError('Failed to update notification settings', 500);
}

// Return updated settings
$settings = dbFetchOne(
    $con,
    "SELECT * FROM notification_settings WHERE user_id = ?",
    'i',
    [$userId]
);

jsonSuccess([
    'settings' => $settings
], 'Notification settings updated successfully');
?>
