<?php
/**
 * Clear Cart API
 * Method: GET or POST
 * Returns: JSON
 * Authentication: Not required (session-based cart)
 */

session_start();
require_once("../helpers/response.php");

header('Content-Type: application/json');

// Clear cart session
$_SESSION['cart'] = [];

jsonSuccess([
    'cart_count' => 0,
    'cart_total' => 0,
    'currency' => 'PKR',
    'items' => []
], 'Cart cleared successfully');
?>
