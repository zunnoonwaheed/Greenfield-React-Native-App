<?php
header('Content-Type: application/json');
session_start();
include("admin/includes/db_settings.php"); // mysqli connection $con

$cart = $_SESSION['cart'] ?? [];
if(empty($cart)){
    echo json_encode(['success' => false, 'message' => 'Cart is empty']);
    exit;
}

$name = mysqli_real_escape_string($con, $_POST['name'] ?? '');
$email = mysqli_real_escape_string($con, $_POST['email'] ?? '');
$address = mysqli_real_escape_string($con, $_POST['address'] ?? '');
$payment = mysqli_real_escape_string($con, $_POST['payment'] ?? '');

$total = 0;
foreach($cart as $item){
    $total += $item['price'] * $item['qty'] * ($item['exchange_rate'] ?? 1);
}

// Insert order
$sql = "INSERT INTO orders (user_name,email,address,payment_method,total_amount,created_at)
        VALUES ('$name','$email','$address','$payment',$total,NOW())";
mysqli_query($con, $sql);
$order_id = mysqli_insert_id($con);

// Insert order items
foreach($cart as $item){
    $itemTotal = $item['price'] * $item['qty'] * ($item['exchange_rate'] ?? 1);
    $iname = mysqli_real_escape_string($con, $item['name']);
    mysqli_query($con,"INSERT INTO order_items (order_id,product_id,product_name,price,qty,total)
                      VALUES ($order_id,{$item['id']},'$iname',{$item['price']},{$item['qty']},$itemTotal)");
}

// Clear cart
unset($_SESSION['cart']);

// Return JSON response
echo json_encode([
    'success' => true,
    'message' => 'Order placed successfully',
    'order_id' => $order_id,
    'total' => $total
]);
exit;
