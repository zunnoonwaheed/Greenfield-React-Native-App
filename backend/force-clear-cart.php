<?php
require_once("helpers/session_config.php");
header('Content-Type: application/json');

// Force clear everything cart-related
$_SESSION['cart'] = [];
unset($_SESSION['cart']);

// Also destroy and recreate session
session_destroy();
session_start();

echo json_encode([
    'success' => true,
    'message' => 'Cart and session completely cleared',
    'session_id' => session_id()
]);
?>
