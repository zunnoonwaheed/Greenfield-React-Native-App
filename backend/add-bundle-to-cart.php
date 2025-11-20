<?php
header('Content-Type: application/json');
session_start();
include("admin/includes/db_settings.php");

if (!isset($_POST['bundle_id'], $_POST['qty'])) {
    echo json_encode(['success' => false, 'message' => 'Bundle ID and quantity are required']);
    exit;
}

$bundle_id = intval($_POST['bundle_id'] ?? 0);
$qty = max(1, intval($_POST['quantity'] ?? $_POST['qty'] ?? 1));

if ($bundle_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Bundle ID is required']);
    exit;
}

// --- fetch bundle details ---
$bQ = "SELECT * FROM bundles WHERE id = ? AND (status = 'active' OR status = '1') LIMIT 1";
$stmt = $con->prepare($bQ);
$stmt->bind_param("i", $bundle_id);
$stmt->execute();
$bRes = $stmt->get_result();
if (!$bRes || mysqli_num_rows($bRes) == 0) {
    echo json_encode(['success' => false, 'message' => 'Bundle not found']);
    exit;
}
$bundle = mysqli_fetch_assoc($bRes);

// --- fetch currency ---
$cquery = "SELECT currency, exchange_rate FROM exchange WHERE default_currency = 1 LIMIT 1";
$cres = mysqli_query($con, $cquery);
$currency = mysqli_fetch_assoc($cres);

// --- calculate subtotal ---
$subtotal = 0;
$bundleItems = [];
if (!empty($_POST['quantity'])) {
    foreach ($_POST['quantity'] as $product_id => $pqty) {
        $product_id = intval($product_id);
        $pqty = max(1, intval($pqty));

        $pQ = "SELECT namee, price, dprice FROM dow WHERE id = $product_id LIMIT 1";
        $pRes = mysqli_query($con, $pQ);
        if ($pRes && mysqli_num_rows($pRes) > 0) {
            $pRow = mysqli_fetch_assoc($pRes);
            $price = ($pRow['dprice'] > 0 ? $pRow['dprice'] : $pRow['price']) * $currency['exchange_rate'];
            $subtotal += $price * $pqty;
            $bundleItems[] = [
                "id" => $product_id,
                "name" => $pRow['namee'],
                "price" => $price,
                "qty" => $pqty
            ];
        }
    }
}

// --- apply discount ---
$discount = (int)$bundle['discount'];
$finalTotal = $subtotal - ($subtotal * $discount / 100);

// --- create cart item ---
$cartItem = [
    "id" => "bundle_" . $bundle['id'],
    "name" => $bundle['name'],
    "price" => $finalTotal,
    "qty" => $qty,
    "currency" => $currency['currency'],
    "exchange_rate" => $currency['exchange_rate'],
    "is_bundle" => true,
    "items" => $bundleItems
];

// --- add to session cart ---
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$_SESSION['cart'][] = $cartItem;

// Calculate total cart count
$cart_count = 0;
foreach ($_SESSION['cart'] as $item) {
    $cart_count += $item['qty'];
}

// Return JSON response
echo json_encode([
    'success' => true,
    'message' => 'Bundle added to cart successfully',
    'cart_count' => $cart_count
]);
exit;
