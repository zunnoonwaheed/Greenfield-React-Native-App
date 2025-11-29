<?php
/**
 * Order History API
 * GET /api/order-history.php - Get user's order history with details
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
require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

// Database connection
$host = 'localhost';
$db = 'greenfieldsuperm_db';
$user = 'root';
$pass = '';

// Suppress mysqli errors
mysqli_report(MYSQLI_REPORT_OFF);

$con = @new mysqli($host, $user, $pass, $db);

if ($con->connect_error) {
    respondError('Database connection failed');
}

$con->set_charset('utf8mb4');

// Check if orders table exists
$tableCheck = @$con->query("SHOW TABLES LIKE 'orders'");
if (!$tableCheck || $tableCheck->num_rows === 0) {
    $con->close();
    respondSuccess([
        'orders' => [],
        'pagination' => [
            'current_page' => 1,
            'per_page' => 20,
            'total' => 0,
            'total_pages' => 0
        ],
        'message' => 'Orders table not yet created'
    ]);
}

// For development, use user_id = 1 (or from auth if available)
$user_id = 1;
$authUser = authenticateUser($con);
if ($authUser) {
    $user_id = $authUser;
}

// Get pagination parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 20;
$offset = ($page - 1) * $limit;

// Get filter parameters
$status_filter = isset($_GET['status']) ? trim($_GET['status']) : '';

// Build where clause
$whereConditions = ["o.user_id = ?"];
$params = [$user_id];
$types = 'i';

if (!empty($status_filter)) {
    $whereConditions[] = "o.statuss = ?";
    $params[] = $status_filter;
    $types .= 's';
}

$whereClause = implode(' AND ', $whereConditions);

// Count total orders
$countQuery = "SELECT COUNT(*) as total FROM orders o WHERE {$whereClause}";
$totalResult = dbSelect($con, $countQuery, $types, $params);
$total = 0;
if ($totalResult && $row = $totalResult->fetch_assoc()) {
    $total = intval($row['total']);
}

// Fetch orders with details (using existing schema columns)
$query = "
    SELECT
        o.id,
        o.user_id,
        o.total,
        o.statuss as status,
        o.guest_address as delivery_address,
        o.created_at
    FROM orders o
    WHERE {$whereClause}
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
";

$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

$result = dbSelect($con, $query, $types, $params);

$orders = [];
if ($result && $result->num_rows > 0) {
    while ($order = $result->fetch_assoc()) {
        $order_id = $order['id'];

        // Fetch order items (using existing schema: qty, name, total)
        $itemsQuery = "
            SELECT
                oi.id,
                oi.product_id,
                oi.qty as quantity,
                oi.price,
                oi.name as product_name,
                oi.total as subtotal
            FROM order_items oi
            WHERE oi.order_id = ?
        ";

        $items = dbFetchAll($con, $itemsQuery, 'i', [$order_id]);

        $formattedItems = array_map(function($item) {
            return [
                'id' => $item['id'],
                'product_id' => $item['product_id'],
                'product_name' => $item['product_name'] ?: 'Product',
                'quantity' => intval($item['quantity']),
                'price' => floatval($item['price']),
                'subtotal' => floatval($item['subtotal'])
            ];
        }, $items ?: []);

        // Format status for display
        $statusMap = [
            'Current' => 'Pending',
            'Processed' => 'Shipped',
            'Delivered' => 'Delivered',
            'otw' => 'On the Way',
            'Cancel' => 'Cancelled',
            'Return' => 'Returned'
        ];
        $displayStatus = $statusMap[$order['status']] ?? $order['status'];

        $orders[] = [
            'id' => $order['id'],
            'total' => floatval($order['total']),
            'status' => $displayStatus,
            'delivery_address' => $order['delivery_address'] ?: 'No address provided',
            'items' => $formattedItems,
            'items_count' => count($formattedItems),
            'created_at' => $order['created_at']
        ];
    }
}

$con->close();

// Clean any output before sending JSON
while (ob_get_level() > 0) ob_end_clean();

// Set JSON content type
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'data' => [
        'orders' => $orders,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $limit,
            'total' => $total,
            'total_pages' => ceil($total / $limit)
        ]
    ]
]);
exit;
