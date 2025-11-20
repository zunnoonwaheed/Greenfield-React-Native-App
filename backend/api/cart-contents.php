<?php
/**
 * Get Cart Contents API
 * Method: GET
 * Returns: JSON
 * Authentication: Not required (session-based cart)
 */

require_once("../helpers/session_config.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/cart-contents.php';

logRequest($endpoint, $_SERVER['REQUEST_METHOD'], []);

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    logInfo("Cart is empty");
    logResponse($endpoint, true, null, "Cart is empty");
    endTimer($startTime, $endpoint);

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

    $cart_items[] = [
        'id' => (int)$item['id'],
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

logInfo("Cart retrieved: $cart_count items, Total: $total");
logResponse($endpoint, true, null, "Cart contents retrieved");
endTimer($startTime, $endpoint);

echo json_encode([
    'success' => true,
    'data' => [
        'items' => $cart_items,
        'count' => $cart_count,
        'total' => (float)$total,
        'currency' => $currency
    ]
]);
?>
