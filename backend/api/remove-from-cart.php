<?php
/**
 * Remove from Cart API
 * Method: POST
 * Params: product_id (or id)
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

if ($product_id <= 0) {
    jsonError('Product ID is required');
}

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Check if item exists
if (!isset($_SESSION['cart'][$product_id])) {
    jsonError('Product not found in cart', 404);
}

// Remove item
$product_name = $_SESSION['cart'][$product_id]['name'];
unset($_SESSION['cart'][$product_id]);

// Calculate new totals
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
    'currency' => !empty($_SESSION['cart'])
        ? $_SESSION['cart'][array_key_first($_SESSION['cart'])]['currency']
        : 'PKR',
    'items' => $cart_items
], $product_name . ' removed from cart');
?>
