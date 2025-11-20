<?php
/**
 * Notifications API Endpoint
 * Get user notifications
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

// Check if only count is requested
$countOnly = isset($_GET['count_only']) && $_GET['count_only'] === 'true';

if ($countOnly) {
    // Get unread count
    $result = dbFetchOne(
        $con,
        "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0",
        'i',
        [$userId]
    );

    jsonSuccess([
        'unread_count' => (int)($result['count'] ?? 0)
    ], 'Unread count retrieved');
} else {
    // Get notifications with pagination
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $unreadOnly = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';

    // Build query based on filters
    if ($unreadOnly) {
        $query = "SELECT * FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $types = 'iii';
        $params = [$userId, $limit, $offset];
    } else {
        $query = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $types = 'iii';
        $params = [$userId, $limit, $offset];
    }

    $notifications = dbFetchAll($con, $query, $types, $params);

    // Get total count
    $countQuery = $unreadOnly
        ? "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0"
        : "SELECT COUNT(*) as count FROM notifications WHERE user_id = ?";
    $countResult = dbFetchOne($con, $countQuery, 'i', [$userId]);
    $totalCount = (int)($countResult['count'] ?? 0);

    jsonSuccess([
        'notifications' => $notifications,
        'count' => $totalCount,
        'limit' => $limit,
        'offset' => $offset
    ], 'Notifications retrieved successfully');
}
?>
