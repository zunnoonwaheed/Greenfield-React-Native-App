<?php
header('Content-Type: application/json');
session_start();

unset($_SESSION['cart']);
echo json_encode(['success' => true, 'message' => 'Cart cleared']);
