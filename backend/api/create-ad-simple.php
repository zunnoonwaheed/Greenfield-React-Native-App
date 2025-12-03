<?php
/**
 * Create Ad API - SIMPLE BULLETPROOF VERSION
 * POST /api/create-ad-simple.php
 */

// NO session_start - just direct creation
ob_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

try {
    // Database connection
    require_once __DIR__ . '/../admin/includes/db_settings.php';
    if (!$con) throw new Exception('DB connection failed');

    // Get first user
    $result = $con->query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
    if (!$result || $result->num_rows === 0) throw new Exception('No users');
    $user_id = $result->fetch_assoc()['id'];

    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) throw new Exception('Invalid JSON');

    // Required fields
    if (empty($data['title'])) throw new Exception('Title required');
    if (empty($data['description'])) throw new Exception('Description required');
    if (empty($data['price'])) throw new Exception('Price required');
    if (empty($data['category'])) throw new Exception('Category required');
    if (empty($data['condition'])) throw new Exception('Condition required');
    if (empty($data['location'])) throw new Exception('Location required');

    // Extract data
    $title = trim($data['title']);
    $description = trim($data['description']);
    $price = floatval($data['price']);
    $category = trim($data['category']);
    $subcategory = !empty($data['subcategory']) ? trim($data['subcategory']) : NULL;
    $condition = trim($data['condition']);
    $location = trim($data['location']);
    $address = !empty($data['address']) ? trim($data['address']) : $location;
    $seller_name = !empty($data['seller_name']) ? trim($data['seller_name']) : NULL;
    $seller_phone = !empty($data['seller_phone']) ? trim($data['seller_phone']) : NULL;
    $seller_email = !empty($data['seller_email']) ? trim($data['seller_email']) : NULL;

    // Specifications
    $specifications = '[]';
    if (!empty($data['specifications']) && is_array($data['specifications'])) {
        $specifications = json_encode($data['specifications']);
    }

    // Validate
    if (!in_array($condition, ['New', 'Used', 'Like New'])) {
        throw new Exception('Invalid condition');
    }
    if ($price <= 0) throw new Exception('Invalid price');

    // Insert ad
    $sql = "INSERT INTO marketplace_ads
            (user_id, title, description, price, category, subcategory, `condition`, location, address, seller_name, seller_phone, seller_email, specifications, status, views)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)";

    $stmt = $con->prepare($sql);
    if (!$stmt) throw new Exception('Prepare failed: ' . $con->error);

    $stmt->bind_param('issdsssssssss',
        $user_id, $title, $description, $price, $category, $subcategory,
        $condition, $location, $address, $seller_name, $seller_phone,
        $seller_email, $specifications
    );

    if (!$stmt->execute()) throw new Exception('Execute failed: ' . $stmt->error);

    $ad_id = $con->insert_id;
    $stmt->close();

    // Insert images
    if (!empty($data['images']) && is_array($data['images'])) {
        $imgStmt = $con->prepare("INSERT INTO marketplace_ad_images (ad_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)");
        if ($imgStmt) {
            foreach ($data['images'] as $index => $image_url) {
                if (!empty($image_url)) {
                    $isPrimary = ($index === 0) ? 1 : 0;
                    $imgStmt->bind_param('isii', $ad_id, $image_url, $isPrimary, $index);
                    $imgStmt->execute();
                }
            }
            $imgStmt->close();
        }
    }

    $con->close();

    // Success
    ob_end_clean();
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Ad created successfully',
        'ad' => [
            'id' => $ad_id,
            'title' => $title,
            'price' => $price,
            'status' => 'active'
        ]
    ]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
