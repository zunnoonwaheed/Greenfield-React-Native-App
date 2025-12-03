<?php
/**
 * Notifications API Endpoint
 * GET /api/notifications.php - Get user notifications
 * Returns: JSON
 */

// Start output buffering
ob_start();

// Suppress errors from being output
error_reporting(0);
ini_set('display_errors', 0);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../helpers/session_config.php';
require_once __DIR__ . '/../admin/includes/db_settings.php';
require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

// Use production database connection from db_settings.php
if (!$con) {
    respondError('Database connection failed');
}

// Check if notifications table exists
$tableCheck = @$con->query("SHOW TABLES LIKE 'notifications'");
if (!$tableCheck || $tableCheck->num_rows === 0) {
    $con->close();
    respondSuccess([
        'notifications' => [],
        'count' => 0,
        'message' => 'Notifications table not yet created'
    ]);
}

// For development, use user_id = 1 (or from auth if available)
$user_id = 1;
$authUser = authenticateUser($con);
if ($authUser) {
    $user_id = $authUser;
}

// Check if only count is requested
$countOnly = isset($_GET['count_only']) && $_GET['count_only'] === 'true';

if ($countOnly) {
    // Get unread count
    $countQuery = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0";
    $stmt = $con->prepare($countQuery);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    $con->close();

    respondSuccess([
        'unread_count' => intval($row['count'] ?? 0)
    ]);
}

// Get notifications with pagination
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$unreadOnly = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';

// Build query based on filters
if ($unreadOnly) {
    $query = "SELECT id, user_id, title, message, type, is_read, created_at FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?";
} else {
    $query = "SELECT id, user_id, title, message, type, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
}

$stmt = $con->prepare($query);
$stmt->bind_param('iii', $user_id, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    // Calculate time ago
    $createdAt = new DateTime($row['created_at']);
    $now = new DateTime();
    $diff = $now->diff($createdAt);

    if ($diff->d > 0) {
        $timeAgo = $diff->d . 'd ago';
    } elseif ($diff->h > 0) {
        $timeAgo = $diff->h . 'h ago';
    } elseif ($diff->i > 0) {
        $timeAgo = $diff->i . 'm ago';
    } else {
        $timeAgo = 'Just now';
    }

    $notifications[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['message'], // Map 'message' to 'description' for frontend
        'type' => $row['type'],
        'read' => boolval($row['is_read']),
        'time' => $timeAgo,
        'created_at' => $row['created_at']
    ];
}
$stmt->close();

// Get total count
$countQuery = $unreadOnly
    ? "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0"
    : "SELECT COUNT(*) as count FROM notifications WHERE user_id = ?";
$stmt = $con->prepare($countQuery);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$countResult = $stmt->get_result();
$totalCount = intval($countResult->fetch_assoc()['count'] ?? 0);
$stmt->close();

// Get unread count separately
$unreadQuery = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0";
$stmt = $con->prepare($unreadQuery);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$unreadResult = $stmt->get_result();
$unreadCount = intval($unreadResult->fetch_assoc()['count'] ?? 0);
$stmt->close();

$con->close();

respondSuccess([
    'data' => [
        'notifications' => $notifications,
        'count' => $totalCount,
        'unread_count' => $unreadCount,
        'pagination' => [
            'current_page' => floor($offset / $limit) + 1,
            'per_page' => $limit,
            'total' => $totalCount,
            'total_pages' => ceil($totalCount / $limit)
        ]
    ]
]);
