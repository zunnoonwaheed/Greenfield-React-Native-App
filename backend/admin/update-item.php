<?php
// update-item.php
header('Content-Type: application/json; charset=utf-8');
ob_start();
ini_set('display_errors', 0);
error_reporting(0);

require_once 'includes/db_settings.php'; // adjust path if needed

function send_json($arr){
    ob_end_clean();
    echo json_encode($arr);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success'=>false,'message'=>'Invalid request method']);
}

if (empty($_POST['id'])) {
    send_json(['success'=>false,'message'=>'Missing id']);
}

$id = (int) $_POST['id'];
if ($id <= 0) {
    send_json(['success'=>false,'message'=>'Invalid id']);
}

/* --- get order_id --- */
$itemQ = mysqli_query($con, "SELECT order_id FROM order_items WHERE id = $id LIMIT 1");
if (!$itemQ || mysqli_num_rows($itemQ) === 0) {
    send_json(['success'=>false,'message'=>'Item not found']);
}
$item = mysqli_fetch_assoc($itemQ);
$order_id = (int) $item['order_id'];

/* --- update item to out-of-stock --- */
$u1 = "UPDATE order_items SET qty = 0, price = 0, total = 0 WHERE id = $id";
if (!mysqli_query($con, $u1)) {
    send_json(['success'=>false,'message'=>'Failed to update item']);
}

/* --- recalc subtotal (sum of order_items.total) --- */
$subtotalQ = mysqli_query($con, "SELECT COALESCE(SUM(total),0) AS subtotal FROM order_items WHERE order_id = $order_id");
$subtotalRow = mysqli_fetch_assoc($subtotalQ);
$newSubtotal = (float) $subtotalRow['subtotal'];

/* --- fetch current delivery_charge from orders --- */
$orderQ = mysqli_query($con, "SELECT COALESCE(delivery_charge,0) AS delivery_charge FROM orders WHERE id = $order_id LIMIT 1");
$orderRow = mysqli_fetch_assoc($orderQ);
$delivery = (float) $orderRow['delivery_charge'];

/* --- if all items zero, optionally zero delivery --- */
$nonZeroQ = mysqli_query($con, "SELECT COUNT(*) AS cnt FROM order_items WHERE order_id = $order_id AND total > 0");
$cnt = ($nonZeroQ && ($r = mysqli_fetch_assoc($nonZeroQ))) ? (int)$r['cnt'] : 0;
if ($cnt === 0) {
    $delivery = 0;
}

/* --- new total and update orders table --- */
$newTotal = $newSubtotal + $delivery;
$u2 = "UPDATE orders SET subtotal = $newSubtotal, delivery_charge = $delivery, total = $newTotal WHERE id = $order_id";
if (!mysqli_query($con, $u2)) {
    send_json(['success'=>false,'message'=>'Failed to update order']);
}

/* --- success response --- */
send_json([
    'success'  => true,
    'subtotal' => number_format($newSubtotal,2,'.',''),
    'delivery' => number_format($delivery,2,'.',''),
    'total'    => number_format($newTotal,2,'.','')
]);
