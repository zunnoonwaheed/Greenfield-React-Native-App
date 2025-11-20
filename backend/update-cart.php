<?php
/**
 * Update Cart Item API
 * Method: POST
 * Params: product_id, quantity OR action (increase/decrease)
 * Returns: JSON
 */
header('Content-Type: application/json');
session_start();

$id = intval($_POST['product_id'] ?? $_POST['id'] ?? 0);
$action = $_POST['action'] ?? '';
$quantity = intval($_POST['quantity'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit;
}

if (!isset($_SESSION['cart'][$id])) {
    echo json_encode(['success' => false, 'message' => 'Product not in cart']);
    exit;
}

// Handle action (increase/decrease) or direct quantity update
if ($action === 'increase') {
    $_SESSION['cart'][$id]['qty']++;
} elseif ($action === 'decrease') {
    if ($_SESSION['cart'][$id]['qty'] > 1) {
        $_SESSION['cart'][$id]['qty']--;
    }
} elseif ($quantity > 0) {
    $_SESSION['cart'][$id]['qty'] = $quantity;
}

// Calculate updated totals
$total = 0;
$cart_items = [];

foreach ($_SESSION['cart'] as $item) {
    $itemTotal = $item['price'] * $item['qty'];
    $total += $itemTotal;

    $cart_items[] = [
        'id' => (int)$item['id'],
        'name' => $item['name'],
        'price' => (float)$item['price'],
        'quantity' => (int)$item['qty'],
        'subtotal' => (float)$itemTotal
    ];
}

$cart_count = array_sum(array_column($_SESSION['cart'], 'qty'));

echo json_encode([
    'success' => true,
    'message' => 'Cart updated successfully',
    'data' => [
        'cart_count' => $cart_count,
        'cart_total' => (float)$total,
        'items' => $cart_items
    ]
]);
?>
