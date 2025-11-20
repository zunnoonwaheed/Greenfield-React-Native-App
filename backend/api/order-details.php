<?php
/**
 * Order Details API Endpoint
 * Returns detailed information about a specific order
 * Method: GET
 * Params: id (order ID)
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
$orderId = (int)($_GET['id'] ?? 0);

if ($orderId <= 0) {
    jsonError('Order ID is required', 422);
}

// Get user email
$userEmail = getCurrentUser()['email'];

// Try to fetch order by user_id first
$order = dbFetchOne($con, "SELECT * FROM orders WHERE id = ? AND user_id = ?", 'ii', [$orderId, $userId]);

// If not found, try guest_email (for guest orders)
if (!$order && $userEmail) {
    $order = dbFetchOne($con, "SELECT * FROM orders WHERE id = ? AND guest_email = ?", 'is', [$orderId, $userEmail]);
}

if (!$order) {
    jsonError('Order not found or access denied', 404);
}

// Get order items
$orderItems = dbFetchAll($con, "
    SELECT
        name AS product_name,
        qty AS quantity,
        price AS unit_price,
        total AS total_price,
        product_id
    FROM order_items
    WHERE order_id = ?
", 'i', [$orderId]);

// Format order items
$formattedItems = array_map(function($item) {
    return [
        'product_id' => (int)($item['product_id'] ?? 0),
        'product_name' => $item['product_name'],
        'quantity' => (int)$item['quantity'],
        'unit_price' => (float)$item['unit_price'],
        'total_price' => (float)$item['total_price']
    ];
}, $orderItems);

// Status labels
$statusLabels = [
    'Current'   => 'Current',
    'Processed' => 'Processed',
    'otw'       => 'On the Way',
    'Delivered' => 'Delivered',
    'Cancel'    => 'Cancelled'
];

jsonSuccess([
    'order' => [
        'id' => (int)$order['id'],
        'total' => (float)$order['total'],
        'subtotal' => (float)($order['subtotal'] ?? 0),
        'delivery_charge' => (float)($order['delivery_charge'] ?? 0),
        'currency' => $order['currency'],
        'status' => $order['statuss'],
        'status_label' => $statusLabels[$order['statuss']] ?? $order['statuss'],
        'customer_name' => $order['name'] ?? '',
        'customer_email' => $order['email'] ?? $order['guest_email'] ?? '',
        'customer_phone' => $order['phone'] ?? '',
        'delivery_address' => $order['address'] ?? '',
        'created_at' => $order['created_at'],
        'items' => $formattedItems
    ]
], 'Order details retrieved successfully');
?>