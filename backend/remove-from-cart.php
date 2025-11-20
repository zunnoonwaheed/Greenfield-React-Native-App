<?php
/**
 * Remove from Cart API
 * Method: POST
 * Params: product_id OR id
 * Returns: JSON
 */
header('Content-Type: application/json');
session_start();

$id = intval($_POST['product_id'] ?? $_POST['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit;
}

if (isset($_SESSION['cart'][$id])) {
    $product_name = $_SESSION['cart'][$id]['name'];
    unset($_SESSION['cart'][$id]);

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

    $cart_count = count($_SESSION['cart']);

    echo json_encode([
        'success' => true,
        'message' => $product_name . ' removed from cart',
        'data' => [
            'cart_count' => $cart_count,
            'cart_total' => (float)$total,
            'items' => $cart_items
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Product not in cart']);
}
?>
