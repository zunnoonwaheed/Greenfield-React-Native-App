<?php
/**
 * Update Delivery Address API
 * Method: POST
 * Params: address OR (phase, sector, street, etc.)
 * Returns: JSON
 * Requires: Authentication
 */
session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Require authentication
requireAuth();

$user_id = getCurrentUserId();

// Get address (either full address or build from parts)
$address = trim($_POST['address'] ?? '');

if (empty($address)) {
    // Build from parts
    $city = trim($_POST['city'] ?? 'Islamabad');
    $phase = trim($_POST['phase'] ?? '');
    $sector = trim($_POST['sector'] ?? '');
    $street = trim($_POST['street'] ?? '');
    $type = $_POST['type'] ?? 'House';
    $house_number = trim($_POST['house_number'] ?? '');
    $apartment = trim($_POST['apartment_info'] ?? '');

    $address = $city;
    if ($phase) $address .= ", " . $phase;
    if ($sector) $address .= ", " . $sector;
    if ($street) $address .= ", Street: " . $street;
    if ($type === "House" && $house_number) {
        $address .= ", House: " . $house_number;
    }
    if ($type === "Apartment" && $apartment) {
        $address .= ", Apartment: " . $apartment;
    }
}

if (empty($address)) {
    jsonError('Address is required', 422);
}

// Update address
$query = "UPDATE users SET address = ? WHERE id = ?";
$result = dbExecute($con, $query, 'si', [$address, $user_id]);

if ($result['success']) {
    // Update session
    $_SESSION['user_address'] = $address;

    jsonSuccess([
        'address' => $address
    ], 'Delivery address updated successfully');
} else {
    jsonError('Failed to update delivery address', 500);
}
?>
