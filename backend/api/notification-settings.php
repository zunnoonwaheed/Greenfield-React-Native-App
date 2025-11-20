<?php
/**
 * Notification Settings API Endpoint
 * Get user notification preferences
 * Method: GET
 * Returns: JSON
 * Requires: Authentication
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Require authentication
requireAuth();

$userId = getCurrentUserId();

// Get notification settings for user
$settings = dbFetchOne(
    $con,
    "SELECT * FROM notification_settings WHERE user_id = ?",
    'i',
    [$userId]
);

// If no settings exist, return defaults
if (!$settings) {
    $settings = [
        'user_id' => $userId,
        'email_notifications' => 1,
        'push_notifications' => 1,
        'sms_notifications' => 0,
        'order_updates' => 1,
        'promotional_emails' => 1,
        'new_products' => 1
    ];
}

jsonSuccess([
    'settings' => $settings
], 'Notification settings retrieved successfully');
?>
