<?php
/**
 * Get Cart Contents API
 * Method: GET
 * Returns: JSON
 */
require_once("helpers/session_config.php");
header('Content-Type: application/json');

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    echo json_encode([
        'success' => true,
        'data' => [
            'items' => [],
            'count' => 0,
            'total' => 0,
            'currency' => 'PKR'
        ],
        'message' => 'Cart is empty'
    ]);
    exit;
}

// Calculate totals and format items
$total = 0;
$cart_items = [];

foreach ($cart as $item) {
    $itemTotal = $item['price'] * $item['qty'];
    $total += $itemTotal;

    // Keep ID as-is (can be int for products or string for bundles)
    $itemId = $item['id'];
    if (is_numeric($itemId) && strpos($itemId, 'bundle_') === false) {
        $itemId = (int)$itemId;
    }

    $cart_items[] = [
        'id' => $itemId,
        'name' => $item['name'],
        'price' => (float)$item['price'],
        'quantity' => (int)$item['qty'],
        'image' => $item['image'] ?? '',
        'type' => $item['type'] ?? 'product',
        'subtotal' => (float)$itemTotal
    ];
}

$cart_count = array_sum(array_column($cart, 'qty'));
$currency = $cart[array_key_first($cart)]['currency'] ?? 'PKR';

// Calculate charges from database or use default
// Default delivery charge (can be overridden by location-specific charge)
$delivery_charge = 100.00; // Default Rs. 100

// Try to get delivery charge from database if user has a location
include("admin/includes/db_settings.php");
if (isset($_SESSION['user_id'])) {
    // Get user's delivery area from their profile/address
    $userId = $_SESSION['user_id'];
    $userQuery = mysqli_query($con, "SELECT address FROM users WHERE id = $userId LIMIT 1");
    if ($userQuery && mysqli_num_rows($userQuery) > 0) {
        $userData = mysqli_fetch_assoc($userQuery);
        // Try to match with delivery_charges table
        // For now, use default charge. You can enhance this to match user's area
    }
}

// GST/Tax - typically 3% in Pakistan for food items
$gst_percentage = 3; // 3%
$gst_amount = round(($total * $gst_percentage) / 100, 2);

// Calculate final total
$final_total = $total + $delivery_charge + $gst_amount;

echo json_encode([
    'success' => true,
    'data' => [
        'items' => $cart_items,
        'count' => $cart_count,
        'subtotal' => (float)$total,
        'delivery_charge' => (float)$delivery_charge,
        'gst' => (float)$gst_amount,
        'gst_percentage' => $gst_percentage,
        'total' => (float)$final_total,
        'currency' => $currency
    ]
]);
?>
