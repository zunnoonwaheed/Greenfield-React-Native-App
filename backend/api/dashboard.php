<?php
/**
 * Dashboard API Endpoint
 * Returns user profile and order history
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

// Get user info
$user = dbFetchOne($con, "SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?", 'i', [$userId]);

if (!$user) {
    jsonError('User not found', 404);
}

// Get user orders
$orders = dbFetchAll($con, "
    SELECT id, total, currency, statuss, created_at, delivery_charge, subtotal
    FROM orders
    WHERE user_id = ? OR (user_id IS NULL AND guest_email = ?)
    ORDER BY created_at DESC
", 'is', [$userId, $user['email']]);

// Format orders with proper status labels
$formattedOrders = array_map(function($order) {
    $statusLabels = [
        'Current'   => 'Current',
        'Processed' => 'Processed',
        'otw'       => 'On the Way',
        'Delivered' => 'Delivered',
        'Cancel'    => 'Cancelled'
    ];

    return [
        'id' => (int)$order['id'],
        'total' => (float)$order['total'],
        'subtotal' => (float)($order['subtotal'] ?? 0),
        'delivery_charge' => (float)($order['delivery_charge'] ?? 0),
        'currency' => $order['currency'],
        'status' => $order['statuss'],
        'status_label' => $statusLabels[$order['statuss']] ?? $order['statuss'],
        'created_at' => $order['created_at']
    ];
}, $orders);

jsonSuccess([
    'user' => $user,
    'orders' => $formattedOrders,
    'stats' => [
        'total_orders' => count($formattedOrders),
        'pending_orders' => count(array_filter($formattedOrders, fn($o) => in_array($o['status'], ['Current', 'Processed', 'otw'])))
    ]
], 'Dashboard data retrieved successfully');
?>