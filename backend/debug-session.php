<?php
session_start();
header('Content-Type: application/json');

echo json_encode([
    'session_id' => session_id(),
    'cart' => $_SESSION['cart'] ?? [],
    'cart_keys' => array_keys($_SESSION['cart'] ?? [])
], JSON_PRETTY_PRINT);
