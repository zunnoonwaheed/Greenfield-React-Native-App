<?php
/**
 * Add to Cart API
 * Method: POST
 * Params: product_id, quantity (or qty)
 * Returns: JSON
 */
header('Content-Type: application/json');
session_start();
include("admin/includes/db_settings.php");

$product_id = intval($_POST['product_id'] ?? 0);
$qty = max(1, intval($_POST['quantity'] ?? $_POST['qty'] ?? 1));

if ($product_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit;
}

// Fetch product
$sql = "SELECT id, namee, price, dprice, imagee FROM dow WHERE id = $product_id LIMIT 1";
$result = mysqli_query($con, $sql);
$product = mysqli_fetch_assoc($result);

if (!$product) {
    echo json_encode(['success' => false, 'message' => 'Product not found']);
    exit;
}

// Fetch default currency
$cquery = "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1";
$cres = mysqli_query($con, $cquery);
$currency = mysqli_fetch_assoc($cres);

$finalPrice = $product['dprice'] > 0 ? $product['dprice'] : $product['price'];

// Add/update cart session
if (!isset($_SESSION['cart'][$product['id']])) {
    $_SESSION['cart'][$product['id']] = [
        'id' => $product['id'],
        'name' => $product['namee'],
        'price' => $finalPrice,
        'image' => $product['imagee'],
        'currency' => $currency['currency'],
        'exchange_rate' => $currency['exchange_rate'],
        'qty' => 0
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

// Return JSON
echo json_encode([
    'success' => true,
    'message' => $product['namee'] . " added to cart!",
    'data' => [
        'cart_count' => $cart_count,
        'cart_total' => (float)$total,
        'currency' => $currency['currency'] ?? 'PKR',
        'items' => $cart_items
    ]
]);

