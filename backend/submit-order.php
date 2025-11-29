<?php
require_once("helpers/session_config.php");
require_once("helpers/notifications.php");
header('Content-Type: application/json');
include("admin/includes/db_settings.php");

$cart = $_SESSION['cart'] ?? [];
if (empty($cart)) {
    echo json_encode(['success' => false, 'message' => 'Your cart is empty']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $currency = 'PKR';

    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += $item['price'] * $item['qty'];
    }

    $delivery_charge = floatval($_POST['delivery_charge'] ?? 0);
    $final_total     = floatval($_POST['final_total'] ?? 0);
    if ($final_total <= 0) {
        $final_total = $subtotal + $delivery_charge;
    }

    $name           = trim($_POST['name'] ?? '');
    $email          = trim($_POST['email'] ?? '');
    $phone          = trim($_POST['phone'] ?? '');
    $guest_address  = trim($_POST['guest_address'] ?? '');
    $password_input = trim($_POST['password'] ?? '');
    $payment_method = trim($_POST['payment_method'] ?? 'pending');
    $create_account = isset($_POST['create_account']) && $_POST['create_account'] == "1";
    $user_id        = null;

    // Agar user login hai
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];

        $stmt = $con->prepare("SELECT name,email,phone,address FROM users WHERE id=? LIMIT 1");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->bind_result($db_name, $db_email, $db_phone, $db_address);
        $stmt->fetch();
        $stmt->close();

        $name          = $name ?: $db_name;
        $email         = $email ?: $db_email;
        $phone         = $phone ?: $db_phone;
        $guest_address = $guest_address ?: $db_address;

    } else {
        // Guest / Create Account Flow
        $stmt = $con->prepare("SELECT id, password FROM users WHERE email=? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

    if ($stmt->num_rows > 0) {
    // Email already exists
    $stmt->bind_result($db_user_id, $db_password_hash);
    $stmt->fetch();
    $stmt->close();

    if ($create_account) {
        // Agar "Create Account" tick hai → password required
        if ($password_input === "") {
            echo json_encode(['success' => false, 'message' => 'Please enter a password to create an account']);
            exit;
        }
        if (!password_verify($password_input, $db_password_hash)) {
            echo json_encode(['success' => false, 'message' => 'Incorrect password. Please try again']);
            exit;
        }
        $user_id = $db_user_id; // login success
    } else {
        // ✅ Guest checkout → ignore password completely
        $user_id = $db_user_id;
    }

} else {
    // Email not registered
    if ($create_account) {
        if ($password_input === "") {
            echo json_encode(['success' => false, 'message' => 'Please provide a password to create an account']);
            exit;
        }
        $hashed_pass = password_hash($password_input, PASSWORD_DEFAULT);
        $stmt_insert = $con->prepare("INSERT INTO users (name,email,password,phone,address) VALUES (?,?,?,?,?)");
        $stmt_insert->bind_param("sssss", $name, $email, $hashed_pass, $phone, $guest_address);
        $stmt_insert->execute();
        $user_id = $stmt_insert->insert_id;
        $stmt_insert->close();
    } else {
        // ✅ Guest order (no account creation)
        $user_id = null;
    }
}
 
    }

    // Insert order
    $stmt = $con->prepare("INSERT INTO orders (user_id,guest_name,guest_email,guest_phone,guest_address,subtotal,delivery_charge,total,currency,payment_status) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("isssssddss", $user_id, $name, $email, $phone, $guest_address, $subtotal, $delivery_charge, $final_total, $currency, $payment_method);
    $stmt->execute();
    $order_id = $stmt->insert_id;
    $stmt->close();

    // Insert order items
    $stmt = $con->prepare("INSERT INTO order_items (order_id,product_id,name,price,qty,total) VALUES (?,?,?,?,?,?)");
    foreach ($cart as $item) {
        $item_total = $item['price'] * $item['qty'];
        $stmt->bind_param("iisddi", $order_id, $item['id'], $item['name'], $item['price'], $item['qty'], $item_total);
        $stmt->execute();
    }
    $stmt->close();
$payment_method = $_POST['payment_method'] ?? 'cod'; // default fallback

    // Create notification for order placement
    if ($user_id) {
        createOrderNotification($con, $user_id, $order_id, 'placed');
    }

unset($_SESSION['cart']);

// Return JSON response
echo json_encode([
    'success' => true,
    'message' => 'Order placed successfully',
    'order_id' => $order_id,
    'payment_method' => $payment_method
]);
exit;
}
?>
