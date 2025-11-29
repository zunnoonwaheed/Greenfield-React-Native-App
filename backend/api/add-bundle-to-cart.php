<?php
/**
 * Add Bundle to Cart API
 * Method: POST
 * Params: bundle_id
 * Returns: JSON
 * Authentication: Not required (session-based cart)
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$bundle_id = intval($_POST['bundle_id'] ?? 0);

if ($bundle_id <= 0) {
    jsonError('Bundle ID is required');
}

// Fetch bundle details
$bundle = dbFetchOne(
    $con,
    "SELECT * FROM bundles WHERE id = ? AND (status = 'active' OR status = '1') LIMIT 1",
    'i',
    [$bundle_id]
);

if (!$bundle) {
    jsonError('Bundle not found', 404);
}

// Fetch default currency
$currency = dbFetchOne(
    $con,
    "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1"
);

// Use discounted price or final price
$bundle_price = $bundle['discounted_price'] ?? $bundle['final_price'] ?? $bundle['base_price'];

// Construct full image URL
$imageUrl = '';
if (!empty($bundle['image'])) {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $imageUrl = $protocol . '://' . $host . '/uploads/bundles/' . $bundle['image'];
}

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Add bundle to cart with special identifier
$bundle_cart_id = 'bundle_' . $bundle['id'];

if (!isset($_SESSION['cart'][$bundle_cart_id])) {
    $_SESSION['cart'][$bundle_cart_id] = [
        'id' => $bundle_cart_id,
        'bundle_id' => $bundle['id'],
        'name' => $bundle['name'],
        'price' => (float)$bundle_price,
        'image' => $imageUrl,
        'currency' => $currency['currency'] ?? 'PKR',
        'exchange_rate' => $currency['exchange_rate'] ?? 1,
        'qty' => 0,
        'type' => 'bundle',
        'description' => $bundle['description'] ?? ''
    ];
}
$_SESSION['cart'][$bundle_cart_id]['qty']++;

// Calculate cart totals
$cart_count = array_sum(array_column($_SESSION['cart'], 'qty'));
$total = 0;
$cart_items = [];

foreach ($_SESSION['cart'] as $item) {
    $itemTotal = $item['price'] * $item['qty'];
    $total += $itemTotal;

    $cart_items[] = [
        'id' => $item['id'],
        'name' => $item['name'],
        'price' => (float)$item['price'],
        'quantity' => (int)$item['qty'],
        'image' => $item['image'] ?? '',
        'type' => $item['type'] ?? 'product',
        'subtotal' => (float)$itemTotal
    ];
}

jsonSuccess([
    'cart_count' => $cart_count,
    'cart_total' => (float)$total,
    'currency' => $currency['currency'] ?? 'PKR',
    'items' => $cart_items
], $bundle['name'] . " bundle added to cart!");
?>
