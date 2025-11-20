<?php
/**
 * Get Cart Contents API
 * Method: GET
 * Returns: JSON
 */
header('Content-Type: application/json');
session_start();

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    echo json_encode([
        'success' => true,
        'data' => [
            'items' => [],
            'cart_count' => 0,
            'cart_total' => 0,
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

echo json_encode([
    'success' => true,
    'data' => [
        'items' => $cart_items,
        'cart_count' => $cart_count,
        'cart_total' => (float)$total,
        'currency' => $currency
    ]
]);
?>
