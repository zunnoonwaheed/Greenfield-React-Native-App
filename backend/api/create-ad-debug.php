<?php
/**
 * Create Ad API - DEBUG VERSION
 * POST /api/create-ad-debug.php
 * This version outputs debug info to help find the issue
 */

// SHOW ALL ERRORS
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$debug = [];
$debug['step'] = 'Starting';
$debug['method'] = $_SERVER['REQUEST_METHOD'];

try {
    // Database connection
    $debug['step'] = 'Connecting to database';
    require_once __DIR__ . '/../admin/includes/db_settings.php';

    if (!$con) {
        throw new Exception('Database connection failed');
    }
    $debug['db_connected'] = true;

    // Get user
    $debug['step'] = 'Getting user';
    $result = $con->query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
    if (!$result || $result->num_rows === 0) {
        throw new Exception('No users found');
    }
    $user_id = $result->fetch_assoc()['id'];
    $debug['user_id'] = $user_id;

    // Get POST data
    $debug['step'] = 'Reading POST data';
    $rawInput = file_get_contents('php://input');
    $debug['raw_input_length'] = strlen($rawInput);
    $debug['raw_input_preview'] = substr($rawInput, 0, 200);

    $data = json_decode($rawInput, true);
    if (!$data) {
        $debug['json_error'] = json_last_error_msg();
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }
    $debug['data_keys'] = array_keys($data);

    // Validate required fields
    $debug['step'] = 'Validating fields';
    $required = ['title', 'description', 'price', 'category', 'condition', 'location'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
            throw new Exception("Missing required field: $field");
        }
        $debug["field_$field"] = $data[$field];
    }

    // Extract data
    $debug['step'] = 'Extracting data';
    $title = trim($data['title']);
    $description = trim($data['description']);
    $price = floatval($data['price']);
    $category = trim($data['category']);
    $subcategory = isset($data['subcategory']) ? trim($data['subcategory']) : null;
    $condition = trim($data['condition']);
    $location = trim($data['location']);
    $address = isset($data['address']) ? trim($data['address']) : $location;
    $seller_name = isset($data['seller_name']) ? trim($data['seller_name']) : null;
    $seller_phone = isset($data['seller_phone']) ? trim($data['seller_phone']) : null;
    $seller_email = isset($data['seller_email']) ? trim($data['seller_email']) : null;
    $specifications = isset($data['specifications']) && is_array($data['specifications'])
        ? json_encode($data['specifications'])
        : '[]';

    $debug['extracted_title'] = $title;
    $debug['extracted_price'] = $price;

    // Validate
    $debug['step'] = 'Validating condition';
    $validConditions = ['New', 'Used', 'Like New'];
    if (!in_array($condition, $validConditions)) {
        throw new Exception('Invalid condition: ' . $condition);
    }

    $debug['step'] = 'Validating price';
    if ($price <= 0) {
        throw new Exception('Invalid price: ' . $price);
    }

    // Insert ad
    $debug['step'] = 'Preparing SQL statement';
    $stmt = $con->prepare("
        INSERT INTO marketplace_ads
        (user_id, title, description, price, category, subcategory, `condition`, location, address, seller_name, seller_phone, seller_email, specifications, status, views)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)
    ");

    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $con->error);
    }

    $debug['step'] = 'Binding parameters';
    $stmt->bind_param('issdsssssssss',
        $user_id,
        $title,
        $description,
        $price,
        $category,
        $subcategory,
        $condition,
        $location,
        $address,
        $seller_name,
        $seller_phone,
        $seller_email,
        $specifications
    );

    $debug['step'] = 'Executing insert';
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }

    $ad_id = $con->insert_id;
    $stmt->close();

    $debug['ad_id'] = $ad_id;
    $debug['step'] = 'Ad created successfully';

    // Handle images
    $images = isset($data['images']) && is_array($data['images']) ? array_filter($data['images']) : [];
    $debug['images_count'] = count($images);

    if (!empty($images)) {
        $debug['step'] = 'Inserting images';
        $imgStmt = $con->prepare("INSERT INTO marketplace_ad_images (ad_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)");
        if ($imgStmt) {
            foreach ($images as $index => $image_url) {
                if (!empty($image_url)) {
                    $isPrimary = ($index === 0) ? 1 : 0;
                    $sortOrder = $index;
                    $imgStmt->bind_param('isii', $ad_id, $image_url, $isPrimary, $sortOrder);
                    $imgStmt->execute();
                }
            }
            $imgStmt->close();
        }
    }

    $con->close();

    $debug['step'] = 'Complete';

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Ad created successfully',
        'ad' => [
            'id' => $ad_id,
            'title' => $title,
            'price' => $price,
            'status' => 'active'
        ],
        'debug' => $debug
    ]);

} catch (Exception $e) {
    $debug['error'] = $e->getMessage();
    $debug['error_line'] = $e->getLine();

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => $debug
    ]);
}
?>
