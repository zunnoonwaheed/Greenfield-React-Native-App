<?php
/**
 * Update Cart API
 * Method: POST
 * Params: product_id (or id), action (increase/decrease/remove) OR quantity
 * Returns: JSON
 * Authentication: Not required (session-based cart)
 */

session_start();
require_once("../helpers/response.php");

header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$product_id = intval($_POST['product_id'] ?? $_POST['id'] ?? 0);
$action = $_POST['action'] ?? '';
$quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : null;

if ($product_id <= 0) {
    jsonError('Product ID is required');
}

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Check if item exists in cart
if (!isset($_SESSION['cart'][$product_id])) {
    jsonError('Product not found in cart', 404);
}

// Update quantity based on action or direct quantity
if ($quantity !== null) {
    // Direct quantity update
    if ($quantity <= 0) {
        unset($_SESSION['cart'][$product_id]);
    } else {
        $_SESSION['cart'][$product_id]['qty'] = $quantity;
    }
} elseif ($action) {
    // Action-based update
    switch ($action) {
        case 'increase':
            $_SESSION['cart'][$product_id]['qty']++;
            break;

        case 'decrease':
            $_SESSION['cart'][$product_id]['qty']--;
            if ($_SESSION['cart'][$product_id]['qty'] <= 0) {
                unset($_SESSION['cart'][$product_id]);
            }
            break;

        case 'remove':
            unset($_SESSION['cart'][$product_id]);
            break;

        default:
            jsonError('Invalid action. Use: increase, decrease, or remove');
    }
} else {
    jsonError('Either action or quantity parameter is required');
}

// Calculate new cart totals
$cart_count = array_sum(array_column($_SESSION['cart'], 'qty'));
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
        'image' => $item['image'] ?? '',
        'subtotal' => (float)$itemTotal
    ];
}

jsonSuccess([
    'cart_count' => $cart_count,
    'cart_total' => (float)$total,
    'currency' => isset($_SESSION['cart'][array_key_first($_SESSION['cart'])])
        ? $_SESSION['cart'][array_key_first($_SESSION['cart'])]['currency']
        : 'PKR',
    'items' => $cart_items
], 'Cart updated successfully');
?>
