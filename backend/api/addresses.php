<?php
/**
 * User Addresses API
 * GET - List all addresses for user
 * POST - Add new address
 * DELETE - Remove address (with id parameter)
 * Requires: Authentication
 */

// CORS headers - Must be BEFORE session_start()
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../helpers/session_config.php";
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");
require_once __DIR__ . "/../helpers/notifications.php";

// Authenticate user (supports session, token, and development mode)
$user_id = authenticateUser($con);
if (!$user_id) {
    jsonError('Unauthorized - Please login', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all addresses for user
        $addresses = dbFetchAll(
            $con,
            "SELECT id, label, name, address, building_name, flat, floor, company_name, instructions, is_default, created_at
             FROM user_addresses
             WHERE user_id = ?
             ORDER BY is_default DESC, created_at DESC",
            'i',
            [$user_id]
        );

        jsonSuccess([
            'addresses' => $addresses ?: [],
            'count' => count($addresses ?: [])
        ]);
        break;

    case 'POST':
        // Add new address
        $label = trim($_POST['label'] ?? 'Home');
        $name = trim($_POST['name'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $building_name = trim($_POST['building_name'] ?? '');
        $flat = trim($_POST['flat'] ?? '');
        $floor = trim($_POST['floor'] ?? '');
        $company_name = trim($_POST['company_name'] ?? '');
        $instructions = trim($_POST['instructions'] ?? '');
        $is_default = isset($_POST['is_default']) ? (int)$_POST['is_default'] : 0;

        // Validate required fields
        if (empty($name)) {
            jsonError('Address name/label is required', 422);
        }

        // If this is set as default, unset other defaults first
        if ($is_default) {
            dbExecute($con, "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?", 'i', [$user_id]);
        }

        // Check if this is the first address (make it default automatically)
        $existingCount = dbFetchOne($con, "SELECT COUNT(*) as count FROM user_addresses WHERE user_id = ?", 'i', [$user_id]);
        if ($existingCount && $existingCount['count'] == 0) {
            $is_default = 1;
        }

        // Insert new address
        $query = "INSERT INTO user_addresses (user_id, label, name, address, building_name, flat, floor, company_name, instructions, is_default)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $result = dbExecute($con, $query, 'issssssssi', [
            $user_id, $label, $name, $address, $building_name, $flat, $floor, $company_name, $instructions, $is_default
        ]);

        if ($result['success']) {
            $newId = mysqli_insert_id($con);

            // Build full address string for user profile
            $fullAddress = implode(', ', array_filter([$name, $address]));

            // If this is default, also update user's main address field
            if ($is_default) {
                dbExecute($con, "UPDATE users SET address = ? WHERE id = ?", 'si', [$fullAddress, $user_id]);
            }

            // Fetch the newly created address
            $newAddress = dbFetchOne($con, "SELECT * FROM user_addresses WHERE id = ?", 'i', [$newId]);

            // Create notification for address addition
            if ($newAddress) {
                $shortAddress = substr($address, 0, 50) . (strlen($address) > 50 ? '...' : '');
                createAddressNotification($con, $user_id, $label, $shortAddress);
            }

            jsonSuccess([
                'address' => $newAddress,
                'message' => 'Address added successfully'
            ]);
        } else {
            jsonError('Failed to add address', 500);
        }
        break;

    case 'DELETE':
        // Delete address
        $address_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

        if (!$address_id) {
            jsonError('Address ID is required', 422);
        }

        // Verify address belongs to user
        $existing = dbFetchOne($con, "SELECT id, is_default FROM user_addresses WHERE id = ? AND user_id = ?", 'ii', [$address_id, $user_id]);

        if (!$existing) {
            jsonError('Address not found', 404);
        }

        // Delete the address
        $result = dbExecute($con, "DELETE FROM user_addresses WHERE id = ? AND user_id = ?", 'ii', [$address_id, $user_id]);

        if ($result['success']) {
            // If deleted address was default, set another one as default
            if ($existing['is_default']) {
                $another = dbFetchOne($con, "SELECT id FROM user_addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", 'i', [$user_id]);
                if ($another) {
                    dbExecute($con, "UPDATE user_addresses SET is_default = 1 WHERE id = ?", 'i', [$another['id']]);
                }
            }
            jsonSuccess(['message' => 'Address deleted successfully']);
        } else {
            jsonError('Failed to delete address', 500);
        }
        break;

    default:
        jsonError('Method not allowed', 405);
}
?>
