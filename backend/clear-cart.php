<?php
require_once("helpers/session_config.php");
header('Content-Type: application/json');

unset($_SESSION['cart']);
echo json_encode(['success' => true, 'message' => 'Cart cleared']);
