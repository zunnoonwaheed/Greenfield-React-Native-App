<?php
/**
 * Add to Cart API
 * Method: POST
 * Params: product_id, quantity (or qty)
 * Returns: JSON
 * Authentication: Not required (session-based cart)
 */

require_once("../helpers/session_config.php");
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/add-to-cart.php';

// Log incoming request
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], [
    'product_id' => $_POST['product_id'] ?? '',
    'quantity' => $_POST['quantity'] ?? $_POST['qty'] ?? ''
]);

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError($endpoint, 'Method not allowed');
    jsonError('Method not allowed', 405);
}

$product_id = intval($_POST['product_id'] ?? 0);
$qty = max(1, intval($_POST['quantity'] ?? $_POST['qty'] ?? 1));

if ($product_id <= 0) {
    logError($endpoint, 'Product ID is required');
    jsonError('Product ID is required');
}

// Fetch product using prepared statement
$product = dbFetchOne(
    $con,
    "SELECT id, namee, price, dprice, imagee FROM dow WHERE id = ? LIMIT 1",
    'i',
    [$product_id]
);

if (!$product) {
    jsonError('Product not found', 404);
}

// Fetch default currency
$currency = dbFetchOne(
    $con,
    "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1"
);

$finalPrice = $product['dprice'] > 0 ? $product['dprice'] : $product['price'];

// Construct full image URL
$imageUrl = '';
if (!empty($product['imagee'])) {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $product['imagee'];
}

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Add/update cart session
if (!isset($_SESSION['cart'][$product['id']])) {
    $_SESSION['cart'][$product['id']] = [
        'id' => $product['id'],
        'name' => $product['namee'],
        'price' => $finalPrice,
        'image' => $imageUrl,
        'currency' => $currency['currency'] ?? 'PKR',
        'exchange_rate' => $currency['exchange_rate'] ?? 1,
        'qty' => 0,
        'type' => 'product'
    ];
}
$_SESSION['cart'][$product['id']]['qty'] += $qty;

// Calculate cart totals
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
        'image' => $item['image'],
        'subtotal' => (float)$itemTotal
    ];
}

logInfo("Product ID $product_id added to cart (Qty: $qty). Cart count: $cart_count");
logResponse($endpoint, true, null, "Product added to cart");
endTimer($startTime, $endpoint);

jsonSuccess([
    'cart_count' => $cart_count,
    'cart_total' => (float)$total,
    'currency' => $currency['currency'] ?? 'PKR',
    'items' => $cart_items
], $product['namee'] . " added to cart!");
?>
